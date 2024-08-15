import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/Users.css'; // Ensure the path is correct

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/User/all-users');
                console.log(response.data); // Log the response to check data
                setUsers(response.data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // const filteredUsers = users.filter(user => {
    //     const lowerSearchTerm = searchTerm.toLowerCase();
    //     const match = searchFilter
    //         ? (searchFilter === 'username' && user.UserName && user.UserName.toLowerCase().includes(lowerSearchTerm)) ||
    //         (searchFilter === 'email' && user.Email && user.Email.toLowerCase().includes(lowerSearchTerm)) ||
    //         (searchFilter === 'id' && user.UserId && user.UserId.toString().includes(lowerSearchTerm))
    //         : (user.UserName && user.UserName.toLowerCase().includes(lowerSearchTerm)) ||
    //         (user.Email && user.Email.toLowerCase().includes(lowerSearchTerm)) ||
    //         (user.UserId && user.UserId.toString().includes(lowerSearchTerm));
    //
    //     return match;
    // });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-list-container">
            <h1>All Users</h1>

            <div className="user-search-bar">
                <input
                    type="text"
                    placeholder="Search User by: @username, email & ID"
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
                <select
                    className="search-status"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button className="search-button">
                    <i className="fa fa-search"></i>
                </button>
            </div>

            <table className="user-list">
                <thead>
                <tr>
                    <th >User ID</th>
                    <th >Username</th>
                    <th >Email</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.UserId}>
                            <td>{user.userId}</td>
                            <td>@{user.userName}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No users found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
