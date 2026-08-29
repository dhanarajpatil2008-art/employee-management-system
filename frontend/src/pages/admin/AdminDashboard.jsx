import React, { useState, useEffect, useMemo } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  RotateCcw,
  Calendar,
  Layers,
  Award,
  TrendingUp,
  UserCheck,
  Briefcase,
  SlidersHorizontal
} from 'lucide-react';

const AdminDashboard = () => {
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

  // 🎛️ Power BI Slicers State (Matching Reference)
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Present' | 'Absent' | 'Pending'
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [dropdownDept, setDropdownDept] = useState('All');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

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

  // List of all unique departments
  const allDepartments = useMemo(() => {
    const depts = new Set(['Information Technology', 'Human Resources', 'Finance', 'Management', 'Marketing']);
    employees.forEach(e => { if (e.department) depts.add(e.department); });
    return Array.from(depts);
  }, [employees]);

  // Reset Filters handler
  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setSelectedDepts([]);
    setDropdownDept('All');
    setStartDate('2026-01-01');
    setEndDate('2026-12-31');
  };

  // Toggle department checkbox
  const handleDeptCheckbox = (dept) => {
    setSelectedDepts(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  // Sliced Dynamic Calculations
  const filteredData = useMemo(() => {
    let emps = employees;

    // Filter by dropdown or checkboxes
    const activeDepts = selectedDepts.length > 0
      ? selectedDepts
      : (dropdownDept !== 'All' ? [dropdownDept] : []);

    if (activeDepts.length > 0) {
      emps = emps.filter(e => activeDepts.includes(e.department));
    }

    const totalEmps = emps.length;
    const empIds = new Set(emps.map(e => e.id));

    // Attendance calculation
    const relevantAtt = todayAttendance.filter(a => empIds.has(a.user_id));
    let presentCount = relevantAtt.filter(a => a.status === 'Present').length;
    let absentCount = Math.max(0, totalEmps - presentCount);

    if (statusFilter === 'Present') {
      absentCount = 0;
    } else if (statusFilter === 'Absent') {
      presentCount = 0;
    }

    const attRate = totalEmps > 0 ? Math.round((presentCount / totalEmps) * 100) : 0;

    // Leaves calculation
    let relevantLeaves = leaves.filter(l => {
      const emp = employees.find(e => e.id === l.user_id);
      return emp && (activeDepts.length === 0 || activeDepts.includes(emp.department));
    });

    if (statusFilter === 'Pending') {
      relevantLeaves = relevantLeaves.filter(l => l.status === 'Pending');
    }

    const pendingLeaves = relevantLeaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = relevantLeaves.filter(l => l.status === 'Approved').length;
    const rejectedLeaves = relevantLeaves.filter(l => l.status === 'Rejected').length;

    // Department Distribution
    const deptDist = allDepartments.map(dept => {
      const count = emps.filter(e => e.department === dept).length;
      return { department: dept, count };
    }).filter(d => d.count > 0);

    return {
      totalEmps,
      presentCount,
      absentCount,
      attRate,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      deptDist,
      totalDepts: activeDepts.length > 0 ? activeDepts.length : allDepartments.length
    };
  }, [employees, todayAttendance, leaves, statusFilter, selectedDepts, dropdownDept, allDepartments]);

  // Donut chart colors
  const donutColors = ['#0078d4', '#744da9', '#00b7c3', '#e3008c', '#ffaa44', '#107c41'];

  // Monthly trend simulated points
  const monthlyPoints = [
    { month: 'Jan', val: 78 },
    { month: 'Feb', val: 88 },
    { month: 'Mar', val: 95 },
    { month: 'Apr', val: 70 },
    { month: 'May', val: 84 },
    { month: 'Jun', val: 90 },
    { month: 'Jul', val: 82 },
    { month: 'Aug', val: 68 },
    { month: 'Sep', val: 92 },
    { month: 'Oct', val: 76 },
    { month: 'Nov', val: 89 },
    { month: 'Dec', val: Math.max(50, filteredData.attRate || 85) }
  ];

  return (
    <div className="main-wrapper" style={{ backgroundColor: '#edf1f7' }}>
      <Navbar
        title="Admin Control Center"
        subtitle="Power BI Workforce Analytics & Executive Telemetry"
      />

      <div style={{ padding: '16px 20px', maxWidth: '1440px', margin: '0 auto' }}>

        {/* 🏷️ Power BI Top Header Bar */}
        <div style={{
          backgroundColor: '#061138',
          color: '#ffffff',
          borderRadius: '4px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.7)',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '2px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>

          {/* Title */}
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '900',
            letterSpacing: '1px',
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            EMPLOYEE ANALYTICS DASHBOARD |
          </div>

          <div style={{ width: '110px' }}></div>
        </div>

        {/* 📊 Main Power BI Dashboard 3-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '170px 1fr 220px',
          gap: '14px',
          alignItems: 'start'
        }}>

          {/* ======================================================== */}
          {/* 1️⃣ LEFT COLUMN: 5 KPI Metric Cards Stack                  */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* KPI 1: Total Employees */}
            <div style={powerBiKpiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>
                <Users size={14} color="#0078d4" />
                <span>Total Employees</span>
              </div>
              <div style={kpiNumberStyle}>{filteredData.totalEmps}</div>
              <div style={kpiSubtextStyle}>Total Staff</div>
            </div>

            {/* KPI 2: Total Present */}
            <div style={powerBiKpiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>
                <UserCheck size={14} color="#107c41" />
                <span>Total Present</span>
              </div>
              <div style={kpiNumberStyle}>{filteredData.presentCount}</div>
              <div style={kpiSubtextStyle}>On-Duty Today</div>
            </div>

            {/* KPI 3: Attendance Rate */}
            <div style={powerBiKpiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>
                <TrendingUp size={14} color="#0078d4" />
                <span>Attendance Rate</span>
              </div>
              <div style={kpiNumberStyle}>{filteredData.attRate}%</div>
              <div style={kpiSubtextStyle}>Presence Ratio</div>
            </div>

            {/* KPI 4: Pending Leaves */}
            <div style={powerBiKpiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>
                <Clock size={14} color="#d83b01" />
                <span>Pending Leaves</span>
              </div>
              <div style={kpiNumberStyle}>{filteredData.pendingLeaves}</div>
              <div style={kpiSubtextStyle}>Approval Queue</div>
            </div>

            {/* KPI 5: Total Departments */}
            <div style={powerBiKpiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>
                <Building2 size={14} color="#744da9" />
                <span>Total Departments</span>
              </div>
              <div style={kpiNumberStyle}>{filteredData.totalDepts}</div>
              <div style={kpiSubtextStyle}>Operational Units</div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 2️⃣ CENTER COLUMN: Power BI Visual Charts Grid            */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Row A: Line Chart & Donut Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              
              {/* Monthly Attendance Trend (Line Chart) */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Monthly Attendance Trend</div>
                <div style={{ height: '140px', width: '100%', position: 'relative', marginTop: '6px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 340 120" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="340" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="340" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="340" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    {/* Trend Line Path */}
                    <path
                      d="M 15,95 L 42,75 L 70,55 L 98,25 L 126,85 L 154,60 L 182,50 L 210,70 L 238,90 L 266,45 L 294,75 L 325,40"
                      fill="none"
                      stroke="#2b579a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Dots */}
                    {[
                      [15,95], [42,75], [70,55], [98,25], [126,85], [154,60],
                      [182,50], [210,70], [238,90], [266,45], [294,75], [325,40]
                    ].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="3" fill="#2b579a" />
                    ))}
                  </svg>
                </div>
                {/* X-axis months */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', marginTop: '2px' }}>
                  {monthlyPoints.map((p, i) => (
                    <span key={i}>{p.month}</span>
                  ))}
                </div>
              </div>

              {/* Department Headcount Distribution (Donut Chart) */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Department Distribution</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '140px' }}>
                  {/* SVG Donut Ring */}
                  <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      {/* Background circle */}
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                      {/* Segment 1 */}
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#0078d4" strokeWidth="6" strokeDasharray="35 65" strokeDashoffset="0" />
                      {/* Segment 2 */}
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#744da9" strokeWidth="6" strokeDasharray="34 66" strokeDashoffset="-35" />
                      {/* Segment 3 */}
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#00b7c3" strokeWidth="6" strokeDasharray="31 69" strokeDashoffset="-69" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0078d4' }}></span>
                      <span>IT (35%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#744da9' }}></span>
                      <span>HR (34%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00b7c3' }}></span>
                      <span>Finance (31%)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Row B: Pie Chart & Vertical Bar Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
              
              {/* Attendance Status Pie Chart */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Attendance Status Ratio</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '140px' }}>
                  {/* SVG Pie */}
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0078d4 0% 65%, #d83b01 65% 85%, #ffb900 85% 100%)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}></div>

                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0078d4' }}></span>
                      <span>Present ({filteredData.presentCount})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#d83b01' }}></span>
                      <span>Absent ({filteredData.absentCount})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ffb900' }}></span>
                      <span>Leaves ({filteredData.pendingLeaves})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Count by Department (Vertical Bar Chart) */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Staff Headcount by Department</div>
                <div style={{ height: '130px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '10px' }}>
                  {filteredData.deptDist.map((d, i) => {
                    const max = Math.max(...filteredData.deptDist.map(x => x.count), 1);
                    const h = Math.max(15, (d.count / max) * 90);
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '38px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#4f46e5' }}>{d.count}</span>
                        <div style={{
                          width: '26px',
                          height: `${h}px`,
                          backgroundColor: '#5b6cb8',
                          borderRadius: '2px 2px 0 0',
                          transition: 'height 0.3s ease'
                        }}></div>
                        <span style={{ fontSize: '0.62rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40px' }}>
                          {d.department.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Row C: Horizontal Bars & Leave Status Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '12px' }}>
              
              {/* Workforce Ratio by Unit (Horizontal Bars) */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Workforce by Unit</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {filteredData.deptDist.slice(0, 3).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
                      <span style={{ width: '60px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.department}</span>
                      <div style={{ flex: 1, height: '12px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, d.count * 20)}%`, height: '100%', backgroundColor: '#2b579a' }}></div>
                      </div>
                      <span style={{ fontWeight: '700', color: '#0f172a', width: '20px' }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Dropdown Slicer Box */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Department_Type</div>
                <div style={{ marginTop: '10px' }}>
                  <select
                    value={dropdownDept}
                    onChange={(e) => setDropdownDept(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="All">All</option>
                    {allDepartments.map((dept, i) => (
                      <option key={i} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Leave Status Breakdown */}
              <div style={powerBiChartBoxStyle}>
                <div style={chartHeaderStyle}>Leave Status Distribution</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '80px', marginTop: '6px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#107c41' }}>{filteredData.approvedLeaves}</div>
                    <div style={{ width: '24px', height: `${Math.max(10, filteredData.approvedLeaves * 15)}px`, backgroundColor: '#107c41', margin: '4px auto 2px', borderRadius: '2px 2px 0 0' }}></div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Appr</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#d83b01' }}>{filteredData.pendingLeaves}</div>
                    <div style={{ width: '24px', height: `${Math.max(10, filteredData.pendingLeaves * 15)}px`, backgroundColor: '#d83b01', margin: '4px auto 2px', borderRadius: '2px 2px 0 0' }}></div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Pend</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>{filteredData.rejectedLeaves}</div>
                    <div style={{ width: '24px', height: `${Math.max(10, filteredData.rejectedLeaves * 15)}px`, backgroundColor: '#64748b', margin: '4px auto 2px', borderRadius: '2px 2px 0 0' }}></div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Rej</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* 3️⃣ RIGHT COLUMN: Power BI Filter Slicers Pane             */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Slicer 1: Attendance_Status Slicer */}
            <div style={powerBiSlicerCardStyle}>
              <div style={slicerHeaderStyle}>Attendance_Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px' }}>
                {['Present', 'Absent', 'Pending'].map((st) => {
                  const isSelected = statusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(isSelected ? 'ALL' : st)}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        borderRadius: '2px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#0078d4' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#1e293b',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 2px 6px rgba(0,120,212,0.3)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slicer 2: Attendance_Date Range Slicer */}
            <div style={powerBiSlicerCardStyle}>
              <div style={slicerHeaderStyle}>Attendance_Date</div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600', textAlign: 'center' }}>
                  {startDate}  ⇌  {endDate}
                </div>
                {/* Power BI slider line with circular handles */}
                <div style={{ position: 'relative', margin: '10px 4px 6px' }}>
                  <div style={{ height: '3px', backgroundColor: '#cbd5e1', width: '100%' }}></div>
                  <div style={{ position: 'absolute', top: '-5px', left: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #0078d4' }}></div>
                  <div style={{ position: 'absolute', top: '-5px', right: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #0078d4' }}></div>
                </div>
              </div>
            </div>

            {/* Slicer 3: Department Checkbox Slicer */}
            <div style={powerBiSlicerCardStyle}>
              <div style={slicerHeaderStyle}>Department</div>
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                {allDepartments.map((dept, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedDepts.includes(dept)}
                      onChange={() => handleDeptCheckbox(dept)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{dept}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 🏷️ Power BI Bottom Footer Bar */}
        <div style={{
          backgroundColor: '#061138',
          color: '#ffffff',
          borderRadius: '4px',
          padding: '10px 20px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          fontSize: '0.9rem',
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>
          Developed by Dhanaraj Patil | Power BI Dashboard | 2026
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 🎨 Power BI Exact Style Objects
// ==========================================

const powerBiKpiCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d0d7de',
  borderRadius: '4px',
  padding: '12px 14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '82px'
};

const kpiNumberStyle = {
  fontSize: '1.45rem',
  fontWeight: '800',
  color: '#0f172a',
  marginTop: '2px',
  fontFamily: "'Segoe UI', Roboto, sans-serif"
};

const kpiSubtextStyle = {
  fontSize: '0.68rem',
  color: '#64748b',
  fontWeight: '600'
};

const powerBiChartBoxStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d0d7de',
  borderRadius: '4px',
  padding: '12px 14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const chartHeaderStyle = {
  fontSize: '0.8rem',
  fontWeight: '700',
  color: '#0f172a',
  marginBottom: '4px',
  fontFamily: "'Segoe UI', Roboto, sans-serif"
};

const powerBiSlicerCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d0d7de',
  borderRadius: '4px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const slicerHeaderStyle = {
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  padding: '6px 10px',
  fontSize: '0.78rem',
  fontWeight: '800',
  color: '#0f172a',
  fontFamily: "'Segoe UI', Roboto, sans-serif"
};

export default AdminDashboard;
