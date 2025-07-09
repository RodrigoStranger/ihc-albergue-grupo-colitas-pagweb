"use client"

import { useState } from "react"
import supabase from "../supabase/client"
import "../styles/Voluntariado.css"
import "../styles/Modal.css"
import Modal from "../components/Modal"
import VoluntariadoConfirmationModal from "../components/VoluntariadoConfirmationModal"

function Voluntariado() {
  const [formData, setFormData] = useState({
    NombreVoluntario: "",
    Numero1Voluntario: "",
    Numero2Voluntario: "",
    DescripcionVoluntario: "",
    EstadoVoluntario: "Pendiente",
  })
  const [error, setError] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para errores específicos de cada campo
  const [fieldErrors, setFieldErrors] = useState({
    NombreVoluntario: "",
    Numero1Voluntario: "",
    Numero2Voluntario: "",
    DescripcionVoluntario: "",
  })

  // Función para validar un campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = ""

    switch (fieldName) {
      case "NombreVoluntario":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo puede contener letras y espacios"
        }
        break
      case "Numero1Voluntario":
        if (!value || value.trim() === "") {
          errorMessage = "El número de teléfono es obligatorio"
        } else if (value.length !== 9) {
          errorMessage = "El número de teléfono debe tener exactamente 9 dígitos"
        }
        break
      case "Numero2Voluntario":
        if (value && value.trim() !== "" && value.length !== 9) {
          errorMessage = "El segundo número de teléfono debe tener exactamente 9 dígitos"
        }
        break
      case "DescripcionVoluntario":
        if (!value.trim()) {
          errorMessage = "La descripción es obligatoria"
        }
        break
      default:
        break
    }

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }))

    return errorMessage === ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validaciones especiales para el nombre (solo letras)
    if (name === "NombreVoluntario") {
      // Filtrar solo letras y espacios
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Limpiar errores previos
    setFieldErrors({
      NombreVoluntario: "",
      Numero1Voluntario: "",
      Numero2Voluntario: "",
      DescripcionVoluntario: "",
    })

    // Validar todos los campos obligatorios
    const isNombreValid = validateField("NombreVoluntario", formData.NombreVoluntario)
    const isTelefonoValid = validateField("Numero1Voluntario", formData.Numero1Voluntario)
    const isTelefono2Valid = validateField("Numero2Voluntario", formData.Numero2Voluntario)
    const isDescripcionValid = validateField("DescripcionVoluntario", formData.DescripcionVoluntario)

    // Si algún campo no es válido, no continuar
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) {
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Insertar registro en la base de datos
      const { error: insertError } = await supabase.from("SolicitudesVoluntariado").insert({
        NombreSolicitanteVoluntariado: formData.NombreVoluntario,
        Numero1SolicitanteVoluntariado: formData.Numero1Voluntario,
        Numero2SolicitanteVoluntariado: formData.Numero2Voluntario || null,
        DescripcionSolicitanteVoluntariado: formData.DescripcionVoluntario,
        EstadoSolicitanteVoluntariado: formData.EstadoVoluntario,
      })

      if (insertError) {
        throw insertError
      }

      // Mostrar modal de confirmación personalizado
      setShowConfirmationModal(true)
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setError(`Ocurrió un error: ${error.message}`)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      NombreVoluntario: "",
      Numero1Voluntario: "",
      Numero2Voluntario: "",
      DescripcionVoluntario: "",
      EstadoVoluntario: "Pendiente",
    })
    setFieldErrors({
      NombreVoluntario: "",
      Numero1Voluntario: "",
      Numero2Voluntario: "",
      DescripcionVoluntario: "",
    })
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    resetForm()
  }
  
  const handleConfirmationClose = () => {
    setShowConfirmationModal(false)
    resetForm()
  }

  return (
    <div className="voluntariado-container">
      {/* Botón flotante para ir al formulario */}
      <button
        className="btn-voluntariado floating-action-btn"
        style={{position: 'fixed', bottom: 32, right: 32, zIndex: 1000, borderRadius: '50px', padding: '16px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)'}}
        onClick={() => {
          const form = document.querySelector('.formulario-voluntariado h2');
          if (form) {
            const rect = form.getBoundingClientRect();
            const offset = 120; // 2cm más arriba (antes 80, ahora 120)
            window.scrollTo({
              top: window.scrollY + rect.top - offset,
              behavior: 'smooth'
            });
          }
        }}
        type="button"
      >
        Unirme
      </button>

      {/* Modal de Error */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false)
          setError("")
        }}
        title="Error"
        message={error}
        type="error"
      />

      {/* Modal de Éxito (legacy) */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="¡Solicitud Enviada con Éxito!"
        message={`¡Gracias ${formData.NombreVoluntario}! Tu solicitud de voluntariado ha sido recibida correctamente. Nos pondremos en contacto contigo al ${formData.Numero1Voluntario} para coordinar los próximos pasos. ¡Juntos haremos la diferencia en la vida de nuestros perritos! 🐕❤️`}
        type="success"
      />
      
      {/* Modal de Confirmación Personalizado */}
      <VoluntariadoConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationClose}
        volunteerName={formData.NombreVoluntario}
        phoneNumber={formData.Numero1Voluntario}
      />

      {/* Sección Hero */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🐕 Grupo Colitas Arequipa</span>
          </div>
          <h1 className="hero-title">Únete a Nuestro Equipo de Voluntarios</h1>
          <p className="hero-description">
            Sé parte del cambio que necesitan los perritos en situación de abandono. Como voluntario, contribuyes directamente a salvar vidas, brindar cuidados y encontrar hogares amorosos para nuestros rescatados.
          </p>
          <div className="hero-cta">
            <p className="hero-message">
              ✨ <strong>Tu tiempo vale oro</strong> - Juntos podemos darles una segunda oportunidad ✨
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Cómo puedes ayudar como voluntario */}
      <div className="como-ayudar-section">
        <h2>¿Cómo puedes ayudar como voluntario?</h2>
        <p className="como-ayudar-subtitle">
          Existen muchas formas de contribuir, desde cuidado directo hasta apoyo en redes sociales
        </p>
        <div className="ayuda-grid">
          <div className="ayuda-item">
            <div className="ayuda-icon">🏠</div>
            <h3>Hogar Temporal</h3>
            <p>
              Cuida un perrito en tu hogar mientras encuentra una familia permanente. Proporcionamos todo lo necesario: alimento, medicinas y atención veterinaria.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🚗</div>
            <h3>Transporte y Rescates</h3>
            <p>
              Ayúdanos en operativos de rescate, traslados al veterinario o movilización de perritos a eventos de adopción.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🧼</div>
            <h3>Cuidado y Limpieza</h3>
            <p>
              Participa en jornadas de limpieza del albergue, baño de perritos, mantenimiento de instalaciones y organización.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">📱</div>
            <h3>Redes Sociales</h3>
            <p>
              Ayúdanos a difundir casos de adopción, crear contenido, gestionar redes sociales y fotografiar a nuestros perritos.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🎯</div>
            <h3>Eventos y Campañas</h3>
            <p>
              Organiza o participa en campañas de esterilización, eventos de adopción, ferias benéficas y actividades de recaudación.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">💼</div>
            <h3>Habilidades Profesionales</h3>
            <p>
              Aporta tus conocimientos: veterinaria, derecho, contabilidad, diseño, marketing, construcción o cualquier habilidad útil.
            </p>
          </div>
        </div>
      </div>

      <div className="voluntariado-content">
        {/* Formulario de Solicitud de Voluntariado */}
        <div className="formulario-voluntariado">
          <h2>Formulario de Solicitud de Voluntariado</h2>
          <p className="formulario-subtitle">
            Completa este formulario y nos pondremos en contacto contigo para conocerte mejor y definir cómo puedes ayudar
          </p>

          <form onSubmit={handleSubmit} className="formulario-voluntariado-form">
            <div className="form-group">
              <label htmlFor="voluntario-nombre">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                type="text"
                id="voluntario-nombre"
                name="NombreVoluntario"
                value={formData.NombreVoluntario}
                onChange={handleChange}
                className={fieldErrors.NombreVoluntario ? "input-error" : ""}
              />
              {fieldErrors.NombreVoluntario && (
                <div className="field-error">{fieldErrors.NombreVoluntario}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="voluntario-telefono1">
                Teléfono Principal <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="voluntario-telefono1"
                name="Numero1Voluntario"
                value={formData.Numero1Voluntario}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters
                  if (value.length <= 9) {
                    // Limit to 9 digits
                    setFormData((prev) => ({ ...prev, Numero1Voluntario: value }))
                  }
                }}
                className={fieldErrors.Numero1Voluntario ? "input-error" : ""}
              />
              {fieldErrors.Numero1Voluntario && (
                <div className="field-error">{fieldErrors.Numero1Voluntario}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="voluntario-telefono2">Teléfono Alternativo (opcional)</label>
              <input
                type="tel"
                id="voluntario-telefono2"
                name="Numero2Voluntario"
                value={formData.Numero2Voluntario}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters
                  if (value.length <= 9) {
                    // Limit to 9 digits
                    setFormData((prev) => ({ ...prev, Numero2Voluntario: value }))
                  }
                }}
                className={fieldErrors.Numero2Voluntario ? "input-error" : ""}
              />
              {fieldErrors.Numero2Voluntario && (
                <div className="field-error">{fieldErrors.Numero2Voluntario}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="voluntario-descripcion">
                ¿Por qué quieres ser voluntario y cómo deseas ayudarnos? <span className="required">*</span>
              </label>
              <textarea
                id="voluntario-descripcion"
                name="DescripcionVoluntario"
                value={formData.DescripcionVoluntario}
                onChange={handleChange}
                className={fieldErrors.DescripcionVoluntario ? "input-error" : ""}
                placeholder="Cuéntanos sobre tu motivación, experiencia con animales, disponibilidad de tiempo, habilidades especiales, o cualquier forma específica en la que te gustaría contribuir..."
                rows="4"
              />
              {fieldErrors.DescripcionVoluntario && (
                <div className="field-error">{fieldErrors.DescripcionVoluntario}</div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-voluntariado" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitud de Voluntariado"}
              </button>
            </div>
          </form>

          <div className="data-protection-notice">
            <p>
              Sus datos personales serán protegidos de acuerdo con la Ley N° 29733 - Ley de Protección de Datos
              Personales.
            </p>
          </div>
        </div>

        {/* Sección de compromiso */}
        <div className="compromiso-section">
          <h2>Nuestro compromiso contigo como voluntario</h2>
          <p className="compromiso-subtitle">Valoramos tu tiempo y dedicación, por eso nos comprometemos a:</p>
          <div className="compromiso-grid">
            <div className="compromiso-item">
              <div className="compromiso-icon">🎓</div>
              <h4>Capacitación Completa</h4>
              <p>Te brindaremos toda la información y entrenamiento necesario para que te sientas seguro y preparado</p>
            </div>
            <div className="compromiso-item">
              <div className="compromiso-icon">🤝</div>
              <h4>Acompañamiento Constante</h4>
              <p>Siempre tendrás el apoyo del equipo y nunca estarás solo en tus actividades de voluntariado</p>
            </div>
            <div className="compromiso-item">
              <div className="compromiso-icon">📞</div>
              <h4>Comunicación Transparente</h4>
              <p>Mantenemos canales abiertos de comunicación para resolver dudas y coordinar actividades</p>
            </div>
            <div className="compromiso-item">
              <div className="compromiso-icon">🏆</div>
              <h4>Reconocimiento y Gratitud</h4>
              <p>Valoramos profundamente tu contribución y la reconocemos públicamente cuando es posible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Voluntariado
