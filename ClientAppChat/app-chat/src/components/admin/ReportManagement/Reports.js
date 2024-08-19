import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination'; // Importing the pagination component
import '../../../css/Reports.css'; // Ensure you have the appropriate CSS file for styling
import { BACKEND_URL_HTTP } from '../../../config.js'; // Importing the backend URL

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Set reports per page

    useEffect(() => {
        fetchReports();
    }, [currentPage]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/User/all-users`);
            // Filter users with 'Reported' status
            const reportsList = response.data.filter(user => user.status === 'Reported');
            setReports(reportsList);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            alert('Please enter a valid Report ID.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/UserManagement/getUserById/${searchTerm}`);
            if (response.data && response.data.status === 'Reported') {
                setReports([response.data]); // Display only the found reported user in the list
            } else {
                setReports([]); // Clear reports if no match
                alert('Reported user not found.');
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            alert('Reported user not found.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic: determine current reports
    const indexOfLastReport = currentPage * usersPerPage;
    const indexOfFirstReport = indexOfLastReport - usersPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Calculate the number of pages
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
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="report-list-wrapper">
                <table className="report-list">
                    <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Report ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentReports.length > 0 ? (
                        currentReports.map(report => (
                            <tr key={report.userId}>
                                <td>
                                    <img
                                        src={report.img} // Assuming your API provides the avatar URL in this field
                                        alt={`${report.userName}'s avatar`}
                                        className="report-avatar"
                                    />
                                </td>
                                <td>{report.userId}</td>
                                <td>{report.userName}</td>
                                <td>{report.email}</td>
                                <td>
                                    <span className="reports-status-label">
                                        {report.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="reports-role-label">
                                        {report.role}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => console.log(`Edit report with ID: ${report.userId}`)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No reports found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination directly below the report list */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                customStyles={{
                    bgColor: 'rgba(255, 193, 7, 0.2)',
                    activeBgColor: '#FFC107',
                    borderColor: '#FFC107',
                    textColor: 'white',
                }}      />
        </div>
    );
}

export default Reports;
