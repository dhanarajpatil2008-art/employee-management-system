import React from 'react';
import Modal from './Modal';
import { Mail, Phone, Building, Briefcase, Shield, User, Calendar, CheckCircle2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isAdmin = user.role === 'admin';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Staff Profile">
      <div style={{ padding: '6px 0' }}>
        {/* Header Avatar & Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isAdmin 
              ? 'linear-gradient(135deg, #7e22ce, #4f46e5)'
              : 'linear-gradient(135deg, #2563eb, #06b6d4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '800',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            flexShrink: 0
          }}>
            {getInitials(user.name)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {user.name}
              </h3>
              <span className={`badge ${isAdmin ? 'badge-rejected' : 'badge-employee'}`} style={{ fontSize: '0.72rem' }}>
                {isAdmin ? 'System Admin' : `Employee #${user.id}`}
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} color="#64748b" />
              <span>{user.designation || (isAdmin ? 'Chief Administrator' : 'Staff Member')}</span>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={13} color="#4f46e5" />
              <span>Department</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
              {user.department || 'Management'}
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} color="#10b981" />
              <span>System Role</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>
              {user.role} Access
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} color="#0078d4" />
              <span>Email Address</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
              {user.email}
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} color="#107c41" />
              <span>Phone Number</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
              {user.phone || 'Not provided'}
            </div>
          </div>

        </div>

        {/* Footer info badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #a7f3d0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '0.82rem', fontWeight: '700' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Account Status: Active & Verified</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
            EMS Portal ID #{user.id}
          </span>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 24px' }}>
            Close Profile
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
