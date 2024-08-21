import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import ChatHome from './components/ChatHome.js';
import Register from './components/Register.js';
import VerifyRegisterAccount from './components/VerifyRegisterAccount.js';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import Users from './components/admin/UserManagement/Users';
import Groups from './components/admin/GroupManagement/Groups';
import Reports from './components/admin/ReportManagement/Reports';
import BlockedUsers from './components/admin/BlockedUsers/BlockedUsers';
import ForgotPassword from './components/ForgotPassword.js';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<ChatHome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-register" element={<VerifyRegisterAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
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
