import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, icon, bgColor, apiUrl }) => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setCount(response.data); // Ensure that the API returns just the count
            } catch (error) {
                console.error(`Error fetching ${title} count:`, error);
                setCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, title]);

    return (
        <div className="stat-card" style={{ backgroundColor: bgColor }}>
            <div className="stat-card-icon">
                <img src={icon} alt={`${title} icon`} />
            </div>
            <div className="stat-card-info">
                <h3>{title}</h3>
                {loading ? <p>Loading...</p> : <p>{count}</p>}
            </div>
        </div>
    );
};

export default StatCard;
