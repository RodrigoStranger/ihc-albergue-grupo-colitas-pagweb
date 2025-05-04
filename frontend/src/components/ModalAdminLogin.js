import React, { useState } from 'react';

function ModalAdminLogin({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión con:', { email, password });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Iniciar Sesión</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
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
