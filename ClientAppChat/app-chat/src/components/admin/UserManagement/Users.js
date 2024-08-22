import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NotificationModal from '../Modal/NotificationModal';
import '../../../css/Users.css';
import { BACKEND_URL_HTTP } from '../../../config.js';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        userName: '',
        email: '',
        password: '',
        img: '',
        roleId: 2
    });

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-users`, {
                params: { searchTerm, page: currentPage, limit: usersPerPage },
            });
            const filteredUsers = response.data.filter(user => user.status === 'Active' || user.status === 'Reported');
            setUsers(filteredUsers);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                navigate('/');
            } else if (error.response.status === 403) {
                setNotificationType('error');
                setNotificationMessage('This feature is only accessible to admins.');
                setNotificationOpen(true);
            } else {
                setNotificationType('error');
                setNotificationMessage(`An error occurred: ${error.response.statusText}`);
                setNotificationOpen(true);
            }
        } else {
            console.error('Error:', error);
            setNotificationType('error');
            setNotificationMessage('An unexpected error occurred.');
            setNotificationOpen(true);
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

            const idSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-user-by-id/${searchTerm}`);
            const nameSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-users-by-name/${searchTerm}`);
            const emailSearchPromise = axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-users-by-email/${searchTerm}`);

            const [idResponse, nameResponse, emailResponse] = await Promise.allSettled([
                idSearchPromise,
                nameSearchPromise,
                emailSearchPromise
            ]);

            if (idResponse.status === 'fulfilled' && idResponse.value.data) {
                responses.push(idResponse.value.data);
            }
            if (nameResponse.status === 'fulfilled' && nameResponse.value.data.length > 0) {
                responses = responses.concat(nameResponse.value.data);
            }
            if (emailResponse.status === 'fulfilled' && emailResponse.value.data.length > 0) {
                responses = responses.concat(emailResponse.value.data);
            }

            const uniqueUsers = Array.from(new Map(responses.map(user => [user.userId, user])).values());
            const filteredUsers = uniqueUsers.filter(user => user.status === 'Active' || user.status === 'Reported');

            if (filteredUsers.length > 0) {
                setUsers(filteredUsers);
                setNotificationType('success');
                setNotificationMessage('Search results found.');
            } else {
                setUsers([]);
                setNotificationType('error');
                setNotificationMessage('No results found.');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
            setNotificationOpen(true);
        }
    };

    const handleBlock = (userId) => {
        openModal('block', userId, 'Block User', 'Are you sure you want to block this user?');
    };

    const handleReport = (userId) => {
        setReportReason('');
        setShowReasonInput(true);
        setSelectedUserId(userId);
    };

    const handleAddUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/User/add-user`, newUser, config);
            fetchUsers();
            setCurrentPage(currentPage);
            setUsers([...users, response.data]);
            setShowAddForm(false);
            setNewUser({
                userName: '',
                email: '',
                password: '',
                img: '',
                roleId: 2
            });
            setNotificationType('success');
            setNotificationMessage('User added successfully.');
            setNotificationOpen(true);
        } catch (error) {
            handleError(error);
        }
    };

    const openModal = (action, userId, title, message) => {
        setModalAction(action);
        setSelectedUserId(userId);
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUserId(null);
        setModalAction(null);
        setReportReason('');
        setShowReasonInput(false);
    };

    const confirmAction = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };

            if (modalAction === 'block') {
                await axios.put(`http://${BACKEND_URL_HTTP}/api/User/block-user/${selectedUserId}`, [], config);
                fetchUsers();
                setNotificationType('success');
                setNotificationMessage('User blocked successfully.');
            } else if (modalAction === 'report') {
                const reportPayload = {
                    ReportedUserId: selectedUserId,
                    Reason: reportReason, // Lý do báo cáo
                };
                await axios.put(`http://${BACKEND_URL_HTTP}/api/User/report-user`, reportPayload, config);
                fetchUsers();
                setNotificationType('success');
                setNotificationMessage('User reported successfully.');
            } else if (modalAction === 'add') {
                handleAddUser();
            }
        } catch (error) {
            handleError(error);
        } finally {
            closeModal();
            setNotificationOpen(true);
        }
    };


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const totalPages = Math.ceil(users.length / usersPerPage);

    const handleOpenAddUserModal = (e) => {
        e.preventDefault();
        openModal('add', null, 'Add User', 'Are you sure you want to add this user?');
    };

    return (
        <div className="users-content">
            <h1>All Users</h1>

            <div className="user-search-bar">
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
                <button onClick={() => setShowAddForm(!showAddForm)} className="add-user-button">
                    {showAddForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {showAddForm && (
                <form className="add-user-form" onSubmit={handleOpenAddUserModal}>
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
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Avatar URL"*/}
                    {/*    value={newUser.img}*/}
                    {/*    onChange={e => setNewUser({ ...newUser, img: e.target.value })}*/}
                    {/*/>*/}
                    <select
                        value={newUser.roleId}
                        onChange={e => setNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
                    >
                        <option value={2}>User</option>
                        <option value={1}>Admin</option>
                    </select>
                    <button type="submit" className="add-user-button">Add</button>
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
                                    <img src={user.img} alt={user.userName} className="user-avatar"/>
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
                                    <div className="action-buttons">
                                        <button onClick={() => handleBlock(user.userId)}
                                                className="block-button">Block
                                        </button>
                                        <button onClick={() => handleReport(user.userId)}
                                                className="report-button">Report
                                        </button>
                                    </div>
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                customStyles={{
                    bgColor: 'rgba(76, 175, 80, 0.2)',
                    activeBgColor: '#388E3C',
                    borderColor: '#4CAF50',
                    textColor: 'white',
                }}
            />

            {showReasonInput && (
                <div className="reason-popup">
                    <div className="reason-popup-content">
                        <h4>Enter Report Reason</h4>
                        <input
                            type="text"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Enter reason"
                        />
                        <button onClick={() => {
                            setShowReasonInput(false);
                            openModal('report', selectedUserId, 'Confirm Report', 'Are you sure you want to report this user?');
                        }} className="submit-reason-button">Submit Reason</button>
                        <button onClick={() => setShowReasonInput(false)} className="cancel-reason-button">Cancel</button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalTitle}
                message={modalMessage}
            />

            <NotificationModal
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                message={notificationMessage}
                type={notificationType}
            />
        </div>
    );
}

export default Users;
