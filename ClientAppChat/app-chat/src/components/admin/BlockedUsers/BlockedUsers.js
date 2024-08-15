import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/BlockedUsers.css'; // Ensure you have the appropriate CSS file for styling

function BlockedUsers() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/User/blocked-users');
                setBlockedUsers(response.data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching blocked users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockedUsers();
    }, []);

    const filteredBlockedUsers = blockedUsers.filter(user => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const match = searchFilter
            ? (searchFilter === 'username' && user.UserName && user.UserName.toLowerCase().includes(lowerSearchTerm)) ||
            (searchFilter === 'email' && user.Email && user.Email.toLowerCase().includes(lowerSearchTerm)) ||
            (searchFilter === 'id' && user.UserId && user.UserId.toString().includes(lowerSearchTerm))
            : (user.UserName && user.UserName.toLowerCase().includes(lowerSearchTerm)) ||
            (user.Email && user.Email.toLowerCase().includes(lowerSearchTerm)) ||
            (user.UserId && user.UserId.toString().includes(lowerSearchTerm));

        return match;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="blocked-user-list-container">
            <h1>Blocked Users</h1>

            <div className="user-search-bar">
                <input
                    type="text"
                    placeholder="Search Blocked User by: @username, email & ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    className="search-filter"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                >
                    <option value="">Search by</option>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="id">User ID</option>
                </select>
                <button className="search-button">
                    <i className="fa fa-search"></i>
                </button>
            </div>

            <table className="blocked-user-list">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {filteredBlockedUsers.length > 0 ? (
                    filteredBlockedUsers.map(user => (
                        <tr key={user.UserId}>
                            <td>{user.UserId}</td>
                            <td>@{user.UserName}</td>
                            <td>{user.Email}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No blocked users found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default BlockedUsers;
