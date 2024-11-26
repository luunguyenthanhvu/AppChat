import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import Modal from 'react-modal';
import NotificationModal from '../Modal/NotificationModal';
import '../../../css/Reports.css';
import { BACKEND_URL_HTTP } from '../../../config.js';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        maxHeight: '80%',
        overflowY: 'auto',
    },
};

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // State for library modal (View Details)
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUserReports, setSelectedUserReports] = useState([]);

    // Notification modal states
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, [currentPage]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-reports`, config);
            setReports(response.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                navigate('/login');
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
            setNotificationMessage('Please enter a valid User ID.');
            setNotificationOpen(true);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/get-reports-by-reported-user-id/${searchTerm}`, config);

            if (response.data && response.data.length > 0) {
                setReports(response.data);
                setNotificationType('success');
                setNotificationMessage('Reports found for this user.');
            } else {
                setReports([]);
                setNotificationType('error');
                setNotificationMessage('No reports found for this user.');
            }

            setNotificationOpen(true);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (reportedUserId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/getReportsByUserId/${reportedUserId}`, config);
            setSelectedUserReports(response.data);
            setShowDetailModal(true);
        } catch (error) {
            handleError(error);
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

            {/* Library Modal for showing report details */}
            <Modal
                isOpen={showDetailModal}
                onRequestClose={closeDetailModal}
                style={customStyles}
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
                <button onClick={closeDetailModal} className="buttonClose">Close</button>
            </Modal>

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
