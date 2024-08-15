import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCards';
import Users from '../UserManagement/Users';
import Groups from '../GroupManagement/Groups';
import Reports from '../ReportManagement/Reports';
import BlockedUsers from '../BlockedUsers/BlockedUsers';
import Notifications from '../Notification/Notification';
import '../../../css/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeContent, setActiveContent] = useState('users');

    const statCardData = [
        { title: "Users", icon: "/icons/user-icon.png", bgColor: "#4CAF50", apiUrl: 'http://localhost:5133/api/User/count-users' },
        { title: "Groups", icon: "/icons/groups-icon.png", bgColor: "#2196F3", apiUrl: 'http://localhost:5133/api/Group/count-groups' },
        { title: "Reports", icon: "/icons/reports-icon.png", bgColor: "#FFC107", apiUrl: 'http://localhost:5133/api/Report/count-reports' },
        { title: "Blocked Users", icon: "/icons/blocked-icon.png", bgColor: "#F44336", apiUrl: 'http://localhost:5133/api/User/count-blocked-users' }
    ];

    const renderContent = () => {
        switch (activeContent) {
            case 'users':
                return <Users />;
            case 'groups':
                return <Groups />;
            case 'reports':
                return <Reports />;
            case 'blocked':
                return <BlockedUsers />;
            case 'notifications':
                return <Notifications />;
            default:
                return <div>Select an option from the sidebar</div>;
        }
    };

    return (
        <div className="admin-dashboard">
            <Sidebar setActiveContent={setActiveContent} />
            <div className="main-content">
                <div className="stats-cards">
                    {statCardData.map((card, index) => (
                        <StatCard key={index} {...card} />
                    ))}
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
