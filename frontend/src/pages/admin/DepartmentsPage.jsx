import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import {
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
  UserPlus,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDept, setExpandedDept] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/users/departments/list');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  const totalEmployees = departments.reduce((acc, d) => acc + (d.employee_count || 0), 0);
  const avgTeamSize = departments.length > 0 ? (totalEmployees / departments.length).toFixed(1) : 0;
  const largestDept = departments.length > 0
    ? departments.reduce((max, d) => (d.employee_count > (max.employee_count || 0) ? d : max), departments[0])
    : null;

  const filteredDepartments = departments.filter((d) =>
    d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-wrapper">
      <Navbar
        title="Department Operations & Hierarchy"
        subtitle="Organizational business units, team allocation, and departmental workforce management"
      />

      <div className="content-container">
        {/* 📊 Top Department Metrics */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <StatCard
            title="Total Departments"
            value={departments.length}
            description="Active organizational divisions"
            icon={Building2}
            color="indigo"
          />
          <StatCard
            title="Total Staff Assigned"
            value={totalEmployees}
            description="Allocated workforce count"
            icon={Users}
            color="emerald"
          />
          <StatCard
            title="Average Team Size"
            value={avgTeamSize}
            description="Members per department unit"
            icon={Layers}
            color="indigo"
          />
          <StatCard
            title="Largest Unit"
            value={largestDept?.department || 'N/A'}
            description={`${largestDept?.employee_count || 0} active members assigned`}
            icon={Briefcase}
            color="amber"
          />
        </div>

        {/* 🔍 Controls & Search Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
              <div className="search-box" style={{ width: '100%', maxWidth: '360px' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search department name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/employees')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <UserPlus size={16} />
              <span>Assign Staff in Directory</span>
            </button>
          </div>
        </div>

        {/* 🏢 Department Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept, idx) => {
              const isExpanded = expandedDept === dept.department;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    margin: 0,
                    border: isExpanded ? '1px solid #6366f1' : '1px solid var(--border-light)',
                    boxShadow: isExpanded ? '0 10px 25px -5px rgba(99, 102, 241, 0.15)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ padding: '24px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        backgroundColor: '#eef2ff',
                        color: '#4f46e5',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                      }}>
                        <Building2 size={22} />
                      </div>
                      <span className="badge badge-approved" style={{ fontSize: '0.78rem' }}>
                        Operational
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      {dept.department}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '16px' }}>
                      Corporate workforce division overseeing {dept.department.toLowerCase()} operations and team deliveries.
                    </p>

                    {/* Quick Metric Bar */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.88rem', fontWeight: '600' }}>
                        <Users size={16} color="#6366f1" />
                        <span>Staff Strength:</span>
                      </div>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#4f46e5' }}>
                        {dept.employee_count} {dept.employee_count === 1 ? 'Member' : 'Members'}
                      </span>
                    </div>

                    {/* Progress Bar of Workforce Ratio */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                        <span>Workforce Ratio</span>
                        <span>{totalEmployees > 0 ? Math.round((dept.employee_count / totalEmployees) * 100) : 0}% of Total</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${totalEmployees > 0 ? (dept.employee_count / totalEmployees) * 100 : 0}%`,
                            height: '100%',
                            backgroundColor: '#4f46e5',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Toggle Team Members Button */}
                    <button
                      onClick={() => toggleExpand(dept.department)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 0',
                        fontWeight: '700'
                      }}
                    >
                      <span>{isExpanded ? 'Hide Team Members' : `View ${dept.employee_count} Assigned Member(s)`}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Members Section */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        {dept.members && dept.members.length > 0 ? (
                          dept.members.map((member) => (
                            <div
                              key={member.id}
                              style={{
                                padding: '10px 12px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid #f1f5f9'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: '#e0e7ff',
                                  color: '#4f46e5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '700',
                                  fontSize: '0.82rem'
                                }}>
                                  {member.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>{member.name}</div>
                                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{member.designation}</div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.78rem', color: '#475569' }}>{member.email}</div>
                                {member.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{member.phone}</div>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', padding: '10px 0' }}>
                            No employees assigned to this department yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <p style={{ color: '#94a3b8' }}>No departments matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
