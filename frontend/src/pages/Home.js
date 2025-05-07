import React, { useState, useRef } from 'react';
import '../styles/Home.css';
import ModalFormulario from '../components/ModalFormulario';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef([]);
  const sliderRef = useRef(null);
  const totalVideos = 3;
  const isTransitioning = useRef(false);

  const pauseAllVideos = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        const iframe = video.contentWindow || video.contentDocument.document || video.contentDocument;
        iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  };

  const nextVideo = () => {
    if (isTransitioning.current) return;
    pauseAllVideos();
    isTransitioning.current = true;
    
    setCurrentVideo(prev => (prev + 1) % totalVideos);
    
    setTimeout(() => {
      isTransitioning.current = false;
    }, 500);
  };

  const prevVideo = () => {
    if (isTransitioning.current) return;
    pauseAllVideos();
    isTransitioning.current = true;
    
    setCurrentVideo(prev => (prev - 1 + totalVideos) % totalVideos);
    
    setTimeout(() => {
      isTransitioning.current = false;
    }, 500);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'name') {
      // Solo permite letras (mayúsculas y minúsculas) y espacios
      newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
    
    // Actualizar el estado
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(`Hola, vengo desde la página del grupo Colitas Arequipa. Mi nombre es ${formData.name} y quiero saber acerca de ${formData.message}`);
    const whatsappUrl = `https://wa.me/+51921136113?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    // Limpiar el formulario
    setFormData({ name: '', message: '' });
  };

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1>Grupo Colitas</h1>
          <p>Dando amor y esperanza a los animales necesitados</p>
        </div>
      </header>

      <section className="about-section">
        <div className="about-grid">
          <div className="about-video">
            <div className="video-container">
              <video 
                src="/videos/video_motivacion.mp4" 
                controls 
                loop
                className="video-player"
                ref={videoRef}
                playsInline
                webkit-playsinline="true"
                preload="metadata"
                poster="/images/video-preview.jpg"
                style={{
                  width: '100%',
                  display: 'block',
                  backgroundColor: '#000'
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="play-button" onClick={handlePlayPause}>
                <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
              </div>
            </div>
          </div>
          <div className="about-content">
            <h2>Nuestra Misión</h2>
            <p>
              En Grupo Colitas, nos dedicamos a rescatar, rehabilitar y encontrar hogares
              amorosos para animales abandonados. Creemos que cada animal merece una
              segunda oportunidad y un hogar donde ser amado.
            </p>
            <br />
            <h2>Asociación civil sin fines de lucro</h2>
            <p>
            Nuestra misión es rescatar animales de la calle en pésimas condiciones, curarlos, esterilizarlos y darlos en adopción. Tenemos un albergue con capacidad para albergar un maximo de 25 perritos de manera adecuada según sus necesidades, sin tenerlos hacinados.
            </p>
            <br />
            <h2>No somos un Albergue eutanásico</h2>
            <p>
            Los animales no tienen un limite de tiempo para permanecer en el albergue, si no llegan adoptantes para algunos casos, ellos se quedan con nosotros hasta el fin de sus días. Tenemos perritos de todas las edades desde cachorritos hasta viejitos, todos reciben trato personalizado según lo que necesiten.
            </p>
            <br />
          </div>
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
        <h2>Esterilizaciones</h2>
        <p className="sterilization-intro">La educación sobre la importancia de la esterilización es fundamental para prevenir la sobrepoblación de animales y reducir el sufrimiento de aquellos que se encuentran en las calles</p>
        <div className="two-column-layout">
          <div className="petition-column">
            <div className="petition-banner">
              <h3>¡Necesitamos tu ayuda!</h3>
              <p>Estamos recogiendo firmas para presentar ante las autoridades del Gobierno Regional de Arequipa, solicitando mayor apoyo y recursos para los programas de esterilización en nuestra región.</p>
              <p>Tu firma puede hacer la diferencia en la lucha contra el abandono y la sobrepoblación animal.</p>
              <button 
                className="cta-button"
                onClick={() => setShowModal(true)}
              >
                Firmar la petición
              </button>
            </div>
          </div>
          
          <div className="video-column">
            <div 
              className="video-carousel"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button 
                className={`carousel-button prev ${isHovered ? 'visible' : ''}`} 
                onClick={prevVideo}
              >
                &lt;
              </button>
              <div className="video-container">
                <div 
                  className="video-slider" 
                  style={{ 
                    transform: `translateX(-${currentVideo * 100}%)`,
                    transition: 'transform 0.5s ease-in-out'
                  }}
                  ref={sliderRef}
                >

                  <div className="video-slide">
                    <iframe 
                      ref={el => videoRefs.current[0] = el}
                      src="https://www.youtube.com/embed/GOBRso0M-6Q?enablejsapi=1" 
                      title="Esterilización Responsable" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  </div>
                  <div className="video-slide">
                    <iframe 
                      ref={el => videoRefs.current[1] = el}
                      src="https://www.youtube.com/embed/6gU_yF_rHrY?enablejsapi=1" 
                      title="Beneficios de la Esterilización" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  </div>
                  <div className="video-slide">
                    <iframe 
                      ref={el => videoRefs.current[2] = el}
                      src="https://www.youtube.com/embed/VzgGayMri4E?enablejsapi=1"
                      title="Proceso de Esterilización" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  </div>
                </div>
              </div>
              <button 
                className={`carousel-button next ${isHovered ? 'visible' : ''}`} 
                onClick={nextVideo}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contáctate con nosotros</h2>
        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Ingresa tu nombre y apellidos" 
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
      
      {showModal && (
        <ModalFormulario 
          show={showModal} 
          onClose={() => setShowModal(false)}
          onSubmit={(formData) => {
            console.log('Datos del formulario:', formData);
            // Aquí puedes agregar la lógica para enviar los datos
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;