import React from 'react';
import '../styles/ModalConfirmacionFirmas.css';

function ModalConfirmacionFirmas({ show, onClose }) {
  if (!show) return null;

  // Estilos mínimos necesarios para el funcionamiento
  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  };

  return (
    <div className="modal-confirmacion" style={modalStyle}>
      <div className="modal-confirmacion-content">
        <h2>¡Gracias por hacer la petición!</h2>
        <p>
          Tu apoyo es muy valioso para nosotros. Juntos estamos haciendo la diferencia 
          por los animales necesitados.
        </p>
        <button 
          onClick={onClose}
          className="submit-button"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default ModalConfirmacionFirmas;
