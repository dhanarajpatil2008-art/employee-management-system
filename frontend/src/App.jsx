import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeesPage from './pages/admin/EmployeesPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import AttendancePage from './pages/admin/AttendancePage';
import LeaveRequestsPage from './pages/admin/LeaveRequestsPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ApplyLeavePage from './pages/employee/ApplyLeavePage';
import MyAttendancePage from './pages/employee/MyAttendancePage';

/**
 * 🔒 Protected Layout Component
 * Handles role checking and global sidebar
 */
const ProtectedLayout = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ fontWeight: '600', color: '#4f46e5' }}>Loading EMS Workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If role doesn't match, redirect to appropriate dashboard
    return user.role === 'admin' ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/employee/dashboard" replace />
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* 👑 Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <EmployeesPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <DepartmentsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <AttendancePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <LeaveRequestsPage />
              </ProtectedLayout>
            }
          />

          {/* 👤 Employee Protected Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedLayout allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <ProtectedLayout allowedRoles={['employee']}>
                <ApplyLeavePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/employee/my-attendance"
            element={
              <ProtectedLayout allowedRoles={['employee']}>
                <MyAttendancePage />
              </ProtectedLayout>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
