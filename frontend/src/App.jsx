import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import ComplaintHistory from './pages/citizen/ComplaintHistory';
import ComplaintDetails from './pages/citizen/ComplaintDetails';
import CitizenProfile from './pages/citizen/CitizenProfile';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedComplaints from './pages/officer/AssignedComplaints';
import OfficerComplaintDetails from './pages/officer/OfficerComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageComplaints from './pages/admin/ManageComplaints';
import SystemSettings from './pages/admin/SystemSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Single Common Guarded AppLayout for ALL Panels */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                
                {/* Citizen Routes */}
                <Route path="/" element={<CitizenDashboard />} />
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/submit-complaint" element={<SubmitComplaint />} />
                <Route path="/complaints" element={<ComplaintHistory />} />
                <Route path="/complaints/:id" element={<ComplaintDetails />} />
                <Route path="/profile" element={<CitizenProfile />} />

                {/* Officer Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Officer', 'Admin']} />}>
                  <Route path="/officer" element={<OfficerDashboard />} />
                  <Route path="/officer/complaints" element={<AssignedComplaints />} />
                  <Route path="/officer/complaint/:id" element={<OfficerComplaintDetails />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/departments" element={<ManageDepartments />} />
                  <Route path="/admin/complaints" element={<ManageComplaints />} />
                  <Route path="/admin/settings" element={<SystemSettings />} />
                </Route>

              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
