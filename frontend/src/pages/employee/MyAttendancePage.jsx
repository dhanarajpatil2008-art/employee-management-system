import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

const MyAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const res = await API.get('/records/attendance/my');
      if (res.data.success) {
        setAttendance(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching my attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <div className="main-wrapper">
      <Navbar
        title="My Attendance Logs"
        subtitle="Review your verified daily presence records and attendance history"
      />

      <div className="content-container">
        {/* Attendance Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Present Days</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{presentCount}</h3>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Absent Days</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{absentCount}</h3>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Logged Days</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{attendance.length}</h3>
            </div>
          </div>
        </div>

        {/* Detailed Attendance Log Table */}
        <div className="card">
          <div className="card-header">
            <h2>Detailed Attendance History</h2>
            <span className="badge badge-employee">{attendance.length} Records</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Attendance Status</th>
                  <th>Remarks / Notes</th>
                  <th>Recorded On</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.date?.substring(0, 10)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === 'Present'
                              ? 'badge-present'
                              : 'badge-absent'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>
                          {item.reason || 'Verified In-Time Entry'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No attendance records found yet.
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

export default MyAttendancePage;
