import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/Reports.css'; // Ensure you have the appropriate CSS file for styling

function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/Report/all-reports');
                setReports(response.data);
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
        const match = report.ReportName && report.ReportName.toLowerCase().includes(lowerSearchTerm);

        return match && (!statusFilter || report.Status.toLowerCase() === statusFilter.toLowerCase());
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="report-list-container">
            <h1>Reports</h1>

            <div className="report-search-bar">
                <input
                    type="text"
                    placeholder="Search Report by name"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    className="search-status"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
                <button className="search-button">
                    <i className="fa fa-search"></i>
                </button>
            </div>

            <table className="report-list">
                <thead>
                <tr>
                    <th>Report ID</th>
                    <th>Report Name</th>
                    <th>Created at</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                        <tr key={report.ReportId}>
                            <td>{report.ReportId}</td>
                            <td>{report.ReportName}</td>
                            <td>{new Date(report.CreatedAt).toLocaleString()}</td>
                            <td>{report.Status}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No reports found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;
