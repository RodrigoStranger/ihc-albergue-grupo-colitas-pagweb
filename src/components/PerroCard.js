"use client"

const PerroCard = ({ perro, onCardClick }) => {
  const {
    idperro,
    nombreperro,
    edadperro,
    sexoperro,
    estaturaperro,
    pelajeperro,
    actividadperro,
    fotografíaprincipalperro,
  } = perro

  // Determinar la clase CSS basada en el sexo
  const sexoClass = sexoperro === "Hembra" ? "perro-card-hembra" : "perro-card-macho"

  return (
    <div className={`perro-card ${sexoClass}`} key={idperro} onClick={() => onCardClick(perro)}>
      <div
        className="card-background"
        style={{
          backgroundImage: `url(${fotografíaprincipalperro})`,
          height: "100%",
          minHeight: "100%",
        }}
      >
        <div className="card-overlay">
          <h3 className="nombre-perro">{nombreperro}</h3>

          <div className="perro-info-hover">
            <div className="perro-info-grid">
              <div className="info-item">
                <span className="info-label">Edad</span>
                <span className="info-value">{edadperro} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sexo</span>
                <span className="info-value">{sexoperro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tamaño</span>
                <span className="info-value">{estaturaperro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pelaje</span>
                <span className="info-value">{pelajeperro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Actividad</span>
                <span className="info-value">{actividadperro}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerroCard
