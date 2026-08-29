import React, { useState, useEffect, useMemo } from 'react';
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
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  PieChart,
  BarChart3,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Raw API State
  const [stats, setStats] = useState({
    total_employees: 0,
    total_departments: 0,
    present_count: 0,
    attendance_percent: 0,
    pending_leaves: 0,
    department_distribution: []
  });
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎛️ PowerBI Slicers & Filters State
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [timeRange, setTimeRange] = useState('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const [statsRes, leavesRes, usersRes, attRes] = await Promise.all([
        API.get('/records/stats/admin'),
        API.get('/records/leaves/all'),
        API.get('/users'),
        API.get(`/records/attendance/by-date?date=${today}`)
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (leavesRes.data.success) setLeaves(leavesRes.data.data);
      if (usersRes.data.success) setEmployees(usersRes.data.data.filter(u => u.role === 'employee'));
      if (attRes.data.success) setTodayAttendance(attRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Dynamic Filtered Slicing (PowerBI Engine)
  const departmentsList = useMemo(() => {
    const depts = new Set(['Information Technology', 'Human Resources', 'Finance', 'Management', 'Marketing']);
    employees.forEach(e => { if (e.department) depts.add(e.department); });
    return Array.from(depts);
  }, [employees]);

  // Compute sliced metrics based on selected filters
  const slicedData = useMemo(() => {
    // 1. Filtered Employees
    let emps = employees;
    if (selectedDept !== 'ALL') {
      emps = emps.filter(e => e.department === selectedDept);
    }

    const totalEmps = emps.length;

    // 2. Filtered Today's Attendance
    const empIds = new Set(emps.map(e => e.id));
    const relevantAtt = todayAttendance.filter(a => empIds.has(a.user_id));
    const presentCount = relevantAtt.filter(a => a.status === 'Present').length;
    const absentCount = Math.max(0, totalEmps - presentCount);
    const attPercent = totalEmps > 0 ? Math.round((presentCount / totalEmps) * 100) : 0;

    // 3. Filtered Leaves
    let filteredLeaves = leaves;
    if (selectedDept !== 'ALL') {
      filteredLeaves = filteredLeaves.filter(l => {
        const emp = employees.find(e => e.id === l.user_id);
        return emp ? emp.department === selectedDept : false;
      });
    }

    if (selectedStatus !== 'ALL') {
      filteredLeaves = filteredLeaves.filter(l => l.status === selectedStatus);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filteredLeaves = filteredLeaves.filter(l =>
        l.employee_name?.toLowerCase().includes(q) ||
        l.reason?.toLowerCase().includes(q)
      );
    }

    const pendingLeavesCount = filteredLeaves.filter(l => l.status === 'Pending').length;

    // 4. Department Distribution for chart
    const deptDist = departmentsList.map(dept => {
      const count = employees.filter(e => e.department === dept).length;
      return { department: dept, count };
    }).filter(d => d.count > 0);

    return {
      totalEmployees: totalEmps,
      presentCount,
      absentCount,
      attendancePercent: attPercent,
      pendingLeavesCount,
      filteredLeaves,
      deptDist
    };
  }, [employees, todayAttendance, leaves, selectedDept, selectedStatus, searchQuery, departmentsList]);

  const handleResetFilters = () => {
    setSelectedDept('ALL');
    setSelectedStatus('ALL');
    setTimeRange('TODAY');
    setSearchQuery('');
  };

  return (
    <div className="main-wrapper">
      <Navbar
        title="Executive HR Intelligence & Analytics"
        subtitle="PowerBI enterprise workforce intelligence, real-time slicers, and departmental telemetry"
      />

      <div className="content-container">

        {/* 🎛️ 1. PowerBI Slicer Bar / Filter Pane */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '18px 24px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Slicer Header & Active Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}>
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  PowerBI Interactive Slicers & Department Filters
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                  Filter dashboard metrics, presence ratio, and leave queues in real-time
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(selectedDept !== 'ALL' || selectedStatus !== 'ALL' || searchQuery !== '') && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', gap: '4px', padding: '6px 12px' }}
                >
                  <RefreshCw size={12} /> Reset Slicers
                </button>
              )}
              <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={12} /> Live Telemetry
              </span>
            </div>
          </div>

          {/* Slicer Pills Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginRight: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} color="#6366f1" /> Department Slicer:
            </span>

            <button
              onClick={() => setSelectedDept('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: selectedDept === 'ALL' ? '#0f172a' : '#f1f5f9',
                color: selectedDept === 'ALL' ? '#ffffff' : '#475569',
                boxShadow: selectedDept === 'ALL' ? '0 4px 10px rgba(15, 23, 42, 0.2)' : 'none'
              }}
            >
              All Enterprise ({employees.length})
            </button>

            {departmentsList.map((dept, idx) => {
              const count = employees.filter(e => e.department === dept).length;
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDept(isSelected ? 'ALL' : dept)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? '#4f46e5' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#475569',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
                  }}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>

          {/* Secondary Slicers: Status & Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={13} color="#6366f1" /> Status Slicer:
              </span>
              {['ALL', 'Pending', 'Approved', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedStatus === st ? '#4f46e5' : '#e2e8f0',
                    backgroundColor: selectedStatus === st ? '#eef2ff' : '#ffffff',
                    color: selectedStatus === st ? '#4f46e5' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {st === 'ALL' ? 'All Records' : st}
                </button>
              ))}
            </div>

            <div className="search-box" style={{ maxWidth: '280px', width: '100%', height: '36px' }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search filtered records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

        {/* 📊 2. Dynamic Executive KPI Metric Ribbon */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <StatCard
            title={selectedDept === 'ALL' ? 'Total Organization Workforce' : `${selectedDept} Workforce`}
            value={slicedData.totalEmployees}
            description={selectedDept === 'ALL' ? 'Across all operational divisions' : `Assigned to ${selectedDept}`}
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Operational Departments"
            value={selectedDept === 'ALL' ? departmentsList.length : 1}
            description={selectedDept === 'ALL' ? 'Active business departments' : 'Active Sliced View'}
            icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Today's Presence Ratio"
            value={`${slicedData.attendancePercent}%`}
            description={`${slicedData.presentCount} on-duty staff today`}
            icon={CheckCircle}
            color="indigo"
          />
          <StatCard
            title="Filtered Leave Queue"
            value={slicedData.pendingLeavesCount}
            description="Awaiting HR approval"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* 📈 3. PowerBI Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Card A: Workforce Presence & Availability Breakdown */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <div>
                <h2>Workforce Availability Telemetry</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  {selectedDept === 'ALL' ? 'Enterprise Presence & Duty Slicer' : `${selectedDept} Presence Telemetry`}
                </p>
              </div>
              <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} /> {slicedData.attendancePercent}% Rate
              </span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Gauge Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '8px', fontWeight: '700' }}>
                  <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Presence Compliance Rate
                  </span>
                  <span style={{ color: '#10b981', fontSize: '1.05rem', fontWeight: '800' }}>
                    {slicedData.attendancePercent}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${slicedData.attendancePercent}%`,
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
                <div style={{ backgroundColor: '#f0fdf4', padding: '16px 12px', borderRadius: '12px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#16a34a', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <CheckCircle2 size={14} /> Present
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                    {slicedData.presentCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#65a30d', fontWeight: '600' }}>On-Duty Staff</div>
                </div>

                <div style={{ backgroundColor: '#fef2f2', padding: '16px 12px', borderRadius: '12px', border: '1px solid #fee2e2', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#dc2626', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <XCircle size={14} /> Absent
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>
                    {slicedData.absentCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '600' }}>Unrecorded</div>
                </div>

                <div style={{ backgroundColor: '#fefce8', padding: '16px 12px', borderRadius: '12px', border: '1px solid #fef08a', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ca8a04', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    <Clock size={14} /> Pending
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a16207', marginTop: '4px' }}>
                    {slicedData.pendingLeavesCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#ca8a04', fontWeight: '600' }}>Leave Queue</div>
                </div>
              </div>

              {/* Sliced Department Info Tag */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '600' }}>
                  Selected Slicer Focus: <strong>{selectedDept === 'ALL' ? 'Whole Organization' : selectedDept}</strong>
                </span>
                <span style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: '700', backgroundColor: '#e0e7ff', padding: '3px 10px', borderRadius: '9999px' }}>
                  {slicedData.totalEmployees} Active Staff
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Departmental Workforce Strength & Interactive Slicer Bars */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <div>
                <h2>Department Strength & Allocation</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Click any department bar below to instantly slice dashboard data
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/departments')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                View Full Roster
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {slicedData.deptDist && slicedData.deptDist.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {slicedData.deptDist.map((dept, idx) => {
                    const total = employees.length || 1;
                    const pct = Math.round((dept.count / total) * 100);
                    const isSelected = selectedDept === dept.department;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDept(isSelected ? 'ALL' : dept.department)}
                        style={{
                          cursor: 'pointer',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#eef2ff' : 'transparent',
                          border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                          transition: 'all 0.2s ease'
                        }}
                        title={`Click to filter by ${dept.department}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px', fontWeight: '600' }}>
                          <span style={{ color: isSelected ? '#4f46e5' : '#0f172a', fontWeight: isSelected ? '800' : '600' }}>
                            {dept.department} {isSelected && '✓ (Active Slicer)'}
                          </span>
                          <span style={{ color: '#4f46e5', fontWeight: '700' }}>
                            {dept.count} Staff ({pct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: isSelected
                                ? 'linear-gradient(90deg, #4f46e5, #6366f1)'
                                : idx % 2 === 0
                                ? 'linear-gradient(90deg, #4f46e5, #818cf8)'
                                : 'linear-gradient(90deg, #059669, #34d399)',
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No department data available.</p>
              )}
            </div>
          </div>

        </div>

        {/* 📋 4. Sliced Leave Requests Queue & Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Filtered Leave Requests Queue & Telemetry</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Showing {slicedData.filteredLeaves.length} record(s) matching selected slicers ({selectedDept === 'ALL' ? 'All Departments' : selectedDept}, Status: {selectedStatus})
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/leaves')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Manage All Approvals</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Leave Duration</th>
                  <th>Reason / Category</th>
                  <th>Applied On</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {slicedData.filteredLeaves.length > 0 ? (
                  slicedData.filteredLeaves.slice(0, 6).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.employee_name}</div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: '#334155',
                          fontWeight: '600'
                        }}>
                          {item.department || 'General'}
                        </span>
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
                    <td colSpan="6" style={{ textAlign: 'center', padding: '28px', color: '#94a3b8' }}>
                      No leave requests match the selected slicers and search criteria.
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
