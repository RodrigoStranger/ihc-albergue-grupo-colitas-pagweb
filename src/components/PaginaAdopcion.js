import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabase/client';
import { client } from '../supabase/client';
import '../styles/PaginaAdopcion.css';
import '../styles/Modal.css';
import Modal from './Modal';

function PaginaAdopcion() {
  const { id } = useParams();
  const [perro, setPerro] = useState(null);
  const [formData, setFormData] = useState({
    NombreSolicitanteAdopcion: '',
    Numero1SolicitanteAdopcion: '',
    Numero2SolicitanteAdopcion: '',
    DescripcionSolicitanteAdopcion: '',
    EstadoSolicitanteAdopcion: 'En Proceso'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    const fetchPerro = async () => {
      try {
        const { data, error } = await supabase
          .from('Perros')
          .select('*')
          .eq('IdPerro', id)
          .single();

        if (error) throw error;
        setPerro(data);
      } catch (error) {
        console.error('Error fetching perro:', error);
        setError('Error al cargar los datos del perro');
      } finally {
        setLoading(false);
      }
    };

    fetchPerro();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    // Verificar que todos los campos obligatorios estén llenos y validos
    const nombreValido = formData.NombreSolicitanteAdopcion.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.NombreSolicitanteAdopcion);
    const telefono1Valido = formData.Numero1SolicitanteAdopcion && formData.Numero1SolicitanteAdopcion.length === 9;
    const descripcionValida = formData.DescripcionSolicitanteAdopcion.trim();
    
    return nombreValido && telefono1Valido && descripcionValida;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Si el formulario no es válido, mostrar el primer error
    if (!isFormValid()) {
      if (!formData.NombreSolicitanteAdopcion.trim()) {
        setError('El nombre es obligatorio');
        document.querySelector('input[name="NombreSolicitanteAdopcion"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.NombreSolicitanteAdopcion)) {
        setError('El nombre solo puede contener letras y espacios');
        document.querySelector('input[name="NombreSolicitanteAdopcion"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!formData.Numero1SolicitanteAdopcion || formData.Numero1SolicitanteAdopcion.length !== 9) {
        setError('El primer número de teléfono debe tener exactamente 9 dígitos');
        document.querySelector('input[name="Numero1SolicitanteAdopcion"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!formData.DescripcionSolicitanteAdopcion.trim()) {
        setError('La descripción es obligatoria');
        document.querySelector('textarea[name="DescripcionSolicitanteAdopcion"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Validaciones adicionales para el segundo teléfono si está presente
    if (formData.Numero2SolicitanteAdopcion && !/^[0-9]{9}$/.test(formData.Numero2SolicitanteAdopcion)) {
      setError('El segundo número de teléfono debe tener exactamente 9 dígitos');
      document.querySelector('input[name="Numero2SolicitanteAdopcion"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      // Insertar registro en la base de datos
      const { error: insertError } = await supabase
        .from('SolicitudesAdopcion')
        .insert({
          IdSolicitanteAdopcion: parseInt(id),
          NombreSolicitanteAdopcion: formData.NombreSolicitanteAdopcion,
          Numero1SolicitanteAdopcion: formData.Numero1SolicitanteAdopcion,
          Numero2SolicitanteAdopcion: formData.Numero2SolicitanteAdopcion,
          DescripcionSolicitanteAdopcion: formData.DescripcionSolicitanteAdopcion,
          EstadoSolicitanteAdopcion: formData.EstadoSolicitanteAdopcion
        });

      if (insertError) {
        throw insertError;
      }

      // Redirigir a una página de éxito o mostrar mensaje
      alert('Solicitud de adopción enviada exitosamente');
      window.history.back();
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      setError(`Ocurrió un error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!perro) {
    return <div className="error">Perro no encontrado</div>;
  }

  return (
    <div className="pagina-adopcion">
      {/* Modales */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setError('');
        }}
        title="Error"
        message={error}
        type="error"
      />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          window.history.back();
        }}
        title="¡Solicitud enviada exitosamente!"
        message="Gracias por tu interés en adoptar. Nos pondremos en contacto contigo pronto."
        type="success"
      />

      <div className="formulario-container">
        <h2>Formulario de Adopción</h2>
        
        <form onSubmit={handleSubmit} className="formulario-adopcion">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="NombreSolicitanteAdopcion"
              value={formData.NombreSolicitanteAdopcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono1">Teléfono 1 *</label>
            <input
              type="tel"
              id="telefono1"
              name="Numero1SolicitanteAdopcion"
              value={formData.Numero1SolicitanteAdopcion}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                if (value.length <= 9) { // Limit to 9 digits
                  setFormData(prev => ({ ...prev, Numero1SolicitanteAdopcion: value }));
                }
              }}
              required
              maxLength="9"
              pattern="[0-9]{9}"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono2">Teléfono 2 (opcional)</label>
            <input
              type="tel"
              id="telefono2"
              name="Numero2SolicitanteAdopcion"
              value={formData.Numero2SolicitanteAdopcion}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                if (value.length <= 9) { // Limit to 9 digits
                  setFormData(prev => ({ ...prev, Numero2SolicitanteAdopcion: value }));
                }
              }}
              maxLength="9"
              pattern="[0-9]{9}"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="DescripcionSolicitanteAdopcion"
              value={formData.DescripcionSolicitanteAdopcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
              Volver
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!isFormValid()}
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>

      <div className="perro-info-container">
        <div className="perro-info-header">
          <h2>{perro.NombrePerro}</h2>
          <span className={`sexo-badge ${perro.SexoPerro === "Hembra" ? "hembra" : "macho"}`}>
            {perro.SexoPerro}
          </span>
        </div>

        <div className="perro-info-grid">
          <div className="perro-image">
            <img 
              src={perro.FotoPerro ? 
                client.storage
                  .from('perros')
                  .getPublicUrl(perro.FotoPerro).data.publicUrl 
                : "/placeholder.svg"} 
              alt={perro.NombrePerro}
              className="perro-photo"
            />
          </div>

          <div className="perro-details">
            <div className="info-item">
              <span className="info-label">Edad</span>
              <span className="info-value">{perro.EdadPerro} años</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Tamaño</span>
              <span className="info-value">{perro.EstaturaPerro}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Pelaje</span>
              <span className="info-value">{perro.PelajePerro}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Actividad</span>
              <span className="info-value">{perro.ActividadPerro}</span>
            </div>
            
            {perro.RazaPerro && (
              <div className="info-item">
                <span className="info-label">Raza</span>
                <span className="info-value">{perro.RazaPerro}</span>
              </div>
            )}
          </div>
        </div>

        <div className="perro-description">
          <h3>Descripción</h3>
          <p>{perro.DescripcionPerro}</p>
        </div>
      </div>
    </div>
  );
}

export default PaginaAdopcion;
