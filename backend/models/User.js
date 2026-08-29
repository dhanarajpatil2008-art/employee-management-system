import pool from '../config/db.js';

/**
 * 👤 User Model
 * Database queries (CRUD) for `users` table
 */
const User = {
  // 1. Find user by email (For login)
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // 2. Find user by ID (For profile and token verification)
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, department, designation, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // 3. Get all employees list (For admin - includes password)
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, department, designation, role, created_at FROM users ORDER BY id DESC'
    );
    return rows;
  },

  // 4. Create new employee (Register or Admin Add Employee)
  create: async ({ name, email, password, phone, department, designation, role }) => {
    const userRole = role || 'employee';
    const userDept = department || 'General';
    const userDesig = designation || 'Staff';

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, department, designation, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone, userDept, userDesig, userRole]
    );
    return result.insertId;
  },

  // 5. Update employee details
  update: async (id, { name, email, phone, department, designation, role, password }) => {
    if (password && password.trim() !== '') {
      const [result] = await pool.query(
        `UPDATE users 
         SET name = ?, email = ?, password = ?, phone = ?, department = ?, designation = ?, role = ? 
         WHERE id = ?`,
        [name, email, password, phone, department, designation, role, id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await pool.query(
        `UPDATE users 
         SET name = ?, email = ?, phone = ?, department = ?, designation = ?, role = ? 
         WHERE id = ?`,
        [name, email, phone, department, designation, role, id]
      );
      return result.affectedRows > 0;
    }
  },

  // 6. Delete employee
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // 7. Get unique departments summary
  getDepartments: async () => {
    const [rows] = await pool.query(
      `SELECT department, COUNT(*) as employee_count 
       FROM users 
       WHERE role = 'employee' 
       GROUP BY department`
    );
    return rows;
  }
};

export default User;
