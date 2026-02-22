const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const transporter = require("../config/nodemailer.js");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const handelUserSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, mobile } = req.body;

    // Trim input fields
    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    // Validate mobile number if provided (optional for e-commerce)
    if (mobile && (mobile < 6000000000 || mobile > 9999999999)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number",
      });
    }

    // Check if user already exists by email or mobile
    const query = mobile ? { $or: [{ email }, { mobile }] } : { email };

    const existingUser = await userModel.findOne(query);

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      mobile: mobile || null,
      isEmailVerified: false,
    };

    // Create new user
    const newUser = await userModel.create(newUserData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userData: userObj,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      });
    }

    // Check if input is email or mobile number
    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or mobile number",
      });
    }

    // Find user by email or mobile
    const query = isEmail
      ? { email: emailOrMobile }
      : { mobile: parseInt(emailOrMobile) };

    const user = await userModel.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Convert to object for manipulation and remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    // Update last active time
    user.lastActive = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const generateResetPassOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email address" });
    }

    const getUser = await userModel.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `User with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await getUser.save();

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@computerstore.com",
      to: email,
      subject: "Password Reset OTP - Computer Store",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;

    if (!otp || !newPass || !email) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const getUser = await userModel.findOne({ email });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP exists
    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this user" });
    }

    // Check if OTP is expired
    if (getUser.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Convert both OTP values to numbers for comparison
    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;

      // Clear OTP fields after successful password reset
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;

      await getUser.save();

      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const isloggedin = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "No token found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password -resetOtp -otpExpiresAt");

    if (!user) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "User not found" });
    }

    // Convert to object for manipulation
    const userObj = user.toObject();

    // Update last active time
    user.lastActive = new Date();
    await user.save();

    return res.status(200).json({ isLoggedIn: true, user: userObj });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

// Google OAuth Handler
const handleGoogleAuth = async (req, res) => {
  try {
    if (!GOOGLE_CLIENT_ID || !client) {
      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured on server",
      });
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: fullName,
      picture: profilePicture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified",
      });
    }

    // Check if user exists
    let user = await userModel.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture;
        user.oauthProvider = "google";
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      const newUserData = {
        fullName,
        email,
        googleId,
        profilePicture,
        isEmailVerified: email_verified,
        oauthProvider: "google",
        // Don't set password for Google users
        // Don't set mobile for Google users (will be null)
      };

      user = new userModel(newUserData);
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Prepare user data for response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.googleId;

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      userData: userObj,
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  handleGoogleAuth,
};
