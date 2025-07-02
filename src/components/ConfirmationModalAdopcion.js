"use client"
import { useEffect, useRef, useState } from "react"
import "../styles/ConfirmationModalAdopcion.css"

const ConfirmationModalAdopcion = ({ isOpen, onClose, adoptanteName, phoneNumber, dogName, dogPhoto }) => {
  const scrollContainerRef = useRef(null)
  const scrollThumbRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [scrollRatio, setScrollRatio] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    const updateScrollbar = () => {
      const container = scrollContainerRef.current
      if (!container) return

      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      const scrollTop = container.scrollTop

      if (scrollHeight <= clientHeight) {
        // No need for scrollbar
        setScrollRatio(0)
        return
      }

      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30)
      const maxScrollTop = scrollHeight - clientHeight
      const thumbTop = (scrollTop / maxScrollTop) * (clientHeight - thumbHeight)

      setScrollRatio(thumbHeight / clientHeight)

      if (scrollThumbRef.current) {
        scrollThumbRef.current.style.height = `${thumbHeight}px`
        scrollThumbRef.current.style.top = `${thumbTop}px`
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", updateScrollbar)
      updateScrollbar() // Initial call
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollbar)
      }
    }
  }, [isOpen])

  const handleThumbMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)

    const startY = e.clientY
    const container = scrollContainerRef.current
    const thumb = scrollThumbRef.current

    if (!container || !thumb) return

    const startScrollTop = container.scrollTop
    const containerRect = container.getBoundingClientRect()
    const maxScrollTop = container.scrollHeight - container.clientHeight

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY
      const scrollableHeight = containerRect.height - thumb.offsetHeight
      const scrollDelta = (deltaY / scrollableHeight) * maxScrollTop

      container.scrollTop = Math.max(0, Math.min(maxScrollTop, startScrollTop + scrollDelta))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="confirmation-modal-adopcion-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-adopcion-container">
        <div className="confirmation-modal-adopcion-scroll" ref={scrollContainerRef}>
          <div className="confirmation-modal-adopcion-inner">
            <div className="confirmation-modal-adopcion-header">
              <div className="confirmation-adopcion-icon">
                <div className="success-checkmark-adopcion">
                  <div className="check-icon-adopcion">
                    <span className="icon-line-adopcion line-tip-adopcion"></span>
                    <span className="icon-line-adopcion line-long-adopcion"></span>
                    <div className="icon-circle-adopcion"></div>
                    <div className="icon-fix-adopcion"></div>
                  </div>
                </div>
              </div>
              <h2 className="confirmation-adopcion-title">¡Solicitud de Adopción Enviada!</h2>
            </div>

            <div className="confirmation-modal-adopcion-body">
              <div className="confirmation-adopcion-message">
                <p className="main-message-adopcion">
                  <strong>¡Gracias {adoptanteName}!</strong> Tu solicitud para adoptar a <strong>{dogName}</strong> ha sido recibida exitosamente.
                </p>

                {/* Foto del perrito */}
                {dogPhoto && (
                  <div className="adopted-dog-photo">
                    <img 
                      src={dogPhoto || "/placeholder.svg"} 
                      alt={dogName}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTggM2E2IDYgMCAwIDAgMCAxMmg0djJhNiA2IDAgMCAwIDYtNnYtMmgtNGE2IDYgMCAwIDAtNi02eiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIxIi8+PC9zdmc+PC90ZXh0Pgo8L3N2Zz4="
                      }}
                    />
                    <div className="dog-name-overlay">{dogName}</div>
                  </div>
                )}

                <div className="confirmation-adopcion-details">
                  <div className="detail-item-adopcion">
                    <span className="detail-icon-adopcion">📋</span>
                    <div className="detail-content-adopcion">
                      <h4>Solicitud Procesándose</h4>
                      <p>Tu solicitud de adopción ha sido registrada y está siendo revisada por nuestro equipo especializado.</p>
                    </div>
                  </div>

                  <div className="detail-item-adopcion">
                    <span className="detail-icon-adopcion">📱</span>
                    <div className="detail-content-adopcion">
                      <h4>Contacto Próximo</h4>
                      <p>
                        Un coordinador de adopciones se comunicará contigo vía WhatsApp al número{" "}
                        <strong>{phoneNumber}</strong> para coordinar una entrevista y visita al albergue.
                      </p>
                    </div>
                  </div>

                  <div className="detail-item-adopcion">
                    <span className="detail-icon-adopcion">🏠</span>
                    <div className="detail-content-adopcion">
                      <h4>Proceso de Adopción</h4>
                      <p>
                        Evaluaremos tu perfil como adoptante responsable y te guiaremos en cada paso para asegurar el bienestar de {dogName}.
                      </p>
                    </div>
                  </div>

                  <div className="detail-item-adopcion">
                    <span className="detail-icon-adopcion">⏰</span>
                    <div className="detail-content-adopcion">
                      <h4>Tiempo de Respuesta</h4>
                      <p>
                        Nuestro equipo se pondrá en contacto contigo dentro de las próximas 24-48 horas para iniciar el proceso.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="adoption-process-section">
                  <h3>¿Qué sigue ahora?</h3>
                  <div className="process-steps">
                    <div className="process-step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Entrevista Inicial</h4>
                        <p>Conversaremos sobre tu experiencia con mascotas y expectativas</p>
                      </div>
                    </div>
                    <div className="process-step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Visita al Albergue</h4>
                        <p>Conocerás personalmente a {dogName} y nuestras instalaciones</p>
                      </div>
                    </div>
                    <div className="process-step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Evaluación del Hogar</h4>
                        <p>Verificaremos que tu hogar sea seguro y adecuado</p>
                      </div>
                    </div>
                    <div className="process-step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h4>¡Adopción Exitosa!</h4>
                        <p>Completaremos los documentos y {dogName} irá a su nuevo hogar</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gratitude-adopcion-section">
                  <div className="heart-animation-adopcion">🐕❤️</div>
                  <p className="gratitude-adopcion-text">
                    <strong>¡Gracias por abrir tu corazón y hogar a un perrito rescatado!</strong>
                  </p>
                  <p className="signature-adopcion">
                    Con esperanza y gratitud,
                    <br />
                    <strong>Equipo Grupo Colitas Arequipa</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="confirmation-modal-adopcion-footer">
              <button className="confirmation-adopcion-close-btn" onClick={onClose}>
                <span>Continuar</span>
                <div className="btn-shine-adopcion"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollbar personalizado */}
        {scrollRatio > 0 && (
          <div className="custom-scrollbar-adopcion">
            <div
              className="custom-scrollbar-thumb-adopcion"
              ref={scrollThumbRef}
              onMouseDown={handleThumbMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            />
          </div>
        )}

        <button className="confirmation-modal-adopcion-close-x" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>
      </div>
    </div>
  )
}

export default ConfirmationModalAdopcion
