import React, { useEffect, useState } from 'react';
import '../styles/Adoptar.css';
import { obtenerPerros } from '../supabase/perros';
import PerroCard from '../components/PerroCard';
import PerroModal from '../components/PerroModal';

function Adoptar() {
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerro, setSelectedPerro] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cargarPerros = async () => {
      try {
        const data = await obtenerPerros();
        setPerros(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPerros();
  }, []);

  const handleCardClick = (perro) => {
    // Si es móvil, navegar directo a la página de adopción
    if (window.innerWidth <= 700) {
      window.location.href = `/adoptar/${perro.IdPerro}`;
    } else {
      setSelectedPerro(perro);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerro(null);
  };

  if (loading) return (
    <div className="adoptar-container">
      <h1>Adopciones</h1>
      <div className="perros-grid">
        <div className="loading-message">
          <p>Cargando perros...</p>
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="adoptar-container">
      <h1>Adopciones</h1>
      <div className="error-message">
        <p>Ha ocurrido un error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    </div>
  );

  if (perros.length === 0) return (
    <div className="adoptar-container">
      <h1>Adopciones</h1>
      <div className="no-data-message">
        <p>No hay perros disponibles en este momento.</p>
      </div>
    </div>
  );

  return (
    <div className="adoptar-container">
      <h1>Adopciones</h1>
      <div className="perros-grid">
        {perros.map((perro) => (
          <PerroCard 
            key={perro.IdPerro} 
            perro={perro} 
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      
      {isModalOpen && selectedPerro && (
        <PerroModal 
          perro={selectedPerro} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Adoptar;
