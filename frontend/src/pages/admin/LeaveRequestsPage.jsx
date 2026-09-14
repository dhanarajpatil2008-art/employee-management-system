import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { CalendarClock, Check, X, Clock, AlertCircle, LifeBuoy, AlertTriangle } from 'lucide-react';

// Helper function to calculate calendar days between two dates inclusive
const getLeaveDaysCount = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;
  const start = new Date(fromDate);
  const end = new Date(toDate);
  if (end < start) return 0;
  const diffTime = end.getTime() - start.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : 0;
};

const LeaveRequestsPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/records/leaves/all');
      if (res.data.success) {
        setLeaves(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await API.put(`/records/leaves/${id}/status`, { status });
      if (res.data.success) {
        fetchLeaves();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating leave status');
    }
  };

  const emergencyCount = leaves.filter(
    (l) => l.reason?.includes('[🚨 EMERGENCY OVER-QUOTA]') && l.status === 'Pending'
  ).length;

  const filteredLeaves = leaves.filter((l) => {
    if (filter === 'ALL') return true;
    if (filter === 'EMERGENCY') return l.reason?.includes('[🚨 EMERGENCY OVER-QUOTA]');
    return l.status === filter;
  });

  return (
    <div className="main-wrapper">
      <Navbar
        title="Leave Requests & Emergency Approvals"
        subtitle="Review employee leave applications, enforce 15-day quota & grant Special Emergency Overrides"
      />

      <div className="content-container">
        
        {/* 🚨 Emergency Alert Banner if pending emergency requests exist */}
        {emergencyCount > 0 && (
          <div style={{
            backgroundColor: '#fff1f2',
            border: '1.5px solid #fca5a5',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={22} color="#e11d48" />
              <div>
                <strong style={{ color: '#be123c', fontSize: '0.92rem' }}>
                  Action Required: {emergencyCount} Special Emergency Over-Quota Request(s) Pending!
                </strong>
                <div style={{ fontSize: '0.78rem', color: '#9f1239', marginTop: '2px' }}>
                  These employees have exhausted their 15-day annual quota and requested emergency time-off for critical medical/family reasons.
                </div>
              </div>
            </div>
            <button
              onClick={() => setFilter('EMERGENCY')}
              className="btn btn-sm btn-danger"
              style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Filter Emergency Requests
            </button>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>All Employee Leave Applications</h2>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ALL', 'Pending', 'Approved', 'Rejected', 'EMERGENCY'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`btn btn-sm ${
                    filter === status
                      ? status === 'EMERGENCY'
                        ? 'btn-danger'
                        : 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  style={{ fontSize: '0.82rem' }}
                >
                  {status === 'EMERGENCY' ? '🚨 Special Emergency' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Duration & Days</th>
                  <th>Leave Reason & Category</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => {
                    const daysCount = getLeaveDaysCount(leave.from_date, leave.to_date);
                    const isEmergencyItem = leave.reason?.includes('[🚨 EMERGENCY OVER-QUOTA]');
                    const cleanReason = leave.reason?.replace('[🚨 EMERGENCY OVER-QUOTA]', '').trim();

                    return (
                      <tr
                        key={leave.id}
                        style={{
                          backgroundColor: isEmergencyItem && leave.status === 'Pending' ? '#fff1f2' : 'transparent'
                        }}
                      >
                        <td>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{leave.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{leave.department}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '700', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{leave.from_date?.substring(0, 10)} ➔ {leave.to_date?.substring(0, 10)}</span>
                            <span style={{
                              backgroundColor: isEmergencyItem ? '#fee2e2' : '#e0e7ff',
                              color: isEmergencyItem ? '#b91c1c' : '#4338ca',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              fontWeight: '700'
                            }}>
                              {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                            </span>
                          </div>
                        </td>
                        <td>
                          {isEmergencyItem && (
                            <div style={{ marginBottom: '4px' }}>
                              <span style={{
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid #fca5a5',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <LifeBuoy size={12} />
                                🚨 SPECIAL EMERGENCY OVER-QUOTA
                              </span>
                            </div>
                          )}
                          <div style={{ maxWidth: '280px', fontSize: '0.85rem', color: '#334155' }}>
                            {cleanReason}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {new Date(leave.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              leave.status === 'Approved'
                                ? 'badge-approved'
                                : leave.status === 'Rejected'
                                ? 'badge-rejected'
                                : 'badge-pending'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td>
                          {leave.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                                className={`btn btn-sm ${isEmergencyItem ? 'btn-danger' : 'btn-success'}`}
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                title={isEmergencyItem ? 'Grant Executive Emergency Approval' : 'Approve Leave'}
                              >
                                <Check size={14} />
                                <span>{isEmergencyItem ? 'Grant Emergency' : 'Approve'}</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                <X size={14} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                              Decision Recorded
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No leave requests in this category.
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

export default LeaveRequestsPage;
