import express from 'express';
import {
  markAttendance,
  getAttendanceByDate,
  getMyAttendance,
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
  getAdminStats,
  getEmployeeStats
} from '../controllers/recordController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication required for all record routes
router.use(protect);

// ==========================================
// 🕒 1. Attendance Routes
// ==========================================
// Admin marks attendance
router.post('/attendance', requireRole('admin'), markAttendance);

// Admin gets attendance list by date
router.get('/attendance/by-date', requireRole('admin'), getAttendanceByDate);

// Employee gets own attendance history
router.get('/attendance/my', getMyAttendance);

// ==========================================
// 📝 2. Leave Routes
// ==========================================
// Employee submits leave application
router.post('/leaves/apply', applyLeave);

// Admin gets all leave applications
router.get('/leaves/all', requireRole('admin'), getAllLeaves);

// Employee gets own leave applications
router.get('/leaves/my', getMyLeaves);

// Admin approves or rejects leave application
router.put('/leaves/:id/status', requireRole('admin'), updateLeaveStatus);

// ==========================================
// 📈 3. Dashboard Stats Routes
// ==========================================
// Admin dashboard stats (KPIs & Charts)
router.get('/stats/admin', requireRole('admin'), getAdminStats);

// Employee dashboard stats (Personal KPIs)
router.get('/stats/employee', getEmployeeStats);

export default router;
