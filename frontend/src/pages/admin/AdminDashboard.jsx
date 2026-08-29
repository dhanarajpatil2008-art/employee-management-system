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
  ShieldCheck,
  CheckCircle2,
  Layers,
  Server
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/records/stats/admin');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <Navbar
        title="Admin Control Center"
        subtitle="Real-time workforce overview and enterprise operational analytics"
      />

      <div className="content-container">
        {/* KPI Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Employees"
            value={stats.total_employees}
            description="Active workforce members"
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Total Departments"
            value={stats.total_departments}
            description="Operational business units"
            icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Today's Attendance"
            value={`${stats.attendance_percent}%`}
            description={`${stats.present_count} marked present today`}
            icon={CheckCircle}
            color="indigo"
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pending_leaves}
            description="Awaiting HR approval"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* Operations Overview & Department Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Workforce Status & Operations Summary */}
          <div className="card">
            <div className="card-header">
              <h2>Workforce Operations & Health</h2>
              <span className="badge badge-admin" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={12} /> Live Sync
              </span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Attendance Progress & Summary */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: '600' }}>
                  <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Today's Presence Rate
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    {stats.attendance_percent}% ({stats.present_count}/{stats.total_employees || 0} Present)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${stats.attendance_percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>

              {/* Leave Pipeline Status */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>Leave Queue Status</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {stats.pending_leaves > 0 ? `${stats.pending_leaves} application(s) awaiting review` : 'All leave applications reviewed'}
                    </div>
                  </div>
                </div>
                <span className={`badge ${stats.pending_leaves > 0 ? 'badge-pending' : 'badge-approved'}`}>
                  {stats.pending_leaves > 0 ? 'Action Needed' : 'All Clear'}
                </span>
              </div>

              {/* System Infrastructure & Security Status */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>Security & Cloud DB</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Aiven MySQL & JWT Authentication</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #d1fae5' }}>
                  Connected 100%
                </span>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="card">
            <div className="card-header">
              <h2>Department Workforce Distribution</h2>
            </div>
            <div style={{ padding: '24px' }}>
              {stats.department_distribution && stats.department_distribution.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {stats.department_distribution.map((dept, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px', fontWeight: '600' }}>
                        <span>{dept.department}</span>
                        <span style={{ color: '#64748b' }}>{dept.count} Employee(s)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${(dept.count / (stats.total_employees || 1)) * 100}%`,
                            height: '100%',
                            backgroundColor: '#4f46e5',
                            borderRadius: '4px'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No department data available yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
