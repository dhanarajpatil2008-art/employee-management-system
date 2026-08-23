import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import { Building2, Users, Briefcase } from 'lucide-react';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="main-wrapper">
      <Navbar
        title="Departments Overview"
        subtitle="Business divisions and team member allocation"
      />

      <div className="content-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {departments.length > 0 ? (
            departments.map((dept, idx) => (
              <div key={idx} className="card" style={{ padding: '24px', margin: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#eef2ff',
                    color: '#4f46e5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={22} />
                  </div>
                  <span className="badge badge-approved" style={{ fontSize: '0.8rem' }}>
                    Active Unit
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                  {dept.department}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  marginTop: '12px'
                }}>
                  <Users size={16} />
                  <span><strong>{dept.employee_count}</strong> Assigned Employees</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <p style={{ color: '#94a3b8' }}>Loading departments...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
