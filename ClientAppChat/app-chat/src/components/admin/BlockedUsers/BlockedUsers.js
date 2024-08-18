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
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/User/all-users');
                // Filter users with 'Inactive' status
                const blockedUsersList = response.data.filter(user => user.status === 'Blocked');
                setBlockedUsers(blockedUsersList);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching blocked users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredBlockedUsers = blockedUsers.filter(user => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            searchFilter === 'username' && user.userName.toLowerCase().includes(lowerSearchTerm) ||
            searchFilter === 'email' && user.email.toLowerCase().includes(lowerSearchTerm) ||
            searchFilter === 'id' && user.userId.toString().includes(lowerSearchTerm) ||
            !searchFilter && (
                user.userName.toLowerCase().includes(lowerSearchTerm) ||
                user.email.toLowerCase().includes(lowerSearchTerm) ||
                user.userId.toString().includes(lowerSearchTerm)
            )
        );
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
            </div>

            <table className="blocked-user-list">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredBlockedUsers.length > 0 ? (
                    filteredBlockedUsers.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>
                                    <span className="blocked-status-label">
                                        {user.status}
                                    </span>
                            </td>
                            <td>
                                    <span className="blocked-role-label">
                                        {user.role}
                                    </span>
                            </td>
                            <td>
                                <button onClick={() => console.log(`Edit user with ID: ${user.userId}`)}>Edit</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No blocked users found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default BlockedUsers;
