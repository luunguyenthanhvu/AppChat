import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatHome from './components/ChatHome';
import Register from './components/Register';
import VerifyRegisterAccount from './components/VerifyRegisterAccount';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import Users from './components/admin/UserManagement/Users';
import Groups from './components/admin/GroupManagement/Groups';
import Reports from './components/admin/ReportManagement/Reports';
import BlockedUsers from './components/admin/BlockedUsers/BlockedUsers';
import ForgotPassword from './components/ForgotPassword';

// Helper function to check if the user is admin
const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'admin';
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<ChatHome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-register" element={<VerifyRegisterAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protecting admin routes */}
                <Route
                    path="/admin"
                    element={isAdmin() ? <AdminDashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/users"
                    element={isAdmin() ? <Users /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/groups"
                    element={isAdmin() ? <Groups /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/reports"
                    element={isAdmin() ? <Reports /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/blocked-users"
                    element={isAdmin() ? <BlockedUsers /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
