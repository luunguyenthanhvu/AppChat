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

                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/groups" element={<Groups />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/blocked-users" element={<BlockedUsers />} />
            </Routes>
        </Router>
    );
}

export default App;
