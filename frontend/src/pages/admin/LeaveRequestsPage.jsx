import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { CalendarClock, Check, X, Clock, AlertCircle } from 'lucide-react';

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

  const filteredLeaves = leaves.filter((l) => {
    if (filter === 'ALL') return true;
    return l.status === filter;
  });

  return (
    <div className="main-wrapper">
      <Navbar
        title="Leave Requests Approval"
        subtitle="Review employee leave applications and grant approvals"
      />

      <div className="content-container">
        <div className="card">
          <div className="card-header">
            <h2>All Employee Leave Applications</h2>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {status}
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
                  <th>Duration (From - To)</th>
                  <th>Reason</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{leave.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{leave.department}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>
                          {leave.from_date?.substring(0, 10)} ➔ {leave.to_date?.substring(0, 10)}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '280px', fontSize: '0.88rem', color: '#334155' }}>
                          {leave.reason}
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
                              className="btn btn-success btn-sm"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                              className="btn btn-danger btn-sm"
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
                  ))
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
