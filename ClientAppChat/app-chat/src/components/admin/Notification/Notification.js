/* global CKEDITOR */ // Add this to let ESLint know CKEDITOR is defined globally

import React, { useEffect } from 'react';
import axios from 'axios';
import '../../../../../../../../AppChat/ClientAppChat/app-chat/src/css/Notifications.css'; // Your custom styles

function Notifications() {
    useEffect(() => {
        // Initialize CKEditor 4
        if (window.CKEDITOR) {
            CKEDITOR.replace('editor', {
                toolbar: [
                    { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
                    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
                    { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
                    '/',
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
                    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe'] },
                    '/',
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                    { name: 'colors', items: ['TextColor', 'BGColor'] },
                    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
                ]
            });
        }

        return () => {
            // Safely destroy CKEditor instances
            if (window.CKEDITOR) {
                for (let instance in CKEDITOR.instances) {
                    CKEDITOR.instances[instance].destroy();
                }
            }
        };
    }, []);

    const handleSend = async () => {
        const editorData = CKEDITOR.instances.editor.getData();

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
                    <textarea id="editor" placeholder="Message" className="message-input"></textarea>
                </div>
                <button onClick={handleSend} className="send-button">
                    Send message
                </button>
            </div>
        </div>
    );
}

export default Notifications;
