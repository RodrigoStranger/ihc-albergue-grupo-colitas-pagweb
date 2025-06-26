import React from 'react';
import '../styles/PerroModal.css';

const PerroModal = ({ perro, onClose }) => {
  const {
    NombrePerro,
    EdadPerro,
    SexoPerro,
    EstaturaPerro,
    PelajePerro,
    ActividadPerro,
    DescripcionPerro,
    FotoPerro,
    IngresoPerro,
    RazaPerro
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
              src={FotoPerro || "/placeholder.svg"} 
              alt={NombrePerro}
              className="modal-image"
            />
          </div>
          
          <div className="modal-info-section">
            <div className="modal-header">
              <h2 className="modal-title">{NombrePerro}</h2>
              <span className={`modal-sexo-badge ${SexoPerro === "Hembra" ? "hembra" : "macho"}`}>
                {SexoPerro}
              </span>
            </div>
            
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <span className="modal-info-label">Edad</span>
                <span className="modal-info-value">{EdadPerro} años</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Tamaño</span>
                <span className="modal-info-value">{EstaturaPerro}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Pelaje</span>
                <span className="modal-info-value">{PelajePerro}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-info-label">Actividad</span>
                <span className="modal-info-value">{ActividadPerro}</span>
              </div>
              
              {RazaPerro && (
                <div className="modal-info-item">
                  <span className="modal-info-label">Raza</span>
                  <span className="modal-info-value">{RazaPerro}</span>
                </div>
              )}
              
              <div className="modal-info-item">
                <span className="modal-info-label">Fecha de ingreso</span>
                <span className="modal-info-value">{formatearFecha(IngresoPerro)}</span>
              </div>
            </div>
            
            <div className="modal-description">
              <h3>Descripción</h3>
              <p>{DescripcionPerro}</p>
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
