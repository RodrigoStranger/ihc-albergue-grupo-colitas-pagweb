import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PerroModal.css';

const PerroModal = ({ perro, onClose }) => {
  const navigate = useNavigate();
  const {
    NombrePerro,
    EdadPerro,
    SexoPerro,
    EstaturaPerro,
    PelajePerro,
    ActividadPerro,
    DescripcionPerro,
    FotoPerro,
    RazaPerro
  } = perro;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="perro-modal-content">
          <div className="perro-modal-image-section">
            <img 
              src={FotoPerro || "/placeholder.svg"} 
              alt={NombrePerro} 
              className="perro-modal-image"
            />
          </div>
          <div className="perro-modal-info-section">
            <div className="perro-modal-header">
              <h2 className="modal-title">{NombrePerro}</h2>
              <div className="perro-modal-sexo-container">
                <span className={`modal-sexo-badge ${SexoPerro === "Hembra" ? "hembra" : "macho"}`}>
                  {SexoPerro}
                </span>
              </div>
            </div>           
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <span className="modal-info-label">Edad</span>
                <span className="modal-info-value">{EdadPerro} años</span>
              </div>
              <div className="modal-info-item">
                <span className="modal-info-label">Sexo</span>
                <span className="modal-info-value">{SexoPerro}</span>
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
            </div>
            
            <div className="modal-description">
              <h3>Descripción</h3>
              <p>{DescripcionPerro}</p>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-adoptar"
                onClick={() => {
                  // Detectar si es móvil
                  if (window.innerWidth <= 700) {
                    navigate(`/adoptar/${perro.IdPerro}`);
                    onClose();
                  } else {
                    // Mantener el modal en escritorio
                    // Aquí podrías abrir el formulario dentro del modal si lo deseas
                  }
                }}
              >
                ¡Quiero adoptarlo!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerroModal;
