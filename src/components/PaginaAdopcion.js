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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para errores específicos de cada campo
  const [fieldErrors, setFieldErrors] = useState({
    NombreSolicitanteAdopcion: '',
    Numero1SolicitanteAdopcion: '',
    Numero2SolicitanteAdopcion: '',
    DescripcionSolicitanteAdopcion: ''
  });

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
        
        // Procesar la imagen del perro igual que en perros.js
        let perroConImagen = { ...data };
        if (data.FotoPerro) {
          let nombreArchivo = data.FotoPerro;
          
          // Si la URL contiene el path completo de Supabase, extraer solo el nombre del archivo
          if (data.FotoPerro.includes('supabase.co/storage/v1/object/sign/perros/')) {
            const urlParts = data.FotoPerro.split('/');
            const fileNameWithToken = urlParts[urlParts.length - 1];
            // Remover el token (todo lo que viene después del ?)
            nombreArchivo = fileNameWithToken.split('?')[0];
          }
          
          // Obtener la URL pública del archivo específico
          const { data: { publicUrl } } = client.storage
            .from('perros')
            .getPublicUrl(nombreArchivo);
          
          perroConImagen.FotoPerro = publicUrl;
        }
        
        setPerro(perroConImagen);
      } catch (error) {
        setError('Error al cargar los datos del perro');
      } finally {
        setLoading(false);
      }
    };

    fetchPerro();
  }, [id]);

  // Función para validar un campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'NombreSolicitanteAdopcion':
        if (!value.trim()) {
          errorMessage = 'El nombre es obligatorio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = 'El nombre solo puede contener letras y espacios';
        }
        break;
      case 'Numero1SolicitanteAdopcion':
        if (!value || value.trim() === '') {
          errorMessage = 'El número de teléfono es obligatorio';
        } else if (value.length !== 9) {
          errorMessage = 'El número de teléfono debe tener exactamente 9 dígitos';
        }
        break;
      case 'Numero2SolicitanteAdopcion':
        if (value && value.trim() !== '' && value.length !== 9) {
          errorMessage = 'El segundo número de teléfono debe tener exactamente 9 dígitos';
        }
        break;
      case 'DescripcionSolicitanteAdopcion':
        if (!value.trim()) {
          errorMessage = 'La descripción es obligatoria';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones especiales para el nombre (solo letras)
    if (name === 'NombreSolicitanteAdopcion') {
      // Filtrar solo letras y espacios
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isFormValid = () => {
    // Permitir que el formulario se envíe siempre para mostrar validaciones
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Limpiar errores previos
    setFieldErrors({
      NombreSolicitanteAdopcion: '',
      Numero1SolicitanteAdopcion: '',
      Numero2SolicitanteAdopcion: '',
      DescripcionSolicitanteAdopcion: ''
    });
    
    // Validar todos los campos obligatorios
    const isNombreValid = validateField('NombreSolicitanteAdopcion', formData.NombreSolicitanteAdopcion);
    const isTelefonoValid = validateField('Numero1SolicitanteAdopcion', formData.Numero1SolicitanteAdopcion);
    const isTelefono2Valid = validateField('Numero2SolicitanteAdopcion', formData.Numero2SolicitanteAdopcion);
    const isDescripcionValid = validateField('DescripcionSolicitanteAdopcion', formData.DescripcionSolicitanteAdopcion);
    
    // Si algún campo no es válido, no continuar
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Verificar si el número ya tiene solicitudes
      const { data: solicitudesExistentes, error: consultaError } = await supabase
        .from('SolicitudesAdopcion')
        .select('IdPerro, EstadoSolicitanteAdopcion')
        .eq('Numero1SolicitanteAdopcion', formData.Numero1SolicitanteAdopcion);

      if (consultaError) {
        throw consultaError;
      }

      // Verificar si ya tiene una solicitud para este perro específico (sin importar el estado)
      const solicitudMismoPerro = solicitudesExistentes.find(s => s.IdPerro === parseInt(id));
      if (solicitudMismoPerro) {
        setError('Ya has enviado una solicitud para este perro anteriormente. No puedes enviar múltiples solicitudes para el mismo perro. Debes esperar a que un administrador procese tu solicitud anterior (Aprobada o Rechazada) antes de poder realizar cualquier acción adicional.');
        setIsSubmitting(false);
        return;
      }

      // Verificar si tiene alguna solicitud "En Proceso" para cualquier perro
      const solicitudEnProceso = solicitudesExistentes.find(s => s.EstadoSolicitanteAdopcion === 'En Proceso');
      if (solicitudEnProceso) {
        setError('Ya tienes una solicitud en proceso para otro perro. Solo puedes tener una solicitud activa a la vez. Espera a que sea procesada antes de enviar otra.');
        setIsSubmitting(false);
        return;
      }

      // Insertar registro en la base de datos
      const { error: insertError } = await supabase
        .from('SolicitudesAdopcion')
        .insert({
          IdPerro: parseInt(id),
          NombreSolicitanteAdopcion: formData.NombreSolicitanteAdopcion,
          Numero1SolicitanteAdopcion: formData.Numero1SolicitanteAdopcion,
          Numero2SolicitanteAdopcion: formData.Numero2SolicitanteAdopcion || null,
          DescripcionSolicitanteAdopcion: formData.DescripcionSolicitanteAdopcion,
          EstadoSolicitanteAdopcion: formData.EstadoSolicitanteAdopcion
        });

      if (insertError) {
        throw insertError;
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true);
    } catch (error) {
      setError(`Ocurrió un error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
        message={`Gracias por tu interés en adoptar a ${perro?.NombrePerro || 'nuestro perrito'}. 

Tu solicitud ha sido recibida y está siendo procesada. Un administrador del albergue se pondrá en contacto contigo muy pronto a través de WhatsApp al número ${formData.Numero1SolicitanteAdopcion} para coordinar los siguientes pasos del proceso de adopción.

¡Esperamos que pronto tengas un nuevo compañero peludo en casa! 🐕❤️`}
        type="success"
      />

      <div className="formulario-container">
        <h2>Formulario de Adopción</h2>
        
        <form onSubmit={handleSubmit} className="formulario-adopcion">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo <span className="required">*</span></label>
            <input
              type="text"
              id="nombre"
              name="NombreSolicitanteAdopcion"
              value={formData.NombreSolicitanteAdopcion}
              onChange={handleChange}
              className={fieldErrors.NombreSolicitanteAdopcion ? 'input-error' : ''}
            />
            {fieldErrors.NombreSolicitanteAdopcion && (
              <div className="field-error">{fieldErrors.NombreSolicitanteAdopcion}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono1">Teléfono 1 <span className="required">*</span></label>
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
              className={fieldErrors.Numero1SolicitanteAdopcion ? 'input-error' : ''}
            />
            {fieldErrors.Numero1SolicitanteAdopcion && (
              <div className="field-error">{fieldErrors.Numero1SolicitanteAdopcion}</div>
            )}
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
              className={fieldErrors.Numero2SolicitanteAdopcion ? 'input-error' : ''}
            />
            {fieldErrors.Numero2SolicitanteAdopcion && (
              <div className="field-error">{fieldErrors.Numero2SolicitanteAdopcion}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción <span className="required">*</span></label>
            <textarea
              id="descripcion"
              name="DescripcionSolicitanteAdopcion"
              value={formData.DescripcionSolicitanteAdopcion}
              onChange={handleChange}
              className={fieldErrors.DescripcionSolicitanteAdopcion ? 'input-error' : ''}
              placeholder="Describe por qué quieres adoptar a este perrito y cómo cuidarías de él..."
            />
            {fieldErrors.DescripcionSolicitanteAdopcion && (
              <div className="field-error">{fieldErrors.DescripcionSolicitanteAdopcion}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
              Volver
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
        
        <div className="data-protection-notice">
          <p>Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos Personales.</p>
        </div>
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
              src={perro.FotoPerro || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gbm8gZGlzcG9uaWJsZTwvdGV4dD4KICA8L3N2Zz4="} 
              alt={perro.NombrePerro}
              className="perro-photo"
              onError={(e) => {
                // Imagen SVG base64 como fallback
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlZWVlIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2NjMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGFsIGNhcmdhciBpbWFnZW48L3RleHQ+Cjwvc3ZnPg==";
              }}
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
