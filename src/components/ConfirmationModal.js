import React from 'react';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, donorName, phoneNumber }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-container">
        <div className="confirmation-modal-header">
          <div className="confirmation-icon">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          <h2 className="confirmation-title">¡Solicitud Enviada Exitosamente!</h2>
        </div>

        <div className="confirmation-modal-body">
          <div className="confirmation-message">
            <p className="main-message">
              <strong>Gracias {donorName}</strong> por tu generoso corazón y tu interés en ayudar a nuestros perritos rescatados.
            </p>
            
            <div className="confirmation-details">
              <div className="detail-item">
                <span className="detail-icon">📋</span>
                <div className="detail-content">
                  <h4>Tu solicitud ha sido recibida</h4>
                  <p>Hemos registrado tu solicitud de donación y está siendo procesada por nuestro equipo.</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📱</span>
                <div className="detail-content">
                  <h4>Te contactaremos pronto</h4>
                  <p>Un administrador del albergue se pondrá en contacto contigo a través de WhatsApp al número <strong>{phoneNumber}</strong> para coordinar los siguientes pasos.</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🐕</span>
                <div className="detail-content">
                  <h4>Haciendo la diferencia</h4>
                  <p>Tu donación será fundamental para continuar rescatando, rehabilitando y encontrando hogares para más perritos en necesidad.</p>
                </div>
              </div>
            </div>

            <div className="gratitude-section">
              <div className="heart-animation">❤️</div>
              <p className="gratitude-text">
                <strong>¡Tu generosidad hace la diferencia en la vida de nuestros perritos!</strong>
              </p>
              <p className="signature">
                Con amor y gratitud,<br />
                <strong>Equipo Grupo Colitas Arequipa</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="confirmation-modal-footer">
          <button className="confirmation-close-btn" onClick={onClose}>
            <span>Continuar</span>
            <div className="btn-shine"></div>
          </button>
        </div>

        <button className="confirmation-modal-close-x" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
