import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  Building,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  LogIn
} from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Information Technology',
    designation: 'Software Engineer'
  });

  // Inline Validation Errors
  const [validationErrors, setValidationErrors] = useState({});

  // Pre-warm server connection immediately on page load
  useEffect(() => {
    fetch('https://employee-management-system-tund.onrender.com/').catch(() => {});
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Handle Input Changes & Clear Specific Error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const errors = {};

    // 1. Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email (e.g. name@domain.com).';
    }

    // 2. Password Validation (Min 6 Characters)
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    // 3. Registration Specific Validations
    if (!isLogin) {
      // Full Name Validation (Min 3 characters)
      if (!formData.name.trim()) {
        errors.name = 'Full name is required.';
      } else if (formData.name.trim().length < 3) {
        errors.name = 'Name must be at least 3 characters.';
      }

      // Phone Number Validation (10 Digits)
      const phoneRegex = /^[0-9]{10}$/;
      if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
        errors.phone = 'Please enter a valid 10-digit mobile number.';
      }

      // Designation Validation
      if (!formData.designation.trim()) {
        errors.designation = 'Job designation is required.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Run client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email.trim(), formData.password);
      if (!res.success) {
        setError(res.message || 'Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        // Show prominent on-screen login success banner
        setSuccessMsg(`Login Successful! Welcome back, ${res.user.name}. Redirecting...`);
        setTimeout(() => {
          if (res.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        }, 900);
      }
    } else {
      const res = await register({
        ...formData,
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      if (!res.success) {
        // Displays error if email already exists or server validation fails
        setError(res.message || 'Registration failed. Please check your details.');
        setLoading(false);
      } else {
        // Show prominent on-screen registration success banner
        setSuccessMsg('Registration Successful! Your account has been created. Redirecting...');
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 1100);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.22) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.18) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%)
      `,
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative'
    }}>

      {/* Main Authentication Card */}
      <div
        className="auth-card-wrap"
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: 'rgba(30, 41, 59, 0.75)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '40px 36px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          color: '#ffffff'
        }}
      >

        {/* Back to Home Link */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.86rem',
            cursor: 'pointer',
            marginBottom: '22px',
            fontWeight: '600',
            padding: '4px 0',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #4f46e5, #a855f7)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '12px',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)'
          }}>
            <Layers size={24} />
          </div>
          <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Sign In to Workplace' : 'Create Employee Account'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '6px' }}>
            {isLogin
              ? 'Enter your corporate credentials to access portal'
              : 'Register your employee profile to get started'}
          </p>
        </div>

        {/* Navigation Tabs (Sign In / Register) */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccessMsg('');
              setValidationErrors({});
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: isLogin ? '#4f46e5' : 'transparent',
              color: '#ffffff',
              boxShadow: isLogin ? '0 2px 10px rgba(79, 70, 229, 0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccessMsg('');
              setValidationErrors({});
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: !isLogin ? '#4f46e5' : 'transparent',
              color: !isLogin ? '#ffffff' : '#94a3b8',
              boxShadow: !isLogin ? '0 2px 10px rgba(79, 70, 229, 0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Register
          </button>
        </div>

        {/* ❌ Error Alert (e.g. Email Already Exists or Invalid Credentials) */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            marginBottom: '20px',
            border: '1px solid #fee2e2',
            lineHeight: '1.5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', marginBottom: '2px' }}>Authentication Alert</div>
              <div>{error}</div>
              {/* If email already exists, offer 1-click switch to Sign In */}
              {error.toLowerCase().includes('already exists') && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setValidationErrors({});
                  }}
                  style={{
                    marginTop: '8px',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Switch to Sign In →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ Success Alert (Registration / Login Success) */}
        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            padding: '14px 16px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            marginBottom: '20px',
            border: '1px solid #a7f3d0',
            fontWeight: '600'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, color: '#10b981' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} noValidate>
          
          {/* Registration Fields */}
          {!isLogin && (
            <>
              {/* Full Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name (e.g. Dhanaraj Patil)"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '10px',
                      border: `1px solid ${validationErrors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)'; }}
                    onBlur={(e) => { e.target.style.borderColor = validationErrors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {validationErrors.name && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '10px',
                      border: `1px solid ${validationErrors.phone ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)'; }}
                    onBlur={(e) => { e.target.style.borderColor = validationErrors.phone ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {validationErrors.phone && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* Department */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                  Department <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                  Job Designation <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g. Software Engineer / HR Executive"
                    value={formData.designation}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '10px',
                      border: `1px solid ${validationErrors.designation ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)'; }}
                    onBlur={(e) => { e.target.style.borderColor = validationErrors.designation ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {validationErrors.designation && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>
                    {validationErrors.designation}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
              Email <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 40px',
                  borderRadius: '10px',
                  border: `1px solid ${validationErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                  fontSize: '0.92rem',
                  outline: 'none',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = validationErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {validationErrors.email && (
              <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0' }}>
                Password <span style={{ color: '#f87171' }}>*</span>
              </label>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Min. 6 characters
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 40px',
                  borderRadius: '10px',
                  border: `1px solid ${validationErrors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                  fontSize: '0.92rem',
                  outline: 'none',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = validationErrors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#ffffff',
              fontSize: '0.98rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <span>Processing Request...</span>
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                <span>Sign In to Portal</span>
              </>
            ) : (
              <>
                <UserCheck size={18} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        {/* Security Guarantee Note */}
        <div style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: '#94a3b8',
          fontSize: '0.78rem'
        }}>
          <ShieldCheck size={14} color="#34d399" />
          <span>Protected with 256-bit encrypted authentication</span>
        </div>

      </div>

      {/* Developer Footer */}
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
        <span>Employee Management System • Developed by </span>
        <strong style={{ color: '#c7d2fe' }}>Dhanaraj Patil</strong>
      </div>

    </div>
  );
};

export default AuthPage;
