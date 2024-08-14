import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/Groups.css'; // Ensure you have the appropriate CSS file for styling

function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5133/api/Group/all-groups');
                setGroups(response.data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching groups:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(group => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const match = group.GroupName && group.GroupName.toLowerCase().includes(lowerSearchTerm);

        return match && (!statusFilter || group.Status.toLowerCase() === statusFilter.toLowerCase());
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="group-list-container">
            <h1>Groups</h1>

            <div className="group-search-bar">
                <input
                    type="text"
                    placeholder="Search Group by name"
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
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
                <button className="search-button">
                    <i className="fa fa-search"></i>
                </button>
            </div>

            <table className="group-list">
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Members</th>
                    <th>Created at</th>
                    <th>Status</th>
                    <th>Created By</th>
                </tr>
                </thead>
                <tbody>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <tr key={group.GroupId}>
                            <td><img src={group.PhotoUrl} alt="Group" className="group-photo" /></td>
                            <td>{group.GroupName}</td>
                            <td>{group.MembersCount}</td>
                            <td>{new Date(group.CreatedAt).toLocaleString()}</td>
                            <td>{group.Status}</td>
                            <td>{group.CreatedBy}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No groups found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Groups;
