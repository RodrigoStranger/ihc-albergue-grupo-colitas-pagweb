"use client"

import { useState } from "react"
import supabase from "../supabase/client"
import "../styles/Donar.css"
import "../styles/Modal.css"
import Modal from "../components/Modal"

function Donar() {
  const [formData, setFormData] = useState({
    NombreSolicitanteDonacion: "",
    Numero1SolicitanteDonacion: "",
    Numero2SolicitanteDonacion: "",
    DescripcionSolicitanteDonacion: "",
    EstadoSolicitanteDonacion: "Pendiente",
  })
  const [error, setError] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para errores específicos de cada campo
  const [fieldErrors, setFieldErrors] = useState({
    NombreSolicitanteDonacion: "",
    Numero1SolicitanteDonacion: "",
    Numero2SolicitanteDonacion: "",
    DescripcionSolicitanteDonacion: "",
  })

  // Función para validar un campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = ""

    switch (fieldName) {
      case "NombreSolicitanteDonacion":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo puede contener letras y espacios"
        }
        break
      case "Numero1SolicitanteDonacion":
        if (!value || value.trim() === "") {
          errorMessage = "El número de teléfono es obligatorio"
        } else if (value.length !== 9) {
          errorMessage = "El número de teléfono debe tener exactamente 9 dígitos"
        }
        break
      case "Numero2SolicitanteDonacion":
        if (value && value.trim() !== "" && value.length !== 9) {
          errorMessage = "El segundo número de teléfono debe tener exactamente 9 dígitos"
        }
        break
      case "DescripcionSolicitanteDonacion":
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
    if (name === "NombreSolicitanteDonacion") {
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
      NombreSolicitanteDonacion: "",
      Numero1SolicitanteDonacion: "",
      Numero2SolicitanteDonacion: "",
      DescripcionSolicitanteDonacion: "",
    })

    // Validar todos los campos obligatorios
    const isNombreValid = validateField("NombreSolicitanteDonacion", formData.NombreSolicitanteDonacion)
    const isTelefonoValid = validateField("Numero1SolicitanteDonacion", formData.Numero1SolicitanteDonacion)
    const isTelefono2Valid = validateField("Numero2SolicitanteDonacion", formData.Numero2SolicitanteDonacion)
    const isDescripcionValid = validateField("DescripcionSolicitanteDonacion", formData.DescripcionSolicitanteDonacion)

    // Si algún campo no es válido, no continuar
    if (!isNombreValid || !isTelefonoValid || !isTelefono2Valid || !isDescripcionValid) {
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Insertar registro en la base de datos
      const { error: insertError } = await supabase.from("SolicitudesDonacion").insert({
        NombreSolicitanteDonacion: formData.NombreSolicitanteDonacion,
        Numero1SolicitanteDonacion: formData.Numero1SolicitanteDonacion,
        Numero2SolicitanteDonacion: formData.Numero2SolicitanteDonacion || null,
        DescripcionSolicitanteDonacion: formData.DescripcionSolicitanteDonacion,
        EstadoSolicitanteDonacion: formData.EstadoSolicitanteDonacion,
      })

      if (insertError) {
        throw insertError
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true)
    } catch (error) {
      setError(`Ocurrió un error: ${error.message}`)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      NombreSolicitanteDonacion: "",
      Numero1SolicitanteDonacion: "",
      Numero2SolicitanteDonacion: "",
      DescripcionSolicitanteDonacion: "",
      EstadoSolicitanteDonacion: "Pendiente",
    })
    setFieldErrors({
      NombreSolicitanteDonacion: "",
      Numero1SolicitanteDonacion: "",
      Numero2SolicitanteDonacion: "",
      DescripcionSolicitanteDonacion: "",
    })
  }

  return (
    <div className="donar-container">
      {/* Modales */}
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

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          resetForm()
        }}
        title="¡Solicitud enviada exitosamente!"
        message={`Gracias ${formData.NombreSolicitanteDonacion} por tu interés en donar al albergue. 

Tu solicitud ha sido recibida y está siendo procesada. Un administrador del albergue se pondrá en contacto contigo muy pronto a través de WhatsApp al número ${formData.Numero1SolicitanteDonacion} para coordinar los siguientes pasos.

¡Tu generosidad hace la diferencia en la vida de nuestros perritos! 🐕❤️`}
        type="success"
      />

      {/* Sección Hero Simplificada */}
      <div className="hero-section-simple">
        <div className="hero-content-simple">
          <div className="hero-badge-simple">
            <span>🐕 Grupo Colitas Arequipa</span>
          </div>
          <h1 className="hero-title-simple">Ayuda a Nuestros Perritos</h1>
          <p className="hero-description-simple">
            Somos una organización dedicada al rescate, rehabilitación y búsqueda de hogares para perros en situación de
            abandono en Arequipa. Tu donación hace la diferencia en la vida de los perritos que rescatamos cada día.
          </p>
          <div className="hero-cta-simple">
            <p className="hero-message-simple">
              ✨ <strong>Cada donación cuenta</strong> - Juntos podemos darles una segunda oportunidad ✨
            </p>
          </div>
        </div>
      </div>

      {/* Nueva Sección: Conoce Nuestro Trabajo */}
      <div className="conoce-trabajo-section">
        <div className="trabajo-content">
          <div className="trabajo-text">
            <h2>Conoce Nuestro Trabajo</h2>
            <p className="trabajo-description">
              En <strong>Grupo Colitas Arequipa</strong>, cada día trabajamos incansablemente para rescatar, rehabilitar
              y encontrar hogares amorosos para perros en situación de abandono. Nuestro albergue es más que un refugio:
              es un hogar temporal donde cada perrito recibe amor, cuidados médicos y la oportunidad de una segunda
              oportunidad.
            </p>
            <div className="trabajo-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🏥</span>
                <div>
                  <h4>Atención Veterinaria</h4>
                  <p>
                    Cada perrito recibe atención médica completa, vacunas, desparasitación y tratamientos
                    especializados.
                  </p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">❤️</span>
                <div>
                  <h4>Rehabilitación Emocional</h4>
                  <p>Trabajamos en la recuperación emocional de perritos que han sufrido maltrato o abandono.</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🏠</span>
                <div>
                  <h4>Búsqueda de Hogares</h4>
                  <p>
                    Nos aseguramos de encontrar familias responsables y amorosas para cada uno de nuestros rescatados.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="trabajo-video">
            <div className="video-container-tiktok">
              <iframe
                src="https://www.tiktok.com/embed/7503604561358195974"
                width="100%"
                height="400"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video TikTok - Grupo Colitas Arequipa"
                className="tiktok-embed"
              ></iframe>
              <div className="video-fallback">
                <div className="video-placeholder-tiktok">
                  <div className="video-icon-tiktok">🎵</div>
                  <h3>Mira nuestro trabajo en TikTok</h3>
                  <p>Conoce las historias de rescate y transformación de nuestros perritos</p>
                  <a
                    href="https://www.tiktok.com/@grupocolitasarequipa/video/7503604561358195974?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link-tiktok"
                  >
                    <span>▶️</span>
                    Ver en TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Cómo tu donación ayuda */}
      <div className="como-ayuda-section">
        <h2>¿Cómo tu donación transforma vidas?</h2>
        <p className="como-ayuda-subtitle">
          Cada donación, sin importar su tamaño, se convierte en esperanza, salud y amor para nuestros perritos
          rescatados
        </p>
        <div className="ayuda-grid">
          <div className="ayuda-item">
            <div className="ayuda-icon">🚑</div>
            <h3>Rescates de Emergencia</h3>
            <p>
              Financiamos operativos de rescate para perritos en situaciones críticas, accidentes o maltrato. Cada
              rescate requiere recursos inmediatos para salvar vidas.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🏥</div>
            <h3>Atención Médica Integral</h3>
            <p>
              Cubrimos consultas veterinarias, cirugías, tratamientos especializados, vacunas y medicamentos. La salud
              es nuestra prioridad número uno.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🍽️</div>
            <h3>Alimentación Nutritiva</h3>
            <p>
              Proporcionamos alimento balanceado de calidad para todos nuestros perritos. Una buena nutrición es
              fundamental para su recuperación y bienestar.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🏠</div>
            <h3>Hogar Temporal Seguro</h3>
            <p>
              Mantenemos las instalaciones en óptimas condiciones: limpieza, reparaciones, servicios básicos y mejoras
              constantes para el bienestar.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🧼</div>
            <h3>Cuidado e Higiene</h3>
            <p>
              Productos de limpieza, desinfección, champús especiales, y artículos de higiene para mantener a nuestros
              perritos limpios y saludables.
            </p>
          </div>
          <div className="ayuda-item">
            <div className="ayuda-icon">🎾</div>
            <h3>Amor y Rehabilitación</h3>
            <p>
              Juguetes, mantas, camas cómodas y elementos que mejoran la calidad de vida y ayudan en la rehabilitación
              emocional de cada perrito.
            </p>
          </div>
        </div>
      </div>

      <div className="donacion-content">
        {/* Tipos de Donación que necesitamos - REDISEÑADA */}
        <div className="donaciones-necesarias-nueva">
          <div className="donaciones-header">
            <h2>¿Qué necesitamos para seguir salvando vidas?</h2>
            <p className="donaciones-intro">
              Tu generosidad se convierte directamente en segundas oportunidades. Estas son las formas más efectivas de
              ayudar:
            </p>
          </div>

          <div className="donaciones-tabs">
            <div className="categoria-donacion-nueva monetaria">
              <div className="categoria-header">
                <div className="categoria-icon">💰</div>
                <div className="categoria-info">
                  <h3>Donaciones Monetarias</h3>
                  <p>La forma más flexible de ayudar, nos permite cubrir necesidades urgentes</p>
                </div>
              </div>
              <div className="categoria-items">
                <div className="donacion-item">
                  <span className="item-icon">🏥</span>
                  <div className="item-content">
                    <h4>Emergencias Veterinarias</h4>
                    <p>Cirugías, tratamientos especializados y medicinas de alto costo</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🍽️</span>
                  <div className="item-content">
                    <h4>Alimentación Diaria</h4>
                    <p>Alimento balanceado premium para una nutrición óptima</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🚗</span>
                  <div className="item-content">
                    <h4>Operativos de Rescate</h4>
                    <p>Combustible y recursos para rescates de emergencia</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🏠</span>
                  <div className="item-content">
                    <h4>Mantenimiento del Albergue</h4>
                    <p>Servicios básicos, reparaciones y mejoras de infraestructura</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="categoria-donacion-nueva alimentos">
              <div className="categoria-header">
                <div className="categoria-icon">🥘</div>
                <div className="categoria-info">
                  <h3>Alimentos y Nutrición</h3>
                  <p>Nutrición de calidad para la recuperación y bienestar de nuestros perritos</p>
                </div>
              </div>
              <div className="categoria-items">
                <div className="donacion-item">
                  <span className="item-icon">🥣</span>
                  <div className="item-content">
                    <h4>Alimento Balanceado Premium</h4>
                    <p>Para perros adultos de todas las razas y tamaños</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🍼</span>
                  <div className="item-content">
                    <h4>Alimento para Cachorros</h4>
                    <p>Fórmulas especiales para el crecimiento saludable</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🥫</span>
                  <div className="item-content">
                    <h4>Comida Húmeda</h4>
                    <p>Para perritos en recuperación o con necesidades especiales</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🦴</span>
                  <div className="item-content">
                    <h4>Premios y Snacks</h4>
                    <p>Para entrenamiento y refuerzo positivo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="categoria-donacion-nueva medicinas">
              <div className="categoria-header">
                <div className="categoria-icon">💊</div>
                <div className="categoria-info">
                  <h3>Medicinas y Cuidado Médico</h3>
                  <p>Elementos esenciales para mantener la salud de nuestros rescatados</p>
                </div>
              </div>
              <div className="categoria-items">
                <div className="donacion-item">
                  <span className="item-icon">💊</span>
                  <div className="item-content">
                    <h4>Antiparasitarios</h4>
                    <p>Internos y externos para prevención y tratamiento</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">💉</span>
                  <div className="item-content">
                    <h4>Vacunas</h4>
                    <p>Programa completo de inmunización</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">💪</span>
                  <div className="item-content">
                    <h4>Vitaminas y Suplementos</h4>
                    <p>Para fortalecer el sistema inmunológico</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🩹</span>
                  <div className="item-content">
                    <h4>Material de Curación</h4>
                    <p>Vendas, gasas, desinfectantes y primeros auxilios</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="categoria-donacion-nueva materiales">
              <div className="categoria-header">
                <div className="categoria-icon">🛏️</div>
                <div className="categoria-info">
                  <h3>Materiales y Bienestar</h3>
                  <p>Elementos que hacen más cómoda y feliz la estadía de nuestros perritos</p>
                </div>
              </div>
              <div className="categoria-items">
                <div className="donacion-item">
                  <span className="item-icon">🛏️</span>
                  <div className="item-content">
                    <h4>Mantas y Cobijas</h4>
                    <p>Para mantenerlos abrigados y cómodos</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🧸</span>
                  <div className="item-content">
                    <h4>Juguetes Resistentes</h4>
                    <p>Para ejercicio, entretenimiento y rehabilitación</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🦮</span>
                  <div className="item-content">
                    <h4>Correas y Collares</h4>
                    <p>Para paseos seguros y identificación</p>
                  </div>
                </div>
                <div className="donacion-item">
                  <span className="item-icon">🧽</span>
                  <div className="item-content">
                    <h4>Artículos de Limpieza</h4>
                    <p>Champús, desinfectantes y productos de higiene</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Solicitud de Donación */}
        <div className="formulario-donacion">
          <h2>Formulario de Solicitud de Donación</h2>
          <p className="formulario-subtitle">
            Completa este formulario y nos pondremos en contacto contigo para coordinar tu donación
          </p>

          <form onSubmit={handleSubmit} className="formulario-donacion-form">
            <div className="form-group">
              <label htmlFor="donante-nombre">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                type="text"
                id="donante-nombre"
                name="NombreSolicitanteDonacion"
                value={formData.NombreSolicitanteDonacion}
                onChange={handleChange}
                className={fieldErrors.NombreSolicitanteDonacion ? "input-error" : ""}
              />
              {fieldErrors.NombreSolicitanteDonacion && (
                <div className="field-error">{fieldErrors.NombreSolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="donante-telefono1">
                Teléfono Principal <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="donante-telefono1"
                name="Numero1SolicitanteDonacion"
                value={formData.Numero1SolicitanteDonacion}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters
                  if (value.length <= 9) {
                    // Limit to 9 digits
                    setFormData((prev) => ({ ...prev, Numero1SolicitanteDonacion: value }))
                  }
                }}
                className={fieldErrors.Numero1SolicitanteDonacion ? "input-error" : ""}
              />
              {fieldErrors.Numero1SolicitanteDonacion && (
                <div className="field-error">{fieldErrors.Numero1SolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="donante-telefono2">Teléfono Alternativo (opcional)</label>
              <input
                type="tel"
                id="donante-telefono2"
                name="Numero2SolicitanteDonacion"
                value={formData.Numero2SolicitanteDonacion}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters
                  if (value.length <= 9) {
                    // Limit to 9 digits
                    setFormData((prev) => ({ ...prev, Numero2SolicitanteDonacion: value }))
                  }
                }}
                className={fieldErrors.Numero2SolicitanteDonacion ? "input-error" : ""}
              />
              {fieldErrors.Numero2SolicitanteDonacion && (
                <div className="field-error">{fieldErrors.Numero2SolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="donante-descripcion">
                Descripción de tu Donación <span className="required">*</span>
              </label>
              <textarea
                id="donante-descripcion"
                name="DescripcionSolicitanteDonacion"
                value={formData.DescripcionSolicitanteDonacion}
                onChange={handleChange}
                className={fieldErrors.DescripcionSolicitanteDonacion ? "input-error" : ""}
                placeholder="Describe qué te gustaría donar (dinero, alimentos, medicinas, materiales, etc.) y cualquier detalle adicional..."
                rows="4"
              />
              {fieldErrors.DescripcionSolicitanteDonacion && (
                <div className="field-error">{fieldErrors.DescripcionSolicitanteDonacion}</div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-donar" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitud de Donación"}
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

        {/* Sección de impacto */}
        <div className="impacto-section">
          <h2>El impacto real de tu donación</h2>
          <p className="impacto-subtitle">Cada sol donado se convierte en esperanza y vida para nuestros perritos</p>
          <div className="impacto-grid">
            <div className="impacto-item">
              <div className="impacto-numero">🍽️</div>
              <h4>S/ 25</h4>
              <p>Alimenta a un perrito por una semana completa</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">💉</div>
              <h4>S/ 50</h4>
              <p>Cubre las vacunas básicas de un cachorro</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">🏥</div>
              <h4>S/ 100</h4>
              <p>Paga una consulta veterinaria de emergencia</p>
            </div>
            <div className="impacto-item">
              <div className="impacto-numero">❤️</div>
              <h4>S/ 200</h4>
              <p>Cubre los gastos completos de rescate y rehabilitación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donar
