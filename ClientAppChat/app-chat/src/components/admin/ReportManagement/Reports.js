import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NotificationModal from '../Modal/NotificationModal';
import '../../../css/Reports.css';
import { BACKEND_URL_HTTP } from '../../../config.js';

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // State for modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUserReports, setSelectedUserReports] = useState([]);

    // State for block confirmation modal
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // Notification modal states
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchReports();
    }, [currentPage]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-reports`);
            setReports(response.data);
        } catch (err) {
            setError(err.message);
            setNotificationType('error');
            setNotificationMessage('Failed to fetch reports. Please try again.');
            setNotificationOpen(true);
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = (userId) => {
        openModal('block', userId, 'Block User', 'Are you sure you want to block this user?');
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
    };

    const confirmAction = async () => {
        try {
            if (modalAction === 'block') {
                await axios.put(`http://${BACKEND_URL_HTTP}/api/User/block-user/${selectedUserId}`);
                setNotificationType('success');
                setNotificationMessage('User blocked successfully.');
                fetchReports(); // Refresh the reports after blocking
            }
        } catch (error) {
            console.error(`Error performing ${modalAction}:`, error);
            setNotificationType('error');
            setNotificationMessage(`Failed to ${modalAction} user. Please try again.`);
        } finally {
            closeModal(); // Ensure modal is closed after all actions
            setNotificationOpen(true); // Show the notification modal
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            setNotificationType('error');
            setNotificationMessage('Please enter a valid User ID.');
            setNotificationOpen(true);
            return;
        }

        try {
            setLoading(true);

            // Fetch reports by reported user ID
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-reports-by-reported-user-id/${searchTerm}`);

            if (response.data && response.data.length > 0) {
                setReports(response.data); // Set the reports found for the reportedUserId
                setNotificationType('success');
                setNotificationMessage('Reports found for this user.');
            } else {
                setReports([]);
                setNotificationType('error');
                setNotificationMessage('No reports found for this user.');
            }

            setNotificationOpen(true);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setNotificationType('error');
            setNotificationMessage('No reports found for this user.');
            setNotificationOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (reportedUserId) => {
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/getReportsByUserId/${reportedUserId}`);
            setSelectedUserReports(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching user reports:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to load details. Please try again.');
            setNotificationOpen(true);
        }
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedUserReports([]);
    };

    const indexOfLastReport = currentPage * usersPerPage;
    const indexOfFirstReport = indexOfLastReport - usersPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const totalPages = Math.ceil(reports.length / usersPerPage);

    return (
        <div className="report-list-container">
            <h1>All Reports</h1>

            <div className="report-search-bar">
                <input
                    type="text"
                    placeholder="Search by Report ID"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            <div className="report-list-wrapper">
                <table className="report-list">
                    <thead>
                    <tr>
                        <th>Report ID</th>
                        <th>User ID</th>
                        <th>Report Amount</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentReports.length > 0 ? (
                        currentReports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.reportId}</td>
                                <td>{report.reportedUserId}</td>
                                <td>{report.reportedUserReportAmount}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleViewDetails(report.reportedUserId)}
                                                className="details-button">Details
                                        </button>
                                        <button onClick={() => handleBlock(report.reportedUserId)}
                                                className="block-button">Block
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No reports found</td>
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
                    bgColor: 'rgba(255, 193, 7, 0.2)',
                    activeBgColor: '#FFC107',
                    borderColor: '#FFC107',
                    textColor: 'white',
                }}
            />

            {/* Modal for showing report details */}
            <Modal
                isOpen={showDetailModal}
                onRequestClose={closeDetailModal}
                contentLabel="Report Details"
            >
                <h2>Report Details</h2>
                <table className="report-details-table">
                    <thead>
                    <tr>
                        <th>Reporting BY UserID</th>
                        <th>Reason</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedUserReports.length > 0 ? (
                        selectedUserReports.map((report, index) => (
                            <tr key={index}>
                                <td>{report.reportingUserId}</td>
                                <td>{report.reason}</td>
                                <td>{new Date(report.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No details found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={closeDetailModal} style={{ marginTop: '20px' }}>Close</button>
            </Modal>

            {/* Reusable Modal for confirming actions */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalTitle}
                message={modalMessage}
            />

            {/* Notification Modal for success/error messages */}
            <NotificationModal
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                message={notificationMessage}
                type={notificationType} // 'success' or 'error'
            />
        </div>
    );
}

export default Reports;
