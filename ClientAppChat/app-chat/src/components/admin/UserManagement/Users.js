import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/Users.css'; // Ensure the path is correct

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        userName: '',
        email: '',
        role: 'User',
        img: '' // Added field for avatar image
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/User/all-users');
                const activeUsers = response.data.filter(user => user.status === 'Active');
                setUsers(activeUsers);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (userId) => {
        console.log(`Edit user with ID: ${userId}`);
    };

    const handleDelete = (userId) => {
        console.log(`Delete user with ID: ${userId}`);
    };

    const handleRoleChange = (userId, newRole) => {
        console.log(`Change role for user with ID: ${userId} to ${newRole}`);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5133/api/User/add-user', newUser);
            const createdUser = response.data;
            setUsers([...users, createdUser]);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        }
    };

    const filteredUsers = users.filter(user => {
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
            </div>

            {showAddForm && (
                <form className="add-user-form" onSubmit={handleAddUser}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.userName}
                        onChange={e => setNewUser({ ...newUser, userName: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Avatar URL"
                        value={newUser.img} // Input for avatar URL
                        onChange={e => setNewUser({ ...newUser, img: e.target.value })}
                    />
                    <select
                        value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                </form>
            )}

            <table className="user-list">
                <thead>
                <tr>
                    <th>Avatar</th> {/* New Avatar Column */}
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.userId}>
                            <td>
                                <img src={user.img} alt={user.userName} className="user-avatar" /> {/* Avatar Image */}
                            </td>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className="users-status-label">
                                    {user.status}
                                </span>
                            </td>
                            <td>
                                <span className="users-role-label">
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(user.userId)}>Delete</button>
                                <button onClick={() => handleEdit(user.userId)}>Edit</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No users found</td> {/* Updated colSpan to 7 */}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
