import React from 'react';

const ModalHeader = ({ title, onClose }) => (
    <div className="modal-header">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>
            &times;
        </button>
    </div>
);

export default ModalHeader;
