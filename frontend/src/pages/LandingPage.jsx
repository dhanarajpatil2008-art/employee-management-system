import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  CalendarCheck,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Headphones
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setContactSubmitted(false);
    }, 5000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.22) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.18) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)
      `,
      backgroundAttachment: 'fixed',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* 🌟 1. Dynamic Ambient Glowing Blobs */}
      <div className="animate-pulse-glow" style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="animate-pulse-glow" style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
        animationDelay: '3s'
      }} />

      {/* 🌟 2. Fixed / Sticky Top Header (Never Scrolls Away) */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)'
      }}>
        <nav className="landing-nav" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px'
        }}>
          {/* Logo & Branding */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => scrollToSection('home')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #4f46e5, #a855f7)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(79, 70, 229, 0.45)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  EMS Portal
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.4)'
                }}>
                  Enterprise
                </span>
              </div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '500' }}>
                Workforce Management System
              </span>
            </div>
          </div>

          {/* Navigation Links (Home, Capabilities, Contact Us) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px'
          }}>
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: '6px 0'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('capabilities')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.92rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: '6px 0'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
            >
              Services
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.92rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: '6px 0'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
            >
              Contact Us
            </button>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/auth')}
              style={{
                padding: '9px 22px',
                borderRadius: '11px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 70, 229, 0.4)'; }}
            >
              <span>Sign In</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </nav>
      </header>

      {/* 🚀 3. Hero Section */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 60px', width: '100%' }}>
        
        <section id="home" className="landing-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '48px',
          alignItems: 'center',
          marginBottom: '80px',
          paddingTop: '16px'
        }}>
          
          {/* Left Column: Headline & Action */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              color: '#c7d2fe',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              <Sparkles size={16} color="#818cf8" />
              <span>Next-Gen Enterprise Workforce Platform</span>
            </div>

            <h1 className="landing-hero-title" style={{
              fontSize: '3.4rem',
              fontWeight: '900',
              lineHeight: '1.16',
              letterSpacing: '-0.04em',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              Smart & Unified <br />
              <span style={{
                background: 'linear-gradient(135deg, #818cf8 10%, #c084fc 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Workforce Management
              </span>
            </h1>

            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              lineHeight: '1.7',
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Streamline employee directories, track real-time attendance, automate leave request approvals, and manage departmental workforce operations.
            </p>

            {/* Single Primary Action Button */}
            <div style={{ marginBottom: '40px' }}>
              <button
                onClick={() => navigate('/auth')}
                style={{
                  padding: '16px 38px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -4px rgba(79, 70, 229, 0.5)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px -4px rgba(79, 70, 229, 0.65)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -4px rgba(79, 70, 229, 0.5)'; }}
              >
                <span>Access Portal Workspace</span>
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              gap: '32px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '24px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#818cf8' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Role-Based Access</div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#34d399' }}>Real-Time</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Attendance Logs</div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#f472b6' }}>Instant</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Email Sync</div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fbbf24' }}>Cloud</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Scalable Architecture</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Window */}
          <div style={{ position: 'relative' }}>
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}>
              {/* MacOS Mockup Window Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>
                  ems-cloud-portal.internal
                </span>
              </div>

              {/* Workplace Image Representation */}
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Workplace Team"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, transparent 60%)'
                }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>High-Performance Workspace</div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Engineering & Management Operations</div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    Active 99.9%
                  </span>
                </div>
              </div>

              {/* Inner Mini Metric Tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TODAY'S PRESENCE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>96.5%</div>
                </div>
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>LEAVE PIPELINE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>Sync Active</div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ⚡ 4. Four Core Corporate Modules */}
        <section id="capabilities" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Workplace Services
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', marginTop: '6px' }}>
              Comprehensive Workforce Capabilities
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Employee Directory */}
            <div
              className="interactive-card"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#ffffff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Employee Profiles
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Organize employee directories, assign departmental hierarchies, designations, and verify profile credentials.
              </p>
            </div>

            {/* Card 2: Attendance Engine */}
            <div
              className="interactive-card"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #059669, #10b981)', color: '#ffffff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
                <CalendarCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Daily Attendance
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Record daily present/absent logs with a single click. Filter attendance history by date and track monthly presence.
              </p>
            </div>

            {/* Card 3: Leave Pipeline */}
            <div
              className="interactive-card"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#ffffff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)' }}>
                <FileText size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Leave Workflows
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Employees apply with date range & reason. HR administrators review and approve/reject with instant status synchronization.
              </p>
            </div>

            {/* Card 4: Department Management */}
            <div
              className="interactive-card"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #db2777, #ec4899)', color: '#ffffff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)' }}>
                <Layers size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Department Units
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Structured organizational departments, business units, role hierarchies, and employee workforce distribution.
              </p>
            </div>
          </div>
        </section>

        {/* 📞 5. Dedicated "Contact Us" Section */}
        <section id="contact" style={{ marginBottom: '60px', scrollMarginTop: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Get In Touch
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', marginTop: '6px' }}>
              Contact Support & Enterprise Operations
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '8px' }}>
              Have questions about deployment, employee onboarding, or system support? We are here to help.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Direct Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Card 1: Email */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Corporate Email</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>dhanarajpatil440@gmail.com</div>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Helpline & Support</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>+91 98765 43210</div>
                </div>
              </div>

              {/* Card 3: Support Hours */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Operational Hours</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Monday - Friday (9:00 AM - 6:00 PM)</div>
                </div>
              </div>

              {/* Card 4: Developer Lead */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>System Architect & Lead</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Dhanaraj Patil</div>
                </div>
              </div>

            </div>

            {/* Quick Contact Form */}
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Send an Inquiry
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '20px' }}>
                Fill out the details below and our team will respond promptly.
              </p>

              {contactSubmitted && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '18px',
                  fontSize: '0.88rem',
                  fontWeight: '600'
                }}>
                  <CheckCircle2 size={20} />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inquiry / Feedback topic"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Message
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Type your message here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(79, 70, 229, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* 🏢 6. Clean Corporate Footer */}
      <footer style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '28px 48px',
        color: '#94a3b8',
        fontSize: '0.86rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e5, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Building2 size={16} />
            </div>
            <span style={{ color: '#ffffff', fontWeight: '700' }}>EMS Portal</span>
            <span>• Corporate Workforce Solutions</span>
          </div>

          <p style={{ fontWeight: '600', color: '#c7d2fe' }}>
            Developed with excellence by <strong style={{ color: '#ffffff', fontWeight: '800' }}>Dhanaraj Patil</strong>
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
