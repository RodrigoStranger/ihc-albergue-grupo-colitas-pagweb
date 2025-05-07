import React from 'react';
import '../styles/ModalConfirmacionFirmas.css';

function ModalConfirmacionFirmas({ show, onClose }) {
  if (!show) return null;

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
    zIndex: 2000,
    width: '100%',
    height: '100%'
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  const titleStyle = {
    color: '#0DB199',
    marginBottom: '1.5rem',
    fontSize: '1.8rem'
  };

  const messageStyle = {
    margin: '1.5rem 0',
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: '1.6'
  };

  return (
    <div className="modal-confirmacion" style={modalStyle}>
      <div className="modal-confirmacion-content" style={contentStyle}>
        <h2 style={titleStyle}>¡Gracias por tu firma!</h2>
        <p style={messageStyle}>
          Tu apoyo es muy valioso para nosotros. Juntos estamos haciendo la diferencia 
          por los animales necesitados. Cada firma nos acerca más a nuestro objetivo de 
          brindarles una vida mejor.
        </p>
        <button 
          onClick={onClose}
          className="submit-button"
          style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default ModalConfirmacionFirmas;
