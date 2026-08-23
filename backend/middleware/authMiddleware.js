import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * 🔒 1. Protect Middleware: Check if user is authenticated (JWT Token Validation)
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Header contains 'Authorization: Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ems_super_secret_jwt_key_2026_co5k');

      // Find user from database using decoded ID
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User does not exist.' });
      }

      // Save user info to req.user
      req.user = user;
      next(); // Proceed to next controller
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token found. Please log in.' });
  }
};

/**
 * 👑 2. Require Role Middleware: Check user role (e.g. admin or employee)
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: You must have '${roles.join(' or ')}' role to perform this action.`
      });
    }
    next();
  };
};
