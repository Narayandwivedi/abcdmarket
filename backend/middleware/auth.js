const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // If no header token, check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from token
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is no longer valid. User not found.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated.'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Admin authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from token
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      } else {
        req.user = null;
      }

      next();
    } catch (error) {
      // Token is invalid but we don't fail, just continue without user
      req.user = null;
      next();
    }
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Rate limiting middleware for login attempts
const loginLimiter = (req, res, next) => {
  // This is a simple in-memory rate limiter
  // In production, you'd want to use Redis or a proper rate limiting solution
  
  const attempts = req.app.locals.loginAttempts || {};
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // Clean old attempts
  Object.keys(attempts).forEach(key => {
    if (now - attempts[key].firstAttempt > windowMs) {
      delete attempts[key];
    }
  });

  if (!attempts[ip]) {
    attempts[ip] = {
      count: 1,
      firstAttempt: now
    };
  } else {
    attempts[ip].count++;
    
    if (attempts[ip].count > maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
      });
    }
  }

  req.app.locals.loginAttempts = attempts;
  next();
};

// Middleware to check if user owns the resource
const checkResourceOwnership = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // For user-specific resources, check ownership
    const userId = req.params.userId || req.user._id;

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  loginLimiter,
  checkResourceOwnership
};