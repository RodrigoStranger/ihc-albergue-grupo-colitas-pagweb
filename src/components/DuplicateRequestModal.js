"use client"
import "../styles/DuplicateRequestModal.css"

const DuplicateRequestModal = ({ isOpen, onClose, dogName, dogPhoto }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="duplicate-modal-overlay" onClick={handleOverlayClick}>
      <div className="duplicate-modal-container">
        <div className="duplicate-modal-header">
          <div className="duplicate-icon">
            <div className="heart-eyes-animation">😍</div>
          </div>
          <h2 className="duplicate-title">¡Entendemos tu emoción!</h2>
        </div>

        <div className="duplicate-modal-body">
          {/* Foto del perrito */}
          {dogPhoto && (
            <div className="duplicate-dog-photo">
              <img
                src={dogPhoto || "/placeholder.svg"}
                alt={dogName}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTggM2E2IDYgMCAwIDAgMCAxMmg0djJhNiA2IDAgMCAwIDYtNnYtMmgtNGE2IDYgMCAwIDAtNi02eiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIxIi8+PC9zdmc+PC90ZXh0Pgo8L3N2Zz4="
                }}
              />
              <div className="duplicate-dog-name-overlay">{dogName}</div>
            </div>
          )}

          <div className="duplicate-message">
            <p className="main-duplicate-message">
              Entendemos tu emoción por adoptar a <strong>{dogName}</strong>, ¡es realmente adorable! 🥰
            </p>

            <div className="duplicate-explanation">
              <div className="explanation-item">
                <span className="explanation-icon">📋</span>
                <div className="explanation-content">
                  <h4>Ya tienes una solicitud activa</h4>
                  <p>
                    Hemos encontrado que ya enviaste una solicitud de adopción para <strong>{dogName}</strong> que
                    está siendo procesada por nuestro equipo.
                  </p>
                </div>
              </div>

              <div className="explanation-item">
                <span className="explanation-icon">⏳</span>
                <div className="explanation-content">
                  <h4>Proceso en curso</h4>
                  <p>
                    Nuestro equipo está revisando tu solicitud cuidadosamente. Este proceso puede tomar entre 24-48
                    horas para asegurar el mejor match para {dogName}.
                  </p>
                </div>
              </div>

              <div className="explanation-item">
                <span className="explanation-icon">📱</span>
                <div className="explanation-content">
                  <h4>Te contactaremos pronto</h4>
                  <p>
                    Un coordinador de adopciones se comunicará contigo vía WhatsApp para continuar con el proceso de
                    adopción de {dogName}.
                  </p>
                </div>
              </div>
            </div>

            <div className="patience-section">
              <div className="patience-icon">🙏</div>
              <h3>Un poquito de paciencia</h3>
              <p>
                Sabemos que es emocionante pensar en darle un hogar a {dogName}, pero cada solicitud requiere tiempo
                para ser evaluada correctamente. ¡Tu paciencia ayuda a asegurar que {dogName} encuentre el hogar
                perfecto!
              </p>
            </div>

            <div className="next-steps-section">
              <h3>¿Qué puedes hacer mientras tanto?</h3>
              <div className="next-steps-grid">
                <div className="next-step-item">
                  <span className="step-icon">🏠</span>
                  <div className="step-content">
                    <h4>Prepara tu hogar</h4>
                    <p>Asegúrate de que tu casa esté lista para recibir a {dogName}</p>
                  </div>
                </div>
                <div className="next-step-item">
                  <span className="step-icon">🛍️</span>
                  <div className="step-content">
                    <h4>Compra suministros</h4>
                    <p>Comida, juguetes, cama y otros artículos que {dogName} necesitará</p>
                  </div>
                </div>
                <div className="next-step-item">
                  <span className="step-icon">📚</span>
                  <div className="step-content">
                    <h4>Aprende sobre cuidados</h4>
                    <p>Investiga sobre las necesidades específicas de {dogName}</p>
                  </div>
                </div>
                <div className="next-step-item">
                  <span className="step-icon">❤️</span>
                  <div className="step-content">
                    <h4>Mantén la emoción</h4>
                    <p>¡Tu amor por {dogName} es lo más importante!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="encouragement-section">
              <div className="encouragement-animation">🌟</div>
              <p className="encouragement-text">
                <strong>¡Gracias por querer darle una segunda oportunidad a {dogName}!</strong>
              </p>
              <p className="encouragement-signature">
                Tu interés genuino en adoptar es exactamente lo que buscamos en una familia adoptiva.
                <br />
                <strong>Equipo Grupo Colitas Arequipa</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="duplicate-modal-footer">
          <button className="duplicate-close-btn" onClick={onClose}>
            <span>Entendido</span>
            <div className="btn-shine-duplicate"></div>
          </button>
        </div>

        <button className="duplicate-modal-close-x" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>
      </div>
    </div>
  )
}

export default DuplicateRequestModal
