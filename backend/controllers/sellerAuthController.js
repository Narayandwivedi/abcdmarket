const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

const COOKIE_NAME = 'sellerToken';

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

const createSellerToken = (sellerId) =>
  jwt.sign({ sellerId, role: 'seller' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();
const normalizeText = (value = '') => String(value).trim();

const signupSeller = async (req, res) => {
  try {
    const name = normalizeText(req.body?.name);
    const mobile = normalizeText(req.body?.mobile);
    const email = normalizeEmail(req.body?.email);
    const state = normalizeText(req.body?.state);
    const district = normalizeText(req.body?.district || req.body?.distirct);
    const password = normalizeText(req.body?.password);

    if (!name || !mobile || !email || !state || !district || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number',
      });
    }

    const existingSeller = await Seller.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingSeller) {
      if (existingSeller.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Mobile number already exists',
      });
    }

    const seller = await Seller.create({
      name,
      mobile,
      email,
      state,
      district,
      password,
    });

    const token = createSellerToken(seller._id.toString());
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    const sellerData = seller.toObject();
    delete sellerData.password;

    return res.status(201).json({
      success: true,
      message: 'Seller account created successfully',
      sellerData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

const loginSeller = async (req, res) => {
  try {
    const emailOrMobile = normalizeText(req.body?.emailOrMobile);
    const password = normalizeText(req.body?.password);

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Mobile and password are required',
      });
    }

    const isEmail = emailOrMobile.includes('@');
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email or mobile number',
      });
    }

    const query = isEmail
      ? { email: normalizeEmail(emailOrMobile) }
      : { mobile: emailOrMobile };

    const seller = await Seller.findOne(query).select('+password');
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!seller.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Seller account is inactive',
      });
    }

    const isPasswordValid = await seller.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = createSellerToken(seller._id.toString());
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    const sellerData = seller.toObject();
    delete sellerData.password;

    return res.status(200).json({
      success: true,
      message: 'Seller login successful',
      sellerData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

const logoutSeller = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    success: true,
    message: 'Seller logged out successfully',
  });
};

const getSellerMe = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({
        success: false,
        isLoggedIn: false,
        message: 'No token found',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.sellerId).select('-password');

    if (!seller) {
      return res.status(401).json({
        success: false,
        isLoggedIn: false,
        message: 'Seller not found',
      });
    }

    return res.status(200).json({
      success: true,
      isLoggedIn: true,
      sellerData: seller,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      isLoggedIn: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = {
  signupSeller,
  loginSeller,
  logoutSeller,
  getSellerMe,
};
