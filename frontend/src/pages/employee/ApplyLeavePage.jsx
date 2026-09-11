import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { Send, CheckCircle2, AlertCircle, Calendar, ShieldCheck, Clock, Award } from 'lucide-react';

const ANNUAL_LEAVE_QUOTA = 15;

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

  // Calculate used leave days (Approved + Pending, excluding Rejected)
  const totalUsedDays = myLeaves
    .filter((leave) => leave.status !== 'Rejected' && leave.from_date && leave.to_date)
    .reduce((acc, leave) => acc + getLeaveDaysCount(leave.from_date, leave.to_date), 0);

  const approvedDays = myLeaves
    .filter((leave) => leave.status === 'Approved' && leave.from_date && leave.to_date)
    .reduce((acc, leave) => acc + getLeaveDaysCount(leave.from_date, leave.to_date), 0);

  const pendingDays = myLeaves
    .filter((leave) => leave.status === 'Pending' && leave.from_date && leave.to_date)
    .reduce((acc, leave) => acc + getLeaveDaysCount(leave.from_date, leave.to_date), 0);

  const remainingQuota = Math.max(0, ANNUAL_LEAVE_QUOTA - totalUsedDays);
  const requestedDays = getLeaveDaysCount(formData.fromDate, formData.toDate);
  const isQuotaExceeded = requestedDays > remainingQuota;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      setMsg({ type: 'error', text: 'To Date cannot be earlier than From Date.' });
      return;
    }

    if (isQuotaExceeded) {
      setMsg({
        type: 'error',
        text: `Cannot apply! Requested duration (${requestedDays} days) exceeds your remaining quota of ${remainingQuota} day(s) out of 15 annual leaves.`
      });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/records/leaves/apply', formData);
      if (res.data.success) {
        setMsg({
          type: 'success',
          text: `Leave application for ${requestedDays} day(s) submitted successfully (Status: Pending)!`
        });
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
        subtitle="Submit time-off requests to HR with live annual quota enforcement (Max 15 Days/Year)"
      />

      <div className="content-container">
        
        {/* 📊 Annual Leave Balance Summary Header Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Card 1: Annual Quota */}
          <div className="card" style={{ padding: '18px 20px', margin: 0, borderLeft: '4px solid #4f46e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Annual Quota
              </span>
              <Award size={20} color="#4f46e5" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              15 <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Days / Year</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Total allowable yearly time-off
            </div>
          </div>

          {/* Card 2: Used / Applied Days */}
          <div className="card" style={{ padding: '18px 20px', margin: 0, borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Leaves Consumed
              </span>
              <Clock size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              {totalUsedDays} <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Days Used</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              {approvedDays} Approved • {pendingDays} Pending
            </div>
          </div>

          {/* Card 3: Remaining Balance */}
          <div className="card" style={{
            padding: '18px 20px',
            margin: 0,
            borderLeft: `4px solid ${remainingQuota > 0 ? '#10b981' : '#ef4444'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Remaining Balance
              </span>
              <ShieldCheck size={20} color={remainingQuota > 0 ? '#10b981' : '#ef4444'} />
            </div>
            <div style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              color: remainingQuota > 0 ? '#059669' : '#dc2626'
            }}>
              {remainingQuota} <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Days Left</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: remainingQuota > 0 ? '#10b981' : '#ef4444', marginTop: '4px', fontWeight: '600' }}>
              {remainingQuota > 0 ? 'Quota Available' : 'Annual Quota Exhausted'}
            </div>
          </div>
        </div>

        {/* Form and History Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Leave Application Form */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h2>New Leave Application</h2>
              <span className="badge badge-employee">Quota Cap: 15 Max</span>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
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

                {/* 📅 Live Duration & Quota Indicator */}
                {formData.fromDate && formData.toDate && (
                  <div style={{
                    backgroundColor: isQuotaExceeded ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${isQuotaExceeded ? '#fca5a5' : '#bbf7d0'}`,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      color: isQuotaExceeded ? '#b91c1c' : '#15803d'
                    }}>
                      <span>📅 Requested Leave Duration:</span>
                      <span>{requestedDays} Day(s)</span>
                    </div>
                    {isQuotaExceeded ? (
                      <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: '600' }}>
                        ⚠️ Exceeds limit! You only have {remainingQuota} day(s) remaining out of your 15 annual quota.
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#16a34a' }}>
                        ✓ Quota check passed: You will have {remainingQuota - requestedDays} day(s) remaining after this request.
                      </div>
                    )}
                  </div>
                )}

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
                  style={{
                    width: '100%',
                    padding: '13px',
                    opacity: (isQuotaExceeded || remainingQuota === 0) ? 0.6 : 1,
                    cursor: (isQuotaExceeded || remainingQuota === 0) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading || isQuotaExceeded || remainingQuota === 0}
                >
                  <Send size={16} />
                  <span>
                    {remainingQuota === 0
                      ? 'Annual Quota Exhausted (15/15 Used)'
                      : isQuotaExceeded
                      ? 'Requested Days Exceed Quota'
                      : loading
                      ? 'Submitting Request...'
                      : 'Submit Leave Request'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* My Leave Applications History */}
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h2>My Leave Request History</h2>
              <span className="badge badge-employee">{myLeaves.length} Applications</span>
            </div>
            
            <div className="table-responsive" style={{ flex: 1 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Duration & Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.length > 0 ? (
                    myLeaves.map((leave) => {
                      const daysCount = getLeaveDaysCount(leave.from_date, leave.to_date);
                      return (
                        <tr key={leave.id}>
                          <td>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>{leave.from_date?.substring(0, 10)} ➔ {leave.to_date?.substring(0, 10)}</span>
                              <span style={{
                                backgroundColor: '#e0e7ff',
                                color: '#4338ca',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: '700'
                              }}>
                                {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                              Applied on {new Date(leave.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', maxWidth: '180px', color: '#334155' }}>{leave.reason}</div>
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
                      );
                    })
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

            {/* 📊 Total Leave Count & Consumption Summary Footer */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '16px 20px',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>Total Annual Leave Consumption:</span>
                <span style={{ fontWeight: '800', color: totalUsedDays >= 15 ? '#dc2626' : '#4f46e5' }}>
                  {totalUsedDays} / {ANNUAL_LEAVE_QUOTA} Days Used
                </span>
              </div>
              
              {/* Visual Quota Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  style={{
                    width: `${Math.min(100, (totalUsedDays / ANNUAL_LEAVE_QUOTA) * 100)}%`,
                    height: '100%',
                    backgroundColor: totalUsedDays >= 15 ? '#ef4444' : totalUsedDays >= 10 ? '#f59e0b' : '#4f46e5',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                <span>Remaining Quota: <strong>{remainingQuota} Days</strong></span>
                <span>Max Yearly Limit: <strong>15 Days</strong></span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
