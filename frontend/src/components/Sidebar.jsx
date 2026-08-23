import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  CalendarClock,
  Send,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Get initials for avatar (e.g. DP for Dhanaraj Patil)
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header / Brand */}
      <div className="sidebar-header">
        <div className="logo-badge">
          <Layers size={22} />
        </div>
        <div className="logo-text">
          <h2>EMS Portal</h2>
          <span>Enterprise System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu">
        {isAdmin ? (
          <>
            <div className="menu-category">Admin Management</div>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/employees" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Users size={18} />
              <span>Employees</span>
            </NavLink>

            <NavLink to="/admin/departments" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Building2 size={18} />
              <span>Departments</span>
            </NavLink>

            <NavLink to="/admin/attendance" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <CalendarCheck2 size={18} />
              <span>Attendance</span>
            </NavLink>

            <NavLink to="/admin/leaves" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <CalendarClock size={18} />
              <span>Leave Requests</span>
            </NavLink>
          </>
        ) : (
          <>
            <div className="menu-category">Employee Workspace</div>
            <NavLink to="/employee/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <LayoutDashboard size={18} />
              <span>My Dashboard</span>
            </NavLink>

            <NavLink to="/employee/apply-leave" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Send size={18} />
              <span>Apply Leave</span>
            </NavLink>

            <NavLink to="/employee/my-attendance" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Calendar size={18} />
              <span>My Attendance</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Mini Profile Footer */}
      <div className="sidebar-footer">
        <div className="user-mini-profile">
          <div className="avatar-circle">{getInitials(user?.name)}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role-badge">{user?.department || user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
