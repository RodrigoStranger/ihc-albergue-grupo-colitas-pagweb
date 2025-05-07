import React, { useState, useRef, useEffect } from 'react';
import '../styles/ModalFormulario.css';

function ModalFormulario({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    DniFirma: '',
    NombreFirma: '',
    MotivoFirma: '',
    ImagenFirma: null
  });
  const [error, setError] = useState('');
  const modalRef = useRef();

  // Cerrar el modal al hacer clic fuera del contenido
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para el campo de nombre completo
    if (name === 'NombreFirma') {
      // Solo permite letras, espacios y algunos caracteres especiales comunes en nombres
      const onlyLettersAndSpaces = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: onlyLettersAndSpaces
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        ImagenFirma: file
      }));
      setError('');
    } else {
      setError('Por favor, seleccione un archivo de imagen válido');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!/^\d{8}$/.test(formData.DniFirma)) {
      setError('El DNI debe contener exactamente 8 dígitos');
      return;
    }
    
    if (!formData.NombreFirma.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    
    if (!formData.MotivoFirma.trim()) {
      setError('El motivo es obligatorio');
      return;
    }
    
    if (!formData.ImagenFirma) {
      setError('Debe seleccionar una imagen');
      return;
    }

    // Si todo está bien, enviar el formulario
    const formDataToSend = new FormData();
    formDataToSend.append('DniFirma', formData.DniFirma);
    formDataToSend.append('NombreFirma', formData.NombreFirma);
    formDataToSend.append('MotivoFirma', formData.MotivoFirma);
    formDataToSend.append('ImagenFirma', formData.ImagenFirma);

    onSubmit(formDataToSend);
    onClose();
  };

  if (!show) return null;

  // Asegurarse de que el modal esté en el nivel más alto
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
    zIndex: 1000,
    width: '100%',
    height: '100%'
  };

  return (
    <div className="modal-formulario" style={modalStyle}>
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>Registra tú petición</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="formulario-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="dni" required>DNI</label>
            <input 
              type="text" 
              id="DniFirma"
              name="DniFirma"
              placeholder="Ingrese su DNI"
              value={formData.DniFirma}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  setFormData(prev => ({ ...prev, DniFirma: value }));
                }
              }}
              required
              maxLength={8}
              pattern="[0-9]{8}"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nombre" required>Nombres Completos</label>
            <input 
              type="text" 
              id="NombreFirma"
              name="NombreFirma"
              placeholder="Ingrese su nombre completo"
              value={formData.NombreFirma}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="motivo" required>Motivo</label>
            <textarea 
              id="MotivoFirma"
              name="MotivoFirma"
              placeholder="Ingrese el motivo de su firma"
              value={formData.MotivoFirma}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="imagen" required>Imagen de Firma</label>
            <input 
              type="file" 
              id="ImagenFirma"
              name="ImagenFirma"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {formData.ImagenFirma && (
              <div className="file-preview">
                Archivo seleccionado: {formData.ImagenFirma.name}
              </div>
            )}
          </div>
          
          <button type="submit" className="submit-button">
            Enviar Petición
          </button>
          
          <div className="data-protection-notice">
            <p>Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos Personales.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalFormulario;
