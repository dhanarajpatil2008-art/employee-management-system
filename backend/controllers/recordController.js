import Record from '../models/Record.js';

/**
 * ========================================================
 * 🕒 1. ATTENDANCE CONTROLLERS
 * ========================================================
 */

// Admin marks attendance (Present/Absent)
// Endpoint: POST /api/records/attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, date, status, reason } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Status (Present/Absent) are required.'
      });
    }

    const recordId = await Record.markAttendance({
      userId,
      date,
      status,
      reason: reason || ''
    });

    res.status(200).json({
      success: true,
      message: 'Attendance recorded successfully!',
      recordId
    });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record attendance.',
      error: error.message
    });
  }
};

// Admin gets attendance list for a specific date
// Endpoint: GET /api/records/attendance/by-date?date=YYYY-MM-DD
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await Record.getAttendanceByDate(date);
    res.status(200).json({
      success: true,
      date: date || new Date().toISOString().split('T')[0],
      data: attendance
    });
  } catch (error) {
    console.error('Get Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load attendance data.',
      error: error.message
    });
  }
};

// Employee gets own attendance history
// Endpoint: GET /api/records/attendance/my
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Record.getUserAttendance(userId);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get My Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data.',
      error: error.message
    });
  }
};

/**
 * ========================================================
 * 📝 2. LEAVE CONTROLLERS
 * ========================================================
 */

// Employee submits leave request
// Endpoint: POST /api/records/leaves/apply
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start date, end date, and reason.'
      });
    }

    const leaveId = await Record.applyLeave({
      userId,
      fromDate,
      toDate,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully! (Status: Pending)',
      leaveId
    });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit leave request.',
      error: error.message
    });
  }
};

// Admin gets all leave applications
// Endpoint: GET /api/records/leaves/all
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Record.getAllLeaves();
    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    console.error('Get All Leaves Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load leave requests.',
      error: error.message
    });
  }
};

// Employee gets own leave applications
// Endpoint: GET /api/records/leaves/my
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await Record.getUserLeaves(userId);
    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    console.error('Get My Leaves Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load personal leave requests.',
      error: error.message
    });
  }
};

// Admin updates leave status (Approved / Rejected)
// Endpoint: PUT /api/records/leaves/:id/status
export const updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'."
      });
    }

    const updated = await Record.updateLeaveStatus(leaveId, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave record not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave application successfully '${status}'!`
    });
  } catch (error) {
    console.error('Update Leave Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave status.',
      error: error.message
    });
  }
};

/**
 * ========================================================
 * 📈 3. DASHBOARD STATS CONTROLLERS
 * ========================================================
 */

// Admin dashboard stats (KPIs & Summary)
// Endpoint: GET /api/records/stats/admin
export const getAdminStats = async (req, res) => {
  try {
    const stats = await Record.getAdminDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard statistics.',
      error: error.message
    });
  }
};

// Employee dashboard stats (Self KPIs)
// Endpoint: GET /api/records/stats/employee
export const getEmployeeStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Record.getEmployeeDashboardStats(userId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Employee Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load employee statistics.',
      error: error.message
    });
  }
};
