import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../../../css/Notifications.css';
import useChat from '../../hook/useChat.js';

function Notifications() {
    const [notificationText, setNotificationText] = useState('');
    const [sending, setSending] = useState(false); // Flag to handle sending state
    const [lastMessage, setLastMessage] = useState(''); // State to store the last message
    const { sendNotification } = useChat();

    const handleSend = async () => {
        if (sending) return; // Prevent multiple sends
        setSending(true);

        try {
            // Check if the new message is the same as the last one
            if (notificationText.trim() === lastMessage) {
                Swal.fire({
                    title: 'Info',
                    text: 'This notification has already been sent.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
                setSending(false);
                return;
            }

            if (notificationText.trim()) {
                await sendNotification(notificationText);
                
                // Update the last message state
                setLastMessage(notificationText.trim());

                // Clear the textarea after sending
                setNotificationText('');

                // Show success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Notification sent successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error sending notification:', error);

            // Show error message
            Swal.fire({
                title: 'Error!',
                text: 'Error occurred while sending notification.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setSending(false); // Reset flag
        }
    };

    return (
        <div className="notifications-container">
            <div className="push-notifications">
                <div className="form-group">
                    <textarea
                        value={notificationText}
                        onChange={(e) => setNotificationText(e.target.value)}
                        rows="5"
                        cols="40"
                        placeholder="Enter your notification here..."
                    />
                </div>
                <button onClick={handleSend} className="send-button" disabled={sending}>
                    Send message
                </button>
            </div>
        </div>
    );
}

export default Notifications;
