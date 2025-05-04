import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
        <div className="mobile-nav">
          <button 
            className="dropdown-button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
            <span>Más Opciones</span>
            <i className={`fas fa-chevron-down ${isMobileMenuOpen ? 'rotate' : ''}`} style={{ marginLeft: '8px' }}></i>
          </button>
          <div className={`dropdown-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <Link to="/adoptar" onClick={() => setIsMobileMenuOpen(false)}>
                  Adoptar
                </Link>
              </li>
              <li>
                <Link to="/donar" onClick={() => setIsMobileMenuOpen(false)}>
                  Donar
                </Link>
              </li>
              <li>
                <Link to="/voluntariado" onClick={() => setIsMobileMenuOpen(false)}>
                  Voluntariado
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 