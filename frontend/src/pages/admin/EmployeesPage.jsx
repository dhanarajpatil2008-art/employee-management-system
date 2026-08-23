import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import { UserPlus, Search, Edit2, Trash2, Mail, Phone, Building } from 'lucide-react';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Information Technology',
    designation: 'Software Engineer',
    role: 'employee'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/users');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: 'Information Technology',
      designation: 'Software Engineer',
      role: 'employee'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      password: emp.password || '',
      phone: emp.phone || '',
      department: emp.department || 'Information Technology',
      designation: emp.designation || 'Software Engineer',
      role: emp.role || 'employee'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the system?`)) {
      try {
        const res = await API.delete(`/users/${id}`);
        if (res.data.success) {
          fetchEmployees();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting employee');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingEmployee) {
        // Update Employee
        const res = await API.put(`/users/${editingEmployee.id}`, formData);
        if (res.data.success) {
          setIsModalOpen(false);
          fetchEmployees();
        }
      } else {
        // Create New Employee
        const res = await API.post('/users', formData);
        if (res.data.success) {
          setIsModalOpen(false);
          fetchEmployees();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving employee details');
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="main-wrapper">
      <Navbar
        title="Employee Directory"
        subtitle="Manage complete organization staff records, roles, and profiles"
      />

      <div className="content-container">
        {/* Controls Bar */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Box */}
              <div className="search-box">
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Department Filter */}
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.88rem' }}
              >
                <option value="ALL">All Departments</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <button onClick={handleOpenAdd} className="btn btn-primary">
              <UserPlus size={18} />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Contact Info</th>
                  <th>Department & Role</th>
                  <th>Password (Plain)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td><strong>#{emp.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{emp.designation}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Mail size={14} color="#94a3b8" />
                          <span>{emp.email}</span>
                        </div>
                        {emp.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            <Phone size={14} color="#94a3b8" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: '500', fontSize: '0.88rem' }}>{emp.department}</div>
                        <span className={`badge ${emp.role === 'admin' ? 'badge-admin' : 'badge-employee'}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.82rem' }}>
                          {emp.password}
                        </code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="btn btn-secondary btn-sm"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No employees match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}
        >
          <form onSubmit={handleSubmit}>
            {formError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rahul@ems.com"
              />
            </div>

            <div className="form-group">
              <label>Password (Plain Text)</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="e.g. pass123"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Department</label>
                <select
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Information Technology">Information Technology</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. UI/UX Designer"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingEmployee ? 'Save Changes' : 'Create Employee'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeesPage;
