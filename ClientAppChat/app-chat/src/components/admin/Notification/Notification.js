import React, { useState, useEffect } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import '../../../css/Notifications.css';

function Notifications() {
    const handleSend = async () => {
        const editorData = window.editor.getData();

        try {
            const response = await axios.post('http://localhost:5133/api/Notification/send-notification', {
                message: editorData
            });

            alert(response.data.Success ? 'Notification sent successfully!' : 'Failed to send notification.');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Error occurred while sending notification.');
        }
    };

    return (
        <div className="notifications-container">
            <div className="push-notifications">
                <div className="form-group">
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            toolbar: [
                                'heading', '|',
                                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
                                'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                                'alignment', 'outdent', 'indent', '|',
                                'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                'insertTable', 'mediaEmbed', 'imageUpload', '|',
                                'undo', 'redo', '|',
                                'removeFormat', 'sourceEditing', '|',
                                'specialCharacters', 'highlight', 'horizontalLine', 'codeBlock', '|',
                                'findAndReplace'
                            ],
                            fontSize: {
                                options: [
                                    9,
                                    11,
                                    13,
                                    'default',
                                    17,
                                    19,
                                    21
                                ]
                            },
                            alignment: {
                                options: ['left', 'center', 'right', 'justify']
                            }
                        }}
                        onReady={(editor) => {
                            window.editor = editor;
                        }}
                    />
                </div>
                <button onClick={handleSend} className="send-button">
                    Send message
                </button>
            </div>
        </div>
    );
}

export default Notifications;
