import pool from '../config/db.js';

/**
 * 📊 Record Model
 * SQL queries for handling both 'attendance' and 'leave' records in `records` table
 */
const Record = {
  // ==========================================
  // 🕒 1. ATTENDANCE OPERATIONS
  // ==========================================

  // Mark attendance for an employee on a given date (Upsert: Update if exists, Insert if new)
  markAttendance: async ({ userId, date, status, reason = '' }) => {
    const formattedDate = date || new Date().toISOString().split('T')[0];

    // Check if attendance already exists for that date
    const [existing] = await pool.query(
      `SELECT id FROM records WHERE user_id = ? AND type = 'attendance' AND date = ?`,
      [userId, formattedDate]
    );

    if (existing.length > 0) {
      // Update existing record
      await pool.query(
        `UPDATE records SET status = ?, reason = ? WHERE id = ?`,
        [status, reason, existing[0].id]
      );
      return existing[0].id;
    } else {
      // Insert new record
      const [result] = await pool.query(
        `INSERT INTO records (user_id, type, date, status, reason) VALUES (?, 'attendance', ?, ?, ?)`,
        [userId, formattedDate, status, reason]
      );
      return result.insertId;
    }
  },

  // Get attendance of all employees for a given date (For Admin)
  getAttendanceByDate: async (date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(
      `SELECT 
        u.id as user_id, 
        u.name, 
        u.email, 
        u.department, 
        u.designation,
        r.id as record_id, 
        COALESCE(r.status, 'Not Marked') as status, 
        r.reason,
        r.date
       FROM users u
       LEFT JOIN records r ON u.id = r.user_id AND r.type = 'attendance' AND r.date = ?
       WHERE u.role = 'employee'
       ORDER BY u.name ASC`,
      [targetDate]
    );
    return rows;
  },

  // Get attendance history for a specific employee (For Employee self view)
  getUserAttendance: async (userId) => {
    const [rows] = await pool.query(
      `SELECT id, date, status, reason, created_at 
       FROM records 
       WHERE user_id = ? AND type = 'attendance' 
       ORDER BY date DESC`,
      [userId]
    );
    return rows;
  },

  // ==========================================
  // 📝 2. LEAVE OPERATIONS
  // ==========================================

  // Employee applies for leave (Status = 'Pending')
  applyLeave: async ({ userId, fromDate, toDate, reason }) => {
    const [result] = await pool.query(
      `INSERT INTO records (user_id, type, from_date, to_date, status, reason) 
       VALUES (?, 'leave', ?, ?, 'Pending', ?)`,
      [userId, fromDate, toDate, reason]
    );
    return result.insertId;
  },

  // Get all leave applications (For Admin - Joined with Users table)
  getAllLeaves: async () => {
    const [rows] = await pool.query(
      `SELECT 
        r.id, 
        r.user_id, 
        u.name, 
        u.email, 
        u.department, 
        r.from_date, 
        r.to_date, 
        r.status, 
        r.reason, 
        r.created_at
       FROM records r
       JOIN users u ON r.user_id = u.id
       WHERE r.type = 'leave'
       ORDER BY r.created_at DESC`
    );
    return rows;
  },

  // Get personal leave applications (For Employee self view)
  getUserLeaves: async (userId) => {
    const [rows] = await pool.query(
      `SELECT id, from_date, to_date, status, reason, created_at 
       FROM records 
       WHERE user_id = ? AND type = 'leave' 
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Admin updates leave status ('Approved' / 'Rejected')
  updateLeaveStatus: async (leaveId, status) => {
    const [result] = await pool.query(
      `UPDATE records SET status = ? WHERE id = ? AND type = 'leave'`,
      [status, leaveId]
    );
    return result.affectedRows > 0;
  },

  // ==========================================
  // 📈 3. DASHBOARD STATS (Analytics & KPIs)
  // ==========================================

  // KPI statistics for Admin Dashboard
  getAdminDashboardStats: async () => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Total Employees
    const [[{ total_employees }]] = await pool.query(
      `SELECT COUNT(*) as total_employees FROM users WHERE role = 'employee'`
    );

    // 2. Total Departments
    const [[{ total_departments }]] = await pool.query(
      `SELECT COUNT(DISTINCT department) as total_departments FROM users WHERE role = 'employee'`
    );

    // 3. Today's Attendance count
    const [[{ present_count }]] = await pool.query(
      `SELECT COUNT(*) as present_count FROM records WHERE type = 'attendance' AND date = ? AND status = 'Present'`,
      [today]
    );

    // 4. Pending Leave requests
    const [[{ pending_leaves }]] = await pool.query(
      `SELECT COUNT(*) as pending_leaves FROM records WHERE type = 'leave' AND status = 'Pending'`
    );

    // Attendance percentage calculation
    const attendance_percent = total_employees > 0 
      ? Math.round((present_count / total_employees) * 100) 
      : 0;

    // Department Distribution for Charts
    const [department_distribution] = await pool.query(
      `SELECT department, COUNT(*) as count FROM users WHERE role = 'employee' GROUP BY department`
    );

    return {
      total_employees,
      total_departments,
      present_count,
      attendance_percent,
      pending_leaves,
      department_distribution
    };
  },

  // Personal statistics for Employee Dashboard
  getEmployeeDashboardStats: async (userId) => {
    // Total Present
    const [[{ total_present }]] = await pool.query(
      `SELECT COUNT(*) as total_present FROM records WHERE user_id = ? AND type = 'attendance' AND status = 'Present'`,
      [userId]
    );

    // Total Absent
    const [[{ total_absent }]] = await pool.query(
      `SELECT COUNT(*) as total_absent FROM records WHERE user_id = ? AND type = 'attendance' AND status = 'Absent'`,
      [userId]
    );

    // Leave counts
    const [leaveStats] = await pool.query(
      `SELECT status, COUNT(*) as count FROM records WHERE user_id = ? AND type = 'leave' GROUP BY status`,
      [userId]
    );

    let approved_leaves = 0;
    let pending_leaves = 0;
    let rejected_leaves = 0;

    leaveStats.forEach(item => {
      if (item.status === 'Approved') approved_leaves = item.count;
      if (item.status === 'Pending') pending_leaves = item.count;
      if (item.status === 'Rejected') rejected_leaves = item.count;
    });

    return {
      total_present,
      total_absent,
      approved_leaves,
      pending_leaves,
      rejected_leaves
    };
  }
};

export default Record;
