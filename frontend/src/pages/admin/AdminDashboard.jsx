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
  ArrowRight
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

        {/* Quick Actions & Department Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Quick Action Shortcuts */}
          <div className="card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => navigate('/admin/employees')}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 18px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserPlus size={18} color="#4f46e5" />
                  <span style={{ fontWeight: '600' }}>Manage Employees & Add New</span>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/admin/attendance')}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 18px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CalendarCheck size={18} color="#10b981" />
                  <span style={{ fontWeight: '600' }}>Mark Today's Attendance</span>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/admin/leaves')}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 18px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CalendarClock size={18} color="#f59e0b" />
                  <span style={{ fontWeight: '600' }}>Review Pending Leave Requests ({stats.pending_leaves})</span>
                </div>
                <ArrowRight size={16} />
              </button>
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
