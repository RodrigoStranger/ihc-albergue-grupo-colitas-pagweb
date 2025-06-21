import React from 'react';
import '../styles/PerroModal.css';

const PerroModal = ({ perro, onClose }) => {
  const {
    nombreperro,
    edadperro,
    sexoperro,
    estaturaperro,
    pelajeperro,
    actividadperro,
    descripcionperro,
    fotografíaprincipalperro,
    fechaingresoperro,
    razaperro
  } = perro;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-content">
          <div className="modal-image-section">
            <img 
              src={fotografíaprincipalperro || "/placeholder.svg"} 
              alt={nombreperro}
              className="modal-image"
            />
          </div>
          
          <div className="modal-info-section">
            <div className="modal-header">
              <h2 className="modal-title">{nombreperro}</h2>
              <span className={`modal-sexo-badge ${sexoperro === "Hembra" ? "hembra" : "macho"}`}>
                {sexoperro}
              </span>
            </div>
            
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <span className="modal-info-label">Edad</span>
                <span className="modal-info-value">{edadperro} años</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Tamaño</span>
                <span className="modal-info-value">{estaturaperro}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Pelaje</span>
                <span className="modal-info-value">{pelajeperro}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Actividad</span>
                <span className="modal-info-value">{actividadperro}</span>
              </div>
              
              {razaperro && (
                <div className="modal-info-item">
                  <span className="modal-info-label">Raza</span>
                  <span className="modal-info-value">{razaperro}</span>
                </div>
              )}
              
              <div className="modal-info-item">
                <span className="modal-info-label">Fecha de ingreso</span>
                <span className="modal-info-value">{formatearFecha(fechaingresoperro)}</span>
              </div>
            </div>
            
            <div className="modal-description">
              <h3>Descripción</h3>
              <p>{descripcionperro}</p>
            </div>
            
            <div className="modal-actions">
              <button className="btn-adoptar">
                ❤️ Quiero adoptarlo
              </button>
              <button className="btn-contactar">
                📞 Contactar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerroModal;
