import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  UserPlus,
  CalendarCheck,
  CalendarClock,
  ArrowRight,
  Activity,
  CheckCircle2,
  Layers,
  Briefcase,
  TrendingUp,
  XCircle,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_employees: 0,
    total_departments: 0,
    present_count: 0,
    attendance_percent: 0,
    pending_leaves: 0,
    department_distribution: []
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leavesRes] = await Promise.all([
        API.get('/records/stats/admin'),
        API.get('/records/leaves/all')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (leavesRes.data.success) {
        setRecentLeaves(leavesRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const absentCount = Math.max(0, (stats.total_employees || 0) - (stats.present_count || 0));

  return (
    <div className="main-wrapper">
      <Navbar
        title="Enterprise HR Operations & Analytics"
        subtitle="Real-time executive workforce monitoring, attendance analytics, and operational metrics"
      />

      <div className="content-container">
        {/* 📊 1. Top Executive KPI Metric Ribbon */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <StatCard
            title="Total Workforce"
            value={stats.total_employees}
            description="Active enterprise staff members"
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Operational Departments"
            value={stats.total_departments}
            description="Organizational business units"
            icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Today's Attendance"
            value={`${stats.attendance_percent}%`}
            description={`${stats.present_count} on-duty staff today`}
            icon={CheckCircle}
            color="indigo"
          />
          <StatCard
            title="Pending Leave Queue"
            value={stats.pending_leaves}
            description="Awaiting administrator review"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* 📈 2. PowerBI-Style Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Card A: Workforce Presence & Availability Breakdown */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <div>
                <h2>Workforce Availability & Presence</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Daily presence and leave pipeline distribution</p>
              </div>
              <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={12} /> Live Ratio
              </span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: '700' }}>
                  <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={16} color="#10b981" /> Overall Presence Rate
                  </span>
                  <span style={{ color: '#10b981', fontSize: '1rem' }}>
                    {stats.attendance_percent}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${stats.attendance_percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '5px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>

              {/* 3-Segment Metric Tiles (Present / Absent / Leave Queue) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '14px 12px', borderRadius: '12px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#16a34a', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <CheckCircle2 size={14} /> Present
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                    {stats.present_count}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#65a30d', fontWeight: '600' }}>On-Duty</div>
                </div>

                <div style={{ backgroundColor: '#fef2f2', padding: '14px 12px', borderRadius: '12px', border: '1px solid #fee2e2', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#dc2626', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <XCircle size={14} /> Absent
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
                    {absentCount}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>Unrecorded</div>
                </div>

                <div style={{ backgroundColor: '#fefce8', padding: '14px 12px', borderRadius: '12px', border: '1px solid #fef08a', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ca8a04', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <Clock size={14} /> Pending
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a16207', marginTop: '4px' }}>
                    {stats.pending_leaves}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#ca8a04', fontWeight: '600' }}>Leave Queue</div>
                </div>
              </div>

              {/* Workforce Operational Note */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '600' }}>
                  Staff Compliance & Roster Status
                </span>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: '9999px' }}>
                  100% Operational
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Departmental Workforce Strength & Allocation */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <div>
                <h2>Department Strength & Allocation</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Headcount distribution across active business units</p>
              </div>
              <button
                onClick={() => navigate('/admin/departments')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                View Hierarchy
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {stats.department_distribution && stats.department_distribution.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.department_distribution.map((dept, idx) => {
                    const pct = stats.total_employees > 0 ? Math.round((dept.count / stats.total_employees) * 100) : 0;
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px', fontWeight: '600' }}>
                          <span style={{ color: '#0f172a' }}>{dept.department}</span>
                          <span style={{ color: '#4f46e5', fontWeight: '700' }}>
                            {dept.count} Staff ({pct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: idx % 2 === 0 ? 'linear-gradient(90deg, #4f46e5, #818cf8)' : 'linear-gradient(90deg, #059669, #34d399)',
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No department data available yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* 📋 3. Live Leave Requests Queue & Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Recent Leave Requests & Applications Queue</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Latest employee time-off submissions awaiting management review</p>
            </div>
            <button
              onClick={() => navigate('/admin/leaves')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Manage All Leaves ({stats.pending_leaves})</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Leave Duration</th>
                  <th>Reason / Category</th>
                  <th>Applied On</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.employee_name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{item.department || 'Information Technology'}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{item.from_date?.substring(0, 10)} ➔ {item.to_date?.substring(0, 10)}</strong>
                      </td>
                      <td>
                        <span style={{ color: '#334155', fontSize: '0.85rem' }}>{item.reason}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
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
                    <td colSpan="5" style={{ textAlign: 'center', padding: '28px', color: '#94a3b8' }}>
                      No recent leave applications submitted.
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

export default AdminDashboard;
