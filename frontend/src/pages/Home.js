import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1>Grupo Colitas</h1>
          <p>Dando amor y esperanza a los animales necesitados</p>
          <button className="cta-button">Adoptar Ahora</button>
        </div>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2>Nuestra Misión</h2>
          <p>
            En Grupo Colitas, nos dedicamos a rescatar, rehabilitar y encontrar hogares
            amorosos para animales abandonados. Creemos que cada animal merece una
            segunda oportunidad y un hogar donde ser amado.
          </p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <i className="fas fa-heart"></i>
          <h3>Rescate</h3>
          <p>Rescatamos animales en situación de abandono y maltrato</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-home"></i>
          <h3>Adopción</h3>
          <p>Encontramos hogares amorosos para nuestros rescatados</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-hand-holding-heart"></i>
          <h3>Voluntariado</h3>
          <p>Únete a nuestra causa y ayuda a más animales</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Quieres Ayudar?</h2>
        <p>Hay muchas formas de apoyar nuestra causa</p>
        <div className="cta-buttons">
          <button className="cta-button">Donar</button>
          <button className="cta-button secondary">Ser Voluntario</button>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contacto</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Ubicación</h3>
                <p>Av. Principal 123, Ciudad</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Teléfono</h3>
                <p>+123 456 7890</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>info@grupocolitas.com</p>
              </div>
            </div>
          </div>
          <form className="contact-form">
            <input type="text" placeholder="Nombre" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Mensaje" required></textarea>
            <button type="submit" className="submit-button">Enviar Mensaje</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home; 