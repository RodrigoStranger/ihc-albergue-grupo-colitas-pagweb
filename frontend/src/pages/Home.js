import React, { useState } from 'react';
import '../styles/Home.css';

function Home() {
  // Get saved form data from sessionStorage or initialize with empty values
  const savedData = JSON.parse(sessionStorage.getItem('formData')) || {
    name: '',
    message: ''
  };

  const [formData, setFormData] = useState(savedData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      // Only allow letters (both uppercase and lowercase)
      const lettersOnly = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: lettersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Save form data to sessionStorage
    sessionStorage.setItem('formData', JSON.stringify({
      name: formData.name,
      message: formData.message
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(`Hola, vengo desde la página del grupo Colitas Arequipa. Mi nombre es ${formData.name} y quiero saber acerca de ${formData.message}`);
    const whatsappUrl = `https://wa.me/+51921136113?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    // Clear form data from state and sessionStorage
    setFormData({ name: '', message: '' });
    sessionStorage.removeItem('formData');
  };

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
        <h2>Contáctate con nosotros</h2>
        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Ingresa tu nombre y apellidos completos" 
              required 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <textarea 
              placeholder="¿En qué podemos ayudarte?" 
              required
              name="message"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            <button type="submit" className="submit-button">Enviar Mensaje</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home; 