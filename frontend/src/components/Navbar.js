import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          Grupo Colitas
        </Link>
        <div className="nav-links">
          <Link to="/adoptar" className={location.pathname === '/adoptar' ? 'active' : ''}>
            Adoptar
          </Link>
          <Link to="/donar" className={location.pathname === '/donar' ? 'active' : ''}>
            Donar
          </Link>
          <Link to="/voluntariado" className={location.pathname === '/voluntariado' ? 'active' : ''}>
            Voluntariado
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 