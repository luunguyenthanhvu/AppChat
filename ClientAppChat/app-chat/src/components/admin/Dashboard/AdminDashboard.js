import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import StatCard from './StatCards';
import Users from '../UserManagement/Users';
import Groups from '../GroupManagement/Groups';
import Reports from '../ReportManagement/Reports';
import BlockedUsers from '../BlockedUsers/BlockedUsers';
import '../../../css/AdminDashboard.css';
import Notifications from "../Notification/Notification";

const AdminDashboard = () => {
    const [activeContent, setActiveContent] = useState('users');
    const [statCardData, setStatCardData] = useState([
        { title: "Users", count: 0, icon: "/icons/user-icon.png", bgColor: "#4CAF50" },
        { title: "Groups", count: 0, icon: "/icons/groups-icon.png", bgColor: "#2196F3" },
        { title: "Reports", count: 0, icon: "/icons/reports-icon.png", bgColor: "#FFC107" },
        { title: "Blocked Users", count: 0, icon: "/icons/blocked-icon.png", bgColor: "#F44336" }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, groupsRes, reportsRes, blockedUsersRes] = await Promise.all([
                    axios.get('http://localhost:5133/api/User/count-users'),
                    axios.get('http://localhost:5133/api/Group/count-groups'),
                    axios.get('http://localhost:5133/api/Report/count-reports'),
                    axios.get('http://localhost:5133/api/User/count-blocked-users'),
                ]);

                setStatCardData([
                    { title: "Users", count: usersRes.data, icon: "/icons/user-icon.png", bgColor: "#4CAF50" },
                    { title: "Groups", count: groupsRes.data, icon: "/icons/groups-icon.png", bgColor: "#2196F3" },
                    { title: "Reports", count: reportsRes.data, icon: "/icons/reports-icon.png", bgColor: "#FFC107" },
                    { title: "Blocked Users", count: blockedUsersRes.data, icon: "/icons/blocked-icon.png", bgColor: "#F44336" }
                ]);
            } catch (error) {
                console.error("Error fetching data for stat cards:", error);
            }
        };

        fetchData();
    }, []);

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
                    {statCardData.map(card => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
