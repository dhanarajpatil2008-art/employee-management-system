import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import {
  CheckCircle,
  XCircle,
  CalendarClock,
  Clock,
  Send,
  Calendar,
  Mail,
  Phone,
  Building,
  Briefcase,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_present: 0,
    total_absent: 0,
    approved_leaves: 0,
    pending_leaves: 0
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leavesRes] = await Promise.all([
        API.get('/records/stats/employee'),
        API.get('/records/leaves/my')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (leavesRes.data.success) {
        setRecentLeaves(leavesRes.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching employee dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <Navbar
        title={`Welcome, ${user?.name || 'Employee'}!`}
        subtitle="Your employee workspace, personal metrics, and workforce services"
      />

      <div className="content-container">
        {/* 📊 KPI Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Present Days"
            value={stats.total_present}
            description="Verified attendance logs"
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard
            title="Absent Days"
            value={stats.total_absent}
            description="Unrecorded working days"
            icon={XCircle}
            color="rose"
          />
          <StatCard
            title="Approved Leaves"
            value={stats.approved_leaves}
            description="Granted time-off requests"
            icon={CalendarClock}
            color="indigo"
          />
          <StatCard
            title="Pending Requests"
            value={stats.pending_leaves}
            description="Awaiting HR approval"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* 📊 Workplace Attendance & Quick Operations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Workplace Attendance & Leave Summary */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h2>Attendance & Duty Summary</h2>
              <span className="badge badge-approved">Verified Record</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Attendance Rate Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: '600' }}>
                  <span style={{ color: '#0f172a' }}>Personal Presence Ratio</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    {(stats.total_present + stats.total_absent) > 0 
                      ? `${Math.round((stats.total_present / (stats.total_present + stats.total_absent)) * 100)}%` 
                      : '100%'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(stats.total_present + stats.total_absent) > 0 
                        ? Math.round((stats.total_present / (stats.total_present + stats.total_absent)) * 100) 
                        : 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              {/* Time-Off Breakdown */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                  Approved Time-Off Granted
                </div>
                <span className="badge badge-approved" style={{ fontSize: '0.82rem' }}>
                  {stats.approved_leaves} Days
                </span>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                  Pending Applications in Review
                </div>
                <span className={`badge ${stats.pending_leaves > 0 ? 'badge-pending' : 'badge-employee'}`} style={{ fontSize: '0.82rem' }}>
                  {stats.pending_leaves} Requests
                </span>
              </div>
            </div>
          </div>

          {/* Employee Quick Actions & Shortcuts Card */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h2>Workforce Actions & Services</h2>
              <span className="badge badge-employee">Quick Services</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/employee/apply-leave')}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: '700'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Send size={18} />
                  <span>Submit New Leave Application</span>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/employee/my-attendance')}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: '700'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} />
                  <span>View Monthly Attendance History</span>
                </div>
                <ArrowRight size={16} />
              </button>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#64748b'
              }}>
                <span>Duty Status:</span>
                <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                  ● Active On-Duty
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 📋 Recent Leave Applications Table */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Leave Applications</h2>
            <button
              onClick={() => navigate('/employee/apply-leave')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All / Apply</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Leave Duration</th>
                  <th>Reason</th>
                  <th>Submitted Date</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.from_date?.substring(0, 10)} ➔ {item.to_date?.substring(0, 10)}</strong>
                      </td>
                      <td>
                        <span style={{ color: '#334155', fontSize: '0.88rem' }}>{item.reason}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === 'Approved'
                              ? 'badge-approved'
                              : item.status === 'Rejected'
                              ? 'badge-rejected'
                              : 'badge-pending'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '28px', color: '#94a3b8' }}>
                      No recent leave requests submitted.
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

export default EmployeeDashboard;
