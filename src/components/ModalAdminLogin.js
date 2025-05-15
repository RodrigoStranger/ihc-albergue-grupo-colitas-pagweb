import React, { useState, useRef, useEffect } from 'react';
import '../styles/ModalAdminLogin.css';

function ModalAdminLogin({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    dni: '',
    password: ''
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dni' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.dni || !formData.password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    if (formData.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }
    
    // Si pasa las validaciones, enviamos los datos
    setError('');
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="modal-formulario">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>Iniciar Sesión</h2>
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
              id="dni" 
              name="dni" 
              placeholder="Ingrese su DNI" 
              value={formData.dni}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={8}
              pattern="[0-9]{8}"
              title="El DNI debe tener exactamente 8 dígitos"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" required>Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Ingrese su contraseña" 
              value={formData.password}
              onChange={handleChange}
              required
              title="Este campo es obligatorio"
            />
          </div>
          
          <button type="submit" className="submit-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalAdminLogin;
