import React from 'react';
import '../../../css/NotificationModal.css'; // Optional: Custom styles for your modal

const NotificationModal = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    return (
        <div className="notification-modal-overlay">
            <div className={`notification-modal ${type}`}>
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default NotificationModal;
