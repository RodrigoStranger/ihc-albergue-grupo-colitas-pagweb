import React, { useState, useEffect } from 'react';
import '../styles/ModalAdminLogin.css';

function ModalAdminLogin({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = React.useRef();

  // Cerrar el modal al hacer clic fuera del contenido
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Agregar el event listener cuando el componente se monta
    document.addEventListener('mousedown', handleClickOutside);
    
    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión con:', { email, password });
    onClose();
  };

  return (
    <div className="modal-admin modal-overlay">
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
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input 
              type="text" 
              id="dni" 
              name="dni" 
              placeholder="Tu DNI" 
              value={email}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) return;
                setEmail(value);
              }}
              required 
              maxLength={8}
              pattern="[0-9]{8}"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Tu contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="submit-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalAdminLogin;
