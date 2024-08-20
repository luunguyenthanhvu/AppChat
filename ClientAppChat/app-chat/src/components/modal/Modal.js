import React, { useEffect, useRef } from 'react';
import './Modal.css'; // Import custom CSS
const Modal = ({ show, header, children, footer }) => {
    const modalOverlayRef = useRef(null);
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (show) {
            modalOverlayRef.current.classList.add('show');
            modalContentRef.current.classList.add('show');
        } else {
            modalOverlayRef.current.classList.remove('show');
            modalContentRef.current.classList.remove('show');
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="modal-overlay" ref={modalOverlayRef}>
            <div className="modal-content" ref={modalContentRef} onClick={(e) => e.stopPropagation()}>
                {header}
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
