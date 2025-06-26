"use client"

const PerroCard = ({ perro, onCardClick }) => {
  const {
    IdPerro,
    NombrePerro,
    EdadPerro,
    SexoPerro,
    EstaturaPerro,
    PelajePerro,
    ActividadPerro,
    FotoPerro,
  } = perro

  // Determinar la clase CSS basada en el sexo
  const sexoClass = SexoPerro === "Hembra" ? "perro-card-hembra" : "perro-card-macho"

  return (
    <div className={`perro-card ${sexoClass}`} key={IdPerro} onClick={() => onCardClick(perro)}>
      <div
        className="card-background"
        style={{
          backgroundImage: `url(${FotoPerro})`,
          height: "100%",
          minHeight: "100%",
        }}
      >
        <div className="card-overlay">
          <h3 className="nombre-perro">{NombrePerro}</h3>

          <div className="perro-info-hover">
            <div className="perro-info-grid">
              <div className="info-item">
                <span className="info-label">Edad</span>
                <span className="info-value">{EdadPerro} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sexo</span>
                <span className="info-value">{SexoPerro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tamaño</span>
                <span className="info-value">{EstaturaPerro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pelaje</span>
                <span className="info-value">{PelajePerro}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Actividad</span>
                <span className="info-value">{ActividadPerro}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerroCard
