import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination'; // Importing the pagination component
import '../../../css/BlockedUsers.css'; // Ensure you have the appropriate CSS file for styling
import { BACKEND_URL_HTTP } from '../../../config.js'; // Importing the backend URL

function BlockedUsers() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Set users per page

    useEffect(() => {
        fetchBlockedUsers();
    }, [currentPage]);

    const fetchBlockedUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-users`);
            // Filter users with 'Blocked' status
            const blockedUsersList = response.data.filter(user => user.status === 'Blocked');
            setBlockedUsers(blockedUsersList);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching blocked users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            alert('Please enter a valid User ID.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/UserManagement/getUserById/${searchTerm}`);
            if (response.data && response.data.status === 'Blocked') {
                setBlockedUsers([response.data]); // Display only the found blocked user in the list
            } else {
                setBlockedUsers([]); // Clear users if no match
                alert('Blocked user not found.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Blocked user not found.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic: determine current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = blockedUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Calculate the number of pages
    const totalPages = Math.ceil(blockedUsers.length / usersPerPage);

    return (
        <div className="blocked-user-list-container">
            <h1>Blocked Users</h1>

            <div className="user-search-bar">
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="user-list-wrapper">
                <table className="blocked-user-list">
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
                                    <img
                                        src={user.img} // Assuming your API provides the avatar URL in this field
                                        alt={`${user.userName}'s avatar`}
                                        className="blocked-user-avatar"
                                    />
                                </td>
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
                            <td colSpan="7">No blocked users found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination directly below the blocked user list */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                customStyles={{
                    bgColor: 'rgba(255, 99, 71, 0.2)',
                    activeBgColor: '#FF4500',
                    borderColor: '#FF6347',
                    textColor: 'white',
                }}            />
        </div>
    );
}

export default BlockedUsers;
