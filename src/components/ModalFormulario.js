import React, { useState, useRef, useEffect } from 'react';
import ModalConfirmacionFirmas from './ModalConfirmacionFirmas';
import supabase from '../supabase/client';
import '../styles/ModalFormulario.css';

function ModalFormulario({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    DniFirma: '',
    NombreFirma: '',
    MotivoFirma: '',
    ImagenFirma: null
  });
  const [error, setError] = useState('');
  const [showImageError, setShowImageError] = useState(false);
  const modalRef = useRef();

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setFormData({
        DniFirma: '',
        NombreFirma: '',
        MotivoFirma: '',
        ImagenFirma: null
      });
      setError('');
      setShowImageError(false);
    }
  }, [show]);

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

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        ImagenFirma: file
      }));
      setError('');
      setShowImageError(false);
      return true;
    } else {
      setError('Por favor, seleccione un archivo de imagen válido');
      return false;
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formDataToSend, setFormDataToSend] = useState(null);
  const [showDniExistsModal, setShowDniExistsModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowImageError(false);
    
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
      setShowImageError(true);
      document.getElementById('file-upload-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Si todo está bien, preparar los datos del formulario
    const formDataToSend = new FormData();
    formDataToSend.append('DniFirma', formData.DniFirma);
    formDataToSend.append('NombreFirma', formData.NombreFirma);
    formDataToSend.append('MotivoFirma', formData.MotivoFirma);
    formDataToSend.append('ImagenFirma', formData.ImagenFirma);

    try {
      setIsSubmitting(true);
      setError('');
      let existingDni = null;
      let checkError = null;
      try {
        const result = await supabase
          .from('CampanaFirmas')
          .select('DniFirma')
          .eq('DniFirma', formData.DniFirma)
          .single();
        existingDni = result.data;
        checkError = result.error;
      } catch (e) {
        // Si hay error 406, lo ignoramos y asumimos que el DNI no existe
        if (e.status !== 406) throw e;
      }
      if (existingDni) {
        setShowDniExistsModal(true);
        setIsSubmitting(false);
        return;
      }
      if (checkError && checkError.code !== 'PGRST116' && checkError.status !== 406) {
        throw checkError;
      }
      // Subir imagen al storage SOLO si el DNI no existe
      const fileName = `firma_${formData.DniFirma}.png`;
      const { error: uploadError } = await supabase.storage
        .from('firmas')
        .upload(fileName, formData.ImagenFirma);
      if (uploadError) {
        throw uploadError;
      }
      // Obtener URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('firmas')
        .getPublicUrl(fileName);
      // Insertar registro en la base de datos
      const { error: insertError } = await supabase
        .from('CampanaFirmas')
        .insert({
          DniFirma: formData.DniFirma,
          NombreFirma: formData.NombreFirma,
          MotivoFirma: formData.MotivoFirma,
          ImagenFirma: publicUrl,
          FechaRegistro: new Date(new Date().getTime() - (5 * 60 * 60 * 1000)).toISOString()
        });
      if (insertError) {
        throw insertError;
      }
      // Mostrar modal de éxito
      setFormDataToSend(formDataToSend);
      setShowSuccessModal(true);
    } catch (error) {
      setError(`Ocurrió un error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  // Estilos eliminados para usar solo CSS

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    if (formDataToSend) {
      onSubmit(formDataToSend);
    }
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <ModalConfirmacionFirmas 
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        nombre={formData.NombreFirma}
      />
      {/* Modal para DNI ya existente */}
      {showDniExistsModal && (
        <div className="confirmation-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowDniExistsModal(false); }}>
          <div className="confirmation-modal-container">
            <div className="confirmation-modal-scroll">
              <div className="confirmation-modal-inner">
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
                  <h2 className="confirmation-title">Ya enviaste una solicitud</h2>
                </div>
                <div className="confirmation-modal-body">
                  <div className="confirmation-message">
                    <p className="main-message">
                      Ya existe una firma registrada con este DNI.<br />
                      Si necesitas actualizar tu petición, por favor contáctanos.
                    </p>
                    <div className="gratitude-section">
                      <div className="heart-animation">❤️</div>
                      <p className="gratitude-text">
                        ¡Gracias por tu interés en apoyar la campaña!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmation-modal-footer">
                  <button className="confirmation-close-btn" onClick={() => setShowDniExistsModal(false)}>
                    <span>Entendido</span>
                    <div className="btn-shine"></div>
                  </button>
                </div>
              </div>
            </div>
            <button className="confirmation-modal-close-x" onClick={() => setShowDniExistsModal(false)} aria-label="Cerrar modal">
              ×
            </button>
          </div>
        </div>
      )}
      <div className="modal-formulario">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header" id="modal-formulario-top">
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
          <form onSubmit={handleSubmit} className="formulario-form" id="formulario-form">
            {/* Mensaje de error general solo sobre el campo correspondiente */}
            {/* Error de DNI */}
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
            <label htmlFor="ImagenFirma" required>Imagen de Firma</label>
            <div className="file-upload-container">
              <div id="file-upload-area" className="file-upload-area" onClick={() => document.getElementById('ImagenFirma').click()}>
                <input 
                  type="file" 
                  id="ImagenFirma"
                  name="ImagenFirma"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="file-input"
                />
                <div className="upload-content">
                  {formData.ImagenFirma ? (
                    <>
                      <i className="fas fa-check-circle" style={{color: '#10B981', fontSize: '2rem'}}></i>
                      <p>¡Imagen cargada exitosamente!</p>
                      <div className="file-info">
                        <p><strong>Archivo seleccionado:</strong> {formData.ImagenFirma.name}</p>
                        <p><strong>Tamaño:</strong> {(formData.ImagenFirma.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="file-note">Puedes volver a cargar una nueva imagen si lo desea dando clic en el recuadro</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Arrastra tu imagen aquí o haz clic para seleccionar</p>
                      <p className="file-info">
                        Formatos soportados: JPG, PNG (máx. 5MB)
                      </p>
                    </>
                  )}
                </div>
                {showImageError && !formData.ImagenFirma && (
                  <p className="field-error-message">Cargue su firma para continuar</p>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || showDniExistsModal}
          >
            {isSubmitting ? 'Enviando Petición...' : 'Enviar Petición'}
          </button>
          
          <div className="data-protection-notice">
            <p>Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos Personales.</p>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

export default ModalFormulario;
