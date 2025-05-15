import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
  // Cambiar el favicon cuando se monte el componente
  useEffect(() => {
    // Guardar el favicon original
    const originalFavicon = document.querySelector('link[rel="icon"]')?.href || '';
    
    // Cambiar al favicon de error
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = '/error.png';
    document.head.appendChild(link);
    
    // Restaurar el favicon original cuando el componente se desmonte
    return () => {
      if (originalFavicon) {
        link.href = originalFavicon;
      }
    };
  }, []);
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <Link to="/home" className="home-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
