import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ApplyLeavePage = () => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const res = await API.get('/records/leaves/my');
      if (res.data.success) {
        setMyLeaves(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching my leaves:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setLoading(true);

    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      setMsg({ type: 'error', text: 'To Date cannot be earlier than From Date.' });
      setLoading(false);
      return;
    }

    try {
      const res = await API.post('/records/leaves/apply', formData);
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Leave application submitted successfully (Status: Pending)!' });
        setFormData({ fromDate: '', toDate: '', reason: '' });
        fetchMyLeaves();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error submitting leave.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <Navbar
        title="Apply for Leave"
        subtitle="Submit time-off requests to HR and track live approval status"
      />

      <div className="content-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Leave Application Form */}
          <div className="card">
            <div className="card-header">
              <h2>New Leave Application</h2>
            </div>
            <div style={{ padding: '24px' }}>
              {msg.text && (
                <div style={{
                  backgroundColor: msg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: msg.type === 'success' ? '#047857' : '#b91c1c',
                  border: `1px solid ${msg.type === 'success' ? '#a7f3d0' : '#fee2e2'}`,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}>
                  {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{msg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Reason for Leave</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control"
                    placeholder="Provide a reason for your leave request (e.g. Medical emergency, Family function, Urgent personal work)..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '13px' }}
                  disabled={loading}
                >
                  <Send size={16} />
                  <span>{loading ? 'Submitting Request...' : 'Submit Leave Request'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* My Leave Applications History */}
          <div className="card">
            <div className="card-header">
              <h2>My Leave Request History</h2>
              <span className="badge badge-employee">{myLeaves.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.length > 0 ? (
                    myLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>
                          <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                            {leave.from_date?.substring(0, 10)} ➔ {leave.to_date?.substring(0, 10)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Applied on {new Date(leave.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', maxWidth: '200px', color: '#334155' }}>{leave.reason}</div>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No leave applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
