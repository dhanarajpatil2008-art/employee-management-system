import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments
} from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication required for all user routes
router.use(protect);

// 1. Get all employees list (Admin Only)
router.get('/', requireRole('admin'), getAllEmployees);

// 2. Get list of departments (Admin & Employee)
router.get('/departments/list', getDepartments);

// 3. Get single employee details
router.get('/:id', getEmployeeById);

// 4. Admin adds new employee (Admin Only)
router.post('/', requireRole('admin'), createEmployee);

// 5. Update employee information (Admin Only)
router.put('/:id', requireRole('admin'), updateEmployee);

// 6. Delete employee (Admin Only)
router.delete('/:id', requireRole('admin'), deleteEmployee);

export default router;
