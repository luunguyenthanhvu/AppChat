import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NotificationModal from '../Modal/NotificationModal';
import '../../../css/BlockedUsers.css';
import { BACKEND_URL_HTTP } from '../../../config.js';

function BlockedUsers() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // State for the modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);

    // State for the notification modal
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchBlockedUsers();
    }, [currentPage]);

    const fetchBlockedUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-users`);
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
            setNotificationType('error');
            setNotificationMessage('Please enter a search term.');
            setNotificationOpen(true);
            return;
        }

        try {
            setLoading(true);
            let responses = [];

            // Call all three APIs in parallel
            const idSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-user-by-id/${searchTerm}`);
            const nameSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-users-by-name/${searchTerm}`);
            const emailSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-users-by-email/${searchTerm}`);

            // Wait for all promises to complete
            const [idResponse, nameResponse, emailResponse] = await Promise.allSettled([
                idSearchPromise,
                nameSearchPromise,
                emailSearchPromise
            ]);

            // Collect results from successful responses
            if (idResponse.status === 'fulfilled' && idResponse.value.data) {
                responses.push(idResponse.value.data);
            }
            if (nameResponse.status === 'fulfilled' && nameResponse.value.data.length > 0) {
                responses = responses.concat(nameResponse.value.data);
            }
            if (emailResponse.status === 'fulfilled' && emailResponse.value.data.length > 0) {
                responses = responses.concat(emailResponse.value.data);
            }

            // Deduplicate results based on user ID
            const uniqueUsers = Array.from(new Map(responses.map(user => [user.userId, user])).values());

            // Filter users with status "Blocked"
            const filteredUsers = uniqueUsers.filter(user => user.status === 'Blocked');

            if (filteredUsers.length > 0) {
                setBlockedUsers(filteredUsers);
                setNotificationType('success');
                setNotificationMessage('Blocked users found.');
            } else {
                setBlockedUsers([]);
                setNotificationType('error');
                setNotificationMessage('No blocked users found.');
            }
        } catch (error) {
            console.error('Error during search:', error);
            setNotificationType('error');
            setNotificationMessage('Error during search.');
        } finally {
            setLoading(false);
            setNotificationOpen(true);
        }
    };



    const openModal = (userId, action) => {
        setSelectedUserId(userId);
        setModalAction(action);
        if (action === 'unblock') {
            setModalTitle('Unblock User');
            setModalMessage('Are you sure you want to unblock this user?');
        } else if (action === 'delete') {
            setModalTitle('Delete User');
            setModalMessage('Are you sure you want to delete this user? This action cannot be undone.');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUserId(null);
        setModalAction(null);
    };

    const confirmAction = async () => {
        try {
            if (modalAction === 'unblock') {
                await axios.put(`http://${BACKEND_URL_HTTP}/api/User/unblock-user/${selectedUserId}`);
                setBlockedUsers(blockedUsers.filter(user => user.userId !== selectedUserId));
                setNotificationType('success');
                setNotificationMessage('User unblocked successfully.');
            } else if (modalAction === 'delete') {
                await axios.delete(`http://${BACKEND_URL_HTTP}/api/User/remove-user/${selectedUserId}`);
                setBlockedUsers(blockedUsers.filter(user => user.userId !== selectedUserId));
                setNotificationType('success');
                setNotificationMessage('User deleted successfully.');
            }
        } catch (error) {
            console.error(`Error performing ${modalAction}:`, error);
            setNotificationType('error');
            setNotificationMessage(`Failed to ${modalAction} user. Please try again.`);
        } finally {
            closeModal();
            setNotificationOpen(true);
        }
    };

    const handleUnblock = (userId) => {
        openModal(userId, 'unblock');
    };

    const handleDelete = (userId) => {
        openModal(userId, 'delete');
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = blockedUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                <button onClick={handleSearch} className="search-button">Search</button>
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
                                        src={user.img}
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
                                    <div className="action-buttons">
                                        <button className="unblock-button"
                                                onClick={() => handleUnblock(user.userId)}>Unblock
                                        </button>
                                        <button className="delete-button"
                                                onClick={() => handleDelete(user.userId)}>Delete
                                        </button>
                                    </div>
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                customStyles={{
                    bgColor: 'rgba(255, 99, 71, 0.2)',
                    activeBgColor: '#FF4500',
                    borderColor: '#FF6347',
                    textColor: 'white',
                }}
            />

            {/* Modal confirm for unblock or delete actions */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalTitle}
                message={modalMessage}
            />

            {/* Notification modal for success/error messages */}
            <NotificationModal
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                message={notificationMessage}
                type={notificationType}
            />
        </div>
    );
}

export default BlockedUsers;
