import React, { useState } from 'react';
import axios from 'axios';
import '../../../css/Notifications.css'; // Đảm bảo bạn có CSS tương tự để tạo phong cách như hình ảnh

function Notifications() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSend = async () => {
        try {
            const response = await axios.post('http://localhost:5133/api/Notification/send-notification', {
                title,
                message
            });

            if (response.data.Success) {
                setStatus('Notification sent successfully!');
            } else {
                setStatus('Failed to send notification.');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            setStatus('Error occurred while sending notification.');
        }
    };

    return (
        <div className="notifications-container">
            <div className="push-notifications">
                <h2>Push notifications</h2>
                <p>Send push notifications to all users</p>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="message-input"
                    />
                </div>
                <button onClick={handleSend} className="send-button">
                    Send message
                </button>
                {status && <p className="status-message">{status}</p>}
            </div>
        </div>
    );
}

export default Notifications;
