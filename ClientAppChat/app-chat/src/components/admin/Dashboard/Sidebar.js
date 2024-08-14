import React from 'react';
import '../../../css/Sidebar.css';
import logo from '../../../img/login-holder.jpg';

const Sidebar = ({ setActiveContent }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src={logo} alt="" />
                </div>
                <h2>ADMIN DASHBOARD</h2>
            </div>
            <ul className="sidebar-menu">
                <li className="sidebar-item" onClick={() => setActiveContent('users')}>
                    <span>Users</span>
                </li>
                <li className="sidebar-item" onClick={() => setActiveContent('groups')}>
                    <span>Groups</span>
                </li>
                <li className="sidebar-item" onClick={() => setActiveContent('reports')}>
                    <span>Reports</span>
                </li>
                <li className="sidebar-item" onClick={() => setActiveContent('blocked')}>
                    <span>Blocked</span>
                </li>
                <li className="sidebar-item" onClick={() => setActiveContent('settings')}>
                    <span>Settings</span>
                </li>
                <li className="sidebar-item" onClick={() => setActiveContent('notifications')}>
                    <span>Notifications</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
