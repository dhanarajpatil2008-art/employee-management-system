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
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, sidebarOpen, closeSidebar } = useAuth();
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
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-badge">
              <Layers size={22} />
            </div>
            <div className="logo-text">
              <h2>EMS Portal</h2>
              <span>Enterprise System</span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            className="mobile-sidebar-close-btn"
            onClick={closeSidebar}
            title="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-menu">
          {isAdmin ? (
            <>
              <div className="menu-category">Admin Management</div>
              <NavLink
                to="/admin/dashboard"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/employees"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Users size={18} />
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/admin/departments"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Building2 size={18} />
                <span>Departments</span>
              </NavLink>

              <NavLink
                to="/admin/attendance"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <CalendarCheck2 size={18} />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="/admin/leaves"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <CalendarClock size={18} />
                <span>Leave Requests</span>
              </NavLink>
            </>
          ) : (
            <>
              <div className="menu-category">Employee Workspace</div>
              <NavLink
                to="/employee/dashboard"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <LayoutDashboard size={18} />
                <span>My Dashboard</span>
              </NavLink>

              <NavLink
                to="/employee/apply-leave"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Send size={18} />
                <span>Apply Leave</span>
              </NavLink>

              <NavLink
                to="/employee/my-attendance"
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
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
    </>
  );
};

export default Sidebar;
