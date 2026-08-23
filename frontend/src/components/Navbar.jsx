import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f1f5f9',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: '600'
          }}>
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
              textTransform: 'uppercase'
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
  );
};

export default Navbar;
