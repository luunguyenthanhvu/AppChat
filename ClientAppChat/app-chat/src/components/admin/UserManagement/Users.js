import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination'; // Importing the pagination component
import '../../../css/Users.css'; // Ensure the path is correct
import { BACKEND_URL_HTTP } from '../../../config.js'; // Importing the backend URL

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        userName: '',
        email: '',
        password: '', // Added field for password
        img: '',
        roleId: 2 // Default to a basic user role (adjust based on your logic)
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Set users per page

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-users`, {
                params: { searchTerm, page: currentPage, limit: usersPerPage },
            });
            const activeUsers = response.data.filter(user => user.status === 'Active');
            setUsers(activeUsers);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            alert('User not found. Please enter a valid User ID.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/UserManagement/getUserById/${searchTerm}`);
            if (response.data) {
                setUsers([response.data]); // Display only the found user in the list
            } else {
                setUsers([]); // Clear users if no match
                alert('User not found.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('User not found.');
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (userId) => {
        console.log(`Edit user with ID: ${userId}`);
    };

    const handleBlock = (userId) => {
        console.log(`Block user with ID: ${userId}`);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://${BACKEND_URL_HTTP}/api/User/remove-user/${userId}`);
            // After successful deletion, update the user list
            setUsers(users.filter(user => user.userId !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault(); // Prevent form refresh

        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/User/add-user`, newUser);
            const createdUser = response.data;
            setUsers([...users, createdUser]); // Add the new user to the list
            setShowAddForm(false); // Close the form after adding
            setNewUser({
                userName: '',
                email: '',
                password: '',
                img: '',
                roleId: 2
            }); // Reset the form fields
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        }
    };

    // Pagination logic: determine current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Calculate the number of pages
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div>
            <h1>All Users</h1>

            <div className="user-search-bar">
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add User'}
                </button>
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
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Avatar URL"
                        value={newUser.img}
                        onChange={e => setNewUser({ ...newUser, img: e.target.value })}
                    />
                    <select
                        value={newUser.roleId}
                        onChange={e => setNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
                    >
                        <option value={2}>User</option>
                        <option value={1}>Admin</option>
                    </select>
                    <button type="submit">Add</button>
                </form>
            )}

            <div className="user-list-wrapper">
                <table className="user-list">
                    <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <tr key={user.userId}>
                                <td>
                                    <img src={user.img} alt={user.userName} className="user-avatar" />
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
                                    <button onClick={() => handleEdit(user.userId)}>Edit</button>
                                    <button onClick={() => handleBlock(user.userId)}>Block</button>
                                    <button onClick={() => handleDelete(user.userId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No users found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination directly below the user list */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                customStyles={{
                    bgColor: 'rgba(76, 175, 80, 0.2)',
                    activeBgColor: '#388E3C',
                    borderColor: '#4CAF50',
                    textColor: 'white',
                }}            />
        </div>
    );
}

export default Users;
