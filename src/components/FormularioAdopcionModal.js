import React, { useState } from 'react';
import client from '../supabase/client';

function FormularioAdopcionModal({ perro, onClose }) {
  const [formData, setFormData] = useState({
    NombreSolicitanteAdopcion: '',
    Numero1SolicitanteAdopcion: '',
    Numero2SolicitanteAdopcion: '',
    DescripcionSolicitanteAdopcion: '',
    EstadoSolicitanteAdopcion: 'Pendiente',
  });
  const [fieldErrors, setFieldErrors] = useState({
    NombreSolicitanteAdopcion: '',
    Numero1SolicitanteAdopcion: '',
    Numero2SolicitanteAdopcion: '',
    DescripcionSolicitanteAdopcion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch (fieldName) {
      case 'NombreSolicitanteAdopcion':
        if (!value.trim()) errorMessage = 'El nombre es obligatorio';
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) errorMessage = 'El nombre solo puede contener letras y espacios';
        break;
      case 'Numero1SolicitanteAdopcion':
        if (!value || value.trim() === '') errorMessage = 'El número de teléfono es obligatorio';
        else if (value.length !== 9) errorMessage = 'El número de teléfono debe tener exactamente 9 dígitos';
        break;
      case 'Numero2SolicitanteAdopcion':
        if (value && value.trim() !== '' && value.length !== 9) errorMessage = 'El segundo número de teléfono debe tener exactamente 9 dígitos';
        break;
      case 'DescripcionSolicitanteAdopcion':
        if (!value.trim()) errorMessage = 'La descripción es obligatoria';
        break;
      default:
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return errorMessage === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'NombreSolicitanteAdopcion') {
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({
      NombreSolicitanteAdopcion: '',
      Numero1SolicitanteAdopcion: '',
      Numero2SolicitanteAdopcion: '',
      DescripcionSolicitanteAdopcion: '',
    });
    const isTelefonoValid = validateField('Numero1SolicitanteAdopcion', formData.Numero1SolicitanteAdopcion);
    const isTelefono2Valid = validateField('Numero2SolicitanteAdopcion', formData.Numero2SolicitanteAdopcion);
    const isDescripcionValid = validateField('DescripcionSolicitanteAdopcion', formData.DescripcionSolicitanteAdopcion);
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) return;
    try {
      setIsSubmitting(true);
      // Aquí deberías hacer la petición a Supabase igual que en PaginaAdopcion.js
      setSuccess(true);
    } catch (err) {
      setError('Ocurrió un error al enviar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="modal-formulario-adopcion">
        <h2>¡Solicitud enviada!</h2>
        <p>Tu solicitud de adopción ha sido registrada. Pronto nos pondremos en contacto contigo.</p>
        <button className="btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  return (
    <div className="modal-formulario-adopcion">
      <h2>Formulario de Adopción</h2>
      <form onSubmit={handleSubmit} className="formulario-adopcion">
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo <span className="required">*</span></label>
          <input type="text" id="nombre" name="NombreSolicitanteAdopcion" value={formData.NombreSolicitanteAdopcion} onChange={handleChange} className={fieldErrors.NombreSolicitanteAdopcion ? 'input-error' : ''} />
          {fieldErrors.NombreSolicitanteAdopcion && <div className="field-error">{fieldErrors.NombreSolicitanteAdopcion}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="telefono1">Teléfono 1 <span className="required">*</span></label>
          <input type="tel" id="telefono1" name="Numero1SolicitanteAdopcion" value={formData.Numero1SolicitanteAdopcion} onChange={handleChange} className={fieldErrors.Numero1SolicitanteAdopcion ? 'input-error' : ''} maxLength={9} />
          {fieldErrors.Numero1SolicitanteAdopcion && <div className="field-error">{fieldErrors.Numero1SolicitanteAdopcion}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="telefono2">Teléfono 2 (opcional)</label>
          <input type="tel" id="telefono2" name="Numero2SolicitanteAdopcion" value={formData.Numero2SolicitanteAdopcion} onChange={handleChange} className={fieldErrors.Numero2SolicitanteAdopcion ? 'input-error' : ''} maxLength={9} />
          {fieldErrors.Numero2SolicitanteAdopcion && <div className="field-error">{fieldErrors.Numero2SolicitanteAdopcion}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción <span className="required">*</span></label>
          <textarea id="descripcion" name="DescripcionSolicitanteAdopcion" value={formData.DescripcionSolicitanteAdopcion} onChange={handleChange} className={fieldErrors.DescripcionSolicitanteAdopcion ? 'input-error' : ''} placeholder="Describe por qué quieres adoptar a este perrito y cómo cuidarías de él..." />
          {fieldErrors.DescripcionSolicitanteAdopcion && <div className="field-error">{fieldErrors.DescripcionSolicitanteAdopcion}</div>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</button>
        </div>
      </form>
      {error && <div className="field-error">{error}</div>}
      <div className="data-protection-notice">
        <p>Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos Personales.</p>
      </div>
    </div>
  );
}

export default FormularioAdopcionModal;
