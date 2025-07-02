import React from 'react';
import '../styles/ConfirmationModal.css';

const VoluntariadoConfirmationModal = ({ isOpen, onClose, volunteerName, phoneNumber }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-container">
        <div className="confirmation-modal-scroll">
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
            <h2 className="confirmation-title">¡Solicitud de Voluntariado Enviada!</h2>
          </div>

          <div className="confirmation-modal-body">
            <div className="confirmation-message">
              <p className="main-message">
                <strong>¡Gracias {volunteerName}</strong> por tu interés en ser parte de nuestro equipo de voluntarios!
              </p>
              
              <div className="confirmation-details">
                <div className="detail-item">
                  <span className="detail-icon">📋</span>
                  <div className="detail-content">
                    <h4>Tu solicitud ha sido recibida</h4>
                    <p>Hemos registrado tu solicitud de voluntariado y está siendo revisada por nuestro equipo.</p>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📱</span>
                  <div className="detail-content">
                    <h4>Te contactaremos pronto</h4>
                    <p>Un administrador del albergue se pondrá en contacto contigo a través de WhatsApp al número <strong>{phoneNumber}</strong> para coordinar una entrevista y los siguientes pasos.</p>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🐕</span>
                  <div className="detail-content">
                    <h4>Impacto en vidas</h4>
                    <p>Tu tiempo y dedicación serán fundamentales para mejorar la vida de nuestros perritos rescatados mientras encuentran un hogar permanente.</p>
                  </div>
                </div>
              </div>

              <div className="gratitude-section">
                <div className="heart-animation">❤️</div>
                <p className="gratitude-text">
                  <strong>¡Tu compromiso hace una gran diferencia en la vida de nuestros perritos!</strong>
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
        </div>
        
        <button className="confirmation-modal-close-x" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>
      </div>
    </div>
  );
};

export default VoluntariadoConfirmationModal;
