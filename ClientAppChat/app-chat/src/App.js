import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import ChatHome from './components/ChatHome.js';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import Users from './components/admin/UserManagement/Users';
import Groups from './components/admin/GroupManagement/Groups';
import Reports from './components/admin/ReportManagement/Reports';
import BlockedUsers from './components/admin/BlockedUsers/BlockedUsers';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<ChatHome />} />
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
