import User from '../models/User.js';

/**
 * 👥 1. Get all employees list (Admin)
 * Endpoint: GET /api/users
 */
export const getAllEmployees = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get All Employees Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee list.',
      error: error.message
    });
  }
};

/**
 * 🔍 2. Get single employee details
 * Endpoint: GET /api/users/:id
 */
export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee data.',
      error: error.message
    });
  }
};

/**
 * ➕ 3. Admin creates new employee
 * Endpoint: POST /api/users
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered.'
      });
    }

    const newId = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      department: department || 'General',
      designation: designation || 'Staff',
      role: role || 'employee'
    });

    const createdUser = await User.findById(newId);

    res.status(201).json({
      success: true,
      message: 'Employee added successfully!',
      data: createdUser
    });
  } catch (error) {
    console.error('Create Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee.',
      error: error.message
    });
  }
};

/**
 * ✏️ 4. Update employee information
 * Endpoint: PUT /api/users/:id
 */
export const updateEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, department, designation, role, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    await User.update(userId, {
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      department: department || user.department,
      designation: designation || user.designation,
      role: role || user.role,
      password: password || ''
    });

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Employee information updated successfully!',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee.',
      error: error.message
    });
  }
};

/**
 * 🗑️ 5. Delete employee
 * Endpoint: DELETE /api/users/:id
 */
export const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent deleting self (Admin)
    if (req.user && req.user.id === Number(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    await User.delete(userId);

    res.status(200).json({
      success: true,
      message: 'Employee removed successfully!'
    });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee.',
      error: error.message
    });
  }
};

/**
 * 🏢 6. Get all departments summary
 * Endpoint: GET /api/users/departments/list
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await User.getDepartments();
    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get Departments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve department data.',
      error: error.message
    });
  }
};
