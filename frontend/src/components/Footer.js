import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Grupo Colitas</h3>
          <p>Dando amor y esperanza a los animales necesitados desde 2024</p>
        </div>
        <div className="footer-section social-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=100088175020547&rdid=vqISWL2JHRi89qNO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AKkzZcoLX%2F" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.tiktok.com/@grupocolitasarequipa?_t=ZM-8vaS8VtvcAv&_r=1" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Grupo Colitas. Todos los derechos reservados.
          <br />
          Desarrollado por estudiantes de <a href="https://www.lasalle.edu.pe/arequipa" target="_blank" rel="noopener noreferrer">Universidad La Salle de Arequipa</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;