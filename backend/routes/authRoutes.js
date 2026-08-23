import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Employee Registration
router.post('/register', register);

// 2. Admin & Employee Login
router.post('/login', login);

// 3. Get Current User Profile (Protected)
router.get('/me', protect, getMe);

export default router;
