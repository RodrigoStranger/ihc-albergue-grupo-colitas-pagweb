"use client"
import { useEffect, useRef, useState } from "react"
import "../styles/ConfirmationModal.css"

const ConfirmationModal = ({ isOpen, onClose, donorName, phoneNumber }) => {
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
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-container">
        <div className="confirmation-modal-scroll" ref={scrollContainerRef}>
          <div className="confirmation-modal-inner">
            <div className="confirmation-modal-header">
              <div className="confirmation-icon">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              </div>
              <h2 className="confirmation-title">¡Solicitud Enviada Exitosamente!</h2>
            </div>

            <div className="confirmation-modal-body">
              <div className="confirmation-message">
                <p className="main-message">
                  <strong>Gracias {donorName}</strong> por tu generoso corazón y tu interés en ayudar a nuestros
                  perritos rescatados.
                </p>

                <div className="confirmation-details">
                  <div className="detail-item">
                    <span className="detail-icon">📋</span>
                    <div className="detail-content">
                      <h4>Tu solicitud ha sido recibida</h4>
                      <p>Hemos registrado tu solicitud de donación y está siendo procesada por nuestro equipo.</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">📱</span>
                    <div className="detail-content">
                      <h4>Te contactaremos pronto</h4>
                      <p>
                        Un administrador del albergue se pondrá en contacto contigo a través de WhatsApp al número{" "}
                        <strong>{phoneNumber}</strong> para coordinar los siguientes pasos.
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">🐕</span>
                    <div className="detail-content">
                      <h4>Haciendo la diferencia</h4>
                      <p>
                        Tu donación será fundamental para continuar rescatando, rehabilitando y encontrando hogares para
                        más perritos en necesidad.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="gratitude-section">
                  <div className="heart-animation">❤️</div>
                  <p className="gratitude-text">
                    <strong>¡Tu generosidad hace la diferencia en la vida de nuestros perritos!</strong>
                  </p>
                  <p className="signature">
                    Con amor y gratitud,
                    <br />
                    <strong>Equipo Grupo Colitas Arequipa</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="confirmation-modal-footer">
              <button className="confirmation-close-btn" onClick={onClose}>
                <span>Continuar</span>
                <div className="btn-shine"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollbar personalizado */}
        {scrollRatio > 0 && (
          <div className="custom-scrollbar">
            <div
              className="custom-scrollbar-thumb"
              ref={scrollThumbRef}
              onMouseDown={handleThumbMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            />
          </div>
        )}

        <button className="confirmation-modal-close-x" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>
      </div>
    </div>
  )
}

export default ConfirmationModal
