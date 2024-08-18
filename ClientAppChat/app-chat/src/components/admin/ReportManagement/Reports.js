import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/Reports.css'; // Ensure you have the appropriate CSS file for styling

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/User/all-users');
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

        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            searchFilter === 'username' && report.userName.toLowerCase().includes(lowerSearchTerm) ||
            searchFilter === 'email' && report.email.toLowerCase().includes(lowerSearchTerm) ||
            searchFilter === 'id' && report.userId.toString().includes(lowerSearchTerm) ||
            !searchFilter && (
                report.userName.toLowerCase().includes(lowerSearchTerm) ||
                report.email.toLowerCase().includes(lowerSearchTerm) ||
                report.userId.toString().includes(lowerSearchTerm)
            )
        );
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="report-list-container">
            <h1>All Reports</h1>

            <div className="report-search-bar">
                <input
                    type="text"
                    placeholder="Search Report by: @username, email & ID"
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
                    <option value="id">Report ID</option>
                </select>
            </div>

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
                {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
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
    );
}

export default Reports;
