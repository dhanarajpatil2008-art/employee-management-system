import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';
import { LogOut, User, Bell, Menu } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
  const { user, logout, toggleSidebar } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={toggleSidebar}
            title="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        <div className="topbar-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              onClick={() => setProfileModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f1f5f9',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              title="Click to view My Profile"
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: user?.role === 'admin' ? '#7e22ce' : '#10b981'
              }}></span>
              <span>{user?.name}</span>
              <span style={{
                fontSize: '0.72rem',
                background: user?.role === 'admin' ? '#f3e8ff' : '#ecfdf5',
                color: user?.role === 'admin' ? '#7e22ce' : '#047857',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}>
                {user?.role}
              </span>
            </div>

            <button onClick={logout} className="btn-logout" title="Sign Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Staff Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;
