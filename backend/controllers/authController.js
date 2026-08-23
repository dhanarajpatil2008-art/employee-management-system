import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail, sendAdminNotificationEmail, sendLoginSuccessEmail } from './emailService.js';

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'ems_super_secret_jwt_key_2026_co5k',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * 📝 Register (Employee registration)
 * Endpoint: POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Save new user to database (Plain Text Password)
    const newUserId = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      department: department || 'Information Technology',
      designation: designation || 'Associate Engineer',
      role: 'employee'
    });

    // Generate token
    const token = generateToken(newUserId, 'employee');
    const newUser = await User.findById(newUserId);

    // 📧 Send Welcome and Admin Notification emails in background
    try {
      await sendWelcomeEmail({
        name,
        email,
        password,
        department: department || 'Information Technology',
        designation: designation || 'Associate Engineer'
      });
      await sendAdminNotificationEmail({
        name,
        email,
        department: department || 'Information Technology',
        designation: designation || 'Associate Engineer'
      });
    } catch (emailErr) {
      console.warn('⚠️ Email delivery issue:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully! Welcome email sent.',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration.',
      error: error.message
    });
  }
};

/**
 * 🔑 Login (For both Admin & Employee)
 * Endpoint: POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Plain Text Password check
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password entered.'
      });
    }

    const token = generateToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      designation: user.designation,
      role: user.role,
      created_at: user.created_at
    };

    // 📧 Send Login Success Email in background
    try {
      await sendLoginSuccessEmail({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (emailErr) {
      console.warn('⚠️ Login email delivery issue:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred during login.',
      error: error.message
    });
  }
};

/**
 * 👤 Get Current User Profile
 * Endpoint: GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile data.',
      error: error.message
    });
  }
};
