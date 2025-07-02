import React, { useState } from 'react';
import supabase from '../supabase/client';
import '../styles/Donar.css';
import '../styles/Modal.css';
import Modal from '../components/Modal';

function Donar() {
  const [formData, setFormData] = useState({
    NombreSolicitanteDonacion: '',
    Numero1SolicitanteDonacion: '',
    Numero2SolicitanteDonacion: '',
    DescripcionSolicitanteDonacion: '',
    EstadoSolicitanteDonacion: 'Pendiente'
  });
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para errores específicos de cada campo
  const [fieldErrors, setFieldErrors] = useState({
    NombreSolicitanteDonacion: '',
    Numero1SolicitanteDonacion: '',
    Numero2SolicitanteDonacion: '',
    DescripcionSolicitanteDonacion: ''
  });

  // Función para validar un campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'NombreSolicitanteDonacion':
        if (!value.trim()) {
          errorMessage = 'El nombre es obligatorio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = 'El nombre solo puede contener letras y espacios';
        }
        break;
      case 'Numero1SolicitanteDonacion':
        if (!value || value.trim() === '') {
          errorMessage = 'El número de teléfono es obligatorio';
        } else if (value.length !== 9) {
          errorMessage = 'El número de teléfono debe tener exactamente 9 dígitos';
        }
        break;
      case 'Numero2SolicitanteDonacion':
        if (value && value.trim() !== '' && value.length !== 9) {
          errorMessage = 'El segundo número de teléfono debe tener exactamente 9 dígitos';
        }
        break;
      case 'DescripcionSolicitanteDonacion':
        if (!value.trim()) {
          errorMessage = 'La descripción es obligatoria';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones especiales para el nombre (solo letras)
    if (name === 'NombreSolicitanteDonacion') {
      // Filtrar solo letras y espacios
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Limpiar errores previos
    setFieldErrors({
      NombreSolicitanteDonacion: '',
      Numero1SolicitanteDonacion: '',
      Numero2SolicitanteDonacion: '',
      DescripcionSolicitanteDonacion: ''
    });
    
    // Validar todos los campos obligatorios
    const isNombreValid = validateField('NombreSolicitanteDonacion', formData.NombreSolicitanteDonacion);
    const isTelefonoValid = validateField('Numero1SolicitanteDonacion', formData.Numero1SolicitanteDonacion);
    const isTelefono2Valid = validateField('Numero2SolicitanteDonacion', formData.Numero2SolicitanteDonacion);
    const isDescripcionValid = validateField('DescripcionSolicitanteDonacion', formData.DescripcionSolicitanteDonacion);
    
    // Si algún campo no es válido, no continuar
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Insertar registro en la base de datos
      const { error: insertError } = await supabase
        .from('SolicitudesDonacion')
        .insert({
          NombreSolicitanteDonacion: formData.NombreSolicitanteDonacion,
          Numero1SolicitanteDonacion: formData.Numero1SolicitanteDonacion,
          Numero2SolicitanteDonacion: formData.Numero2SolicitanteDonacion || null,
          DescripcionSolicitanteDonacion: formData.DescripcionSolicitanteDonacion,
          EstadoSolicitanteDonacion: formData.EstadoSolicitanteDonacion
        });

      if (insertError) {
        throw insertError;
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true);
    } catch (error) {
      setError(`Ocurrió un error: ${error.message}`);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      NombreSolicitanteDonacion: '',
      Numero1SolicitanteDonacion: '',
      Numero2SolicitanteDonacion: '',
      DescripcionSolicitanteDonacion: '',
      EstadoSolicitanteDonacion: 'Pendiente'
    });
    setFieldErrors({
      NombreSolicitanteDonacion: '',
      Numero1SolicitanteDonacion: '',
      Numero2SolicitanteDonacion: '',
      DescripcionSolicitanteDonacion: ''
    });
  };

  return (
    <div className="donar-container">
      {/* Modales */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setError('');
        }}
        title="Error"
        message={error}
        type="error"
      />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          resetForm();
        }}
        title="¡Solicitud enviada exitosamente!"
        message={`Gracias ${formData.NombreSolicitanteDonacion} por tu interés en donar al albergue. 

Tu solicitud ha sido recibida y está siendo procesada. Un administrador del albergue se pondrá en contacto contigo muy pronto a través de WhatsApp al número ${formData.Numero1SolicitanteDonacion} para coordinar los siguientes pasos.

¡Tu generosidad hace la diferencia en la vida de nuestros perritos! 🐕❤️`}
        type="success"
      />

      <div className="hero-section">
        <h1>Ayuda a Nuestros Perritos</h1>
        <p className="hero-subtitle">Tu donación hace la diferencia en la vida de los perritos que rescatamos</p>
      </div>

      <div className="donacion-content">
        {/* Tipos de Donación que necesitamos */}
        <div className="donaciones-necesarias">
          <h2>¿Qué donaciones necesitamos?</h2>
          
          <div className="categoria-donacion">
            <h3>💰 Donaciones Monetarias</h3>
            <div className="necesidades-grid">
              <div className="necesidad-item">
                <span className="icon">🏥</span>
                <span>Gastos veterinarios y medicinas</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">�️</span>
                <span>Alimento balanceado para perros</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🏠</span>
                <span>Mantenimiento del albergue</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🚗</span>
                <span>Transporte para rescates</span>
              </div>
            </div>
          </div>

          <div className="categoria-donacion">
            <h3>🥘 Alimentos</h3>
            <div className="necesidades-grid">
              <div className="necesidad-item">
                <span className="icon">🥣</span>
                <span>Alimento balanceado para adultos</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🍼</span>
                <span>Alimento para cachorros</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🥫</span>
                <span>Comida enlatada</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🦴</span>
                <span>Premios y snacks</span>
              </div>
            </div>
          </div>

          <div className="categoria-donacion">
            <h3>💊 Medicinas y Suplementos</h3>
            <div className="necesidades-grid">
              <div className="necesidad-item">
                <span className="icon">💊</span>
                <span>Antiparasitarios internos y externos</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">💉</span>
                <span>Vacunas</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">�</span>
                <span>Vitaminas y suplementos</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🩹</span>
                <span>Material de curación</span>
              </div>
            </div>
          </div>

          <div className="categoria-donacion">
            <h3>🛏️ Materiales y Accesorios</h3>
            <div className="necesidades-grid">
              <div className="necesidad-item">
                <span className="icon">🛏️</span>
                <span>Mantas y cobijas</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🧸</span>
                <span>Juguetes resistentes</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🦮</span>
                <span>Correas y collares</span>
              </div>
              <div className="necesidad-item">
                <span className="icon">🧽</span>
                <span>Artículos de limpieza</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Solicitud de Donación */}
        <div className="formulario-donacion">
          <h2>Formulario de Solicitud de Donación</h2>
          <p className="formulario-subtitle">Completa este formulario y nos pondremos en contacto contigo para coordinar tu donación</p>
          
          <form onSubmit={handleSubmit} className="formulario-donacion-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo <span className="required">*</span></label>
              <input
                type="text"
                id="nombre"
                name="NombreSolicitanteDonacion"
                value={formData.NombreSolicitanteDonacion}
                onChange={handleChange}
                className={fieldErrors.NombreSolicitanteDonacion ? 'input-error' : ''}
              />
              {fieldErrors.NombreSolicitanteDonacion && (
                <div className="field-error">{fieldErrors.NombreSolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefono1">Teléfono 1 <span className="required">*</span></label>
              <input
                type="tel"
                id="telefono1"
                name="Numero1SolicitanteDonacion"
                value={formData.Numero1SolicitanteDonacion}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                  if (value.length <= 9) { // Limit to 9 digits
                    setFormData(prev => ({ ...prev, Numero1SolicitanteDonacion: value }));
                  }
                }}
                className={fieldErrors.Numero1SolicitanteDonacion ? 'input-error' : ''}
              />
              {fieldErrors.Numero1SolicitanteDonacion && (
                <div className="field-error">{fieldErrors.Numero1SolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefono2">Teléfono 2 (opcional)</label>
              <input
                type="tel"
                id="telefono2"
                name="Numero2SolicitanteDonacion"
                value={formData.Numero2SolicitanteDonacion}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                  if (value.length <= 9) { // Limit to 9 digits
                    setFormData(prev => ({ ...prev, Numero2SolicitanteDonacion: value }));
                  }
                }}
                className={fieldErrors.Numero2SolicitanteDonacion ? 'input-error' : ''}
              />
              {fieldErrors.Numero2SolicitanteDonacion && (
                <div className="field-error">{fieldErrors.Numero2SolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción de tu Donación <span className="required">*</span></label>
              <textarea
                id="descripcion"
                name="DescripcionSolicitanteDonacion"
                value={formData.DescripcionSolicitanteDonacion}
                onChange={handleChange}
                className={fieldErrors.DescripcionSolicitanteDonacion ? 'input-error' : ''}
                placeholder="Describe qué te gustaría donar (dinero, alimentos, medicinas, materiales, etc.) y cualquier detalle adicional..."
                rows="4"
              />
              {fieldErrors.DescripcionSolicitanteDonacion && (
                <div className="field-error">{fieldErrors.DescripcionSolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-donar" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Donación'}
              </button>
            </div>
          </form>
          
          <div className="data-protection-notice">
            <p>Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos Personales.</p>
          </div>
        </div>

        {/* Sección de impacto */}
        <div className="impacto-section">
          <h2>El impacto de tu donación</h2>
          <div className="impacto-grid">
            <div className="impacto-item">
              <div className="impacto-numero">🍽️</div>
              <h4>S/ 25</h4>
              <p>Alimenta a un perrito por una semana</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">💉</div>
              <h4>S/ 50</h4>
              <p>Cubre las vacunas básicas de un cachorro</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">🏥</div>
              <h4>S/ 100</h4>
              <p>Paga una consulta veterinaria de emergencia</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">❤️</div>
              <h4>S/ 200</h4>
              <p>Cubre los gastos de rescate y rehabilitación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donar;
