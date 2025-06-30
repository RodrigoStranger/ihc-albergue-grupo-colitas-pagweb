"use client"

const PerroCard = ({ perro, onCardClick }) => {
  const {
    IdPerro,
    NombrePerro,
    SexoPerro,
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
            <div className="adoption-message">
              <p className="adoption-cta">Adóptame ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerroCard
