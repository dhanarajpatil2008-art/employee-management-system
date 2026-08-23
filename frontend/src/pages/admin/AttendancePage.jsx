import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { CalendarCheck, Calendar, Check, X, Clock } from 'lucide-react';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/records/attendance/by-date?date=${selectedDate}`);
      if (res.data.success) {
        setAttendanceList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (userId, status) => {
    setActionLoading(userId);
    try {
      const res = await API.post('/records/attendance', {
        userId,
        date: selectedDate,
        status,
        reason: 'Marked by Admin'
      });
      if (res.data.success) {
        fetchAttendance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating attendance');
    } finally {
      setActionLoading(null);
    }
  };

  // Stats for the selected date
  const presentCount = attendanceList.filter((a) => a.status === 'Present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'Absent').length;
  const unmarkCount = attendanceList.filter((a) => a.status === 'Not Marked').length;

  return (
    <div className="main-wrapper">
      <Navbar
        title="Attendance Management"
        subtitle="Record, review, and track daily employee workforce presence"
      />

      <div className="content-container">
        {/* Date Selector & Summary Bar */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={20} color="#4f46e5" />
              <label style={{ fontWeight: '700', fontSize: '0.95rem' }}>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '6px 14px', fontWeight: '600' }}
              />
            </div>

            {/* Quick Day Badges */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-present" style={{ padding: '6px 12px' }}>
                Present: {presentCount}
              </span>
              <span className="badge badge-absent" style={{ padding: '6px 12px' }}>
                Absent: {absentCount}
              </span>
              <span className="badge badge-pending" style={{ padding: '6px 12px' }}>
                Unmarked: {unmarkCount}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department & Designation</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length > 0 ? (
                  attendanceList.map((item) => (
                    <tr key={item.user_id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>{item.department}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.designation}</div>
                      </td>
                      <td>
                        <strong>{selectedDate}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === 'Present'
                              ? 'badge-present'
                              : item.status === 'Absent'
                              ? 'badge-absent'
                              : 'badge-pending'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleMark(item.user_id, 'Present')}
                            disabled={actionLoading === item.user_id}
                            className="btn btn-success btn-sm"
                            style={{
                              opacity: item.status === 'Present' ? 0.7 : 1
                            }}
                          >
                            <Check size={14} />
                            <span>Present</span>
                          </button>

                          <button
                            onClick={() => handleMark(item.user_id, 'Absent')}
                            disabled={actionLoading === item.user_id}
                            className="btn btn-danger btn-sm"
                            style={{
                              opacity: item.status === 'Absent' ? 0.7 : 1
                            }}
                          >
                            <X size={14} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
