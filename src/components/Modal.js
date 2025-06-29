import React from 'react';
import '../styles/Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'error'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${type === 'error' ? 'modal-error' : 'modal-success'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-button" onClick={onClose}>
            {type === 'error' ? 'Cerrar' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
