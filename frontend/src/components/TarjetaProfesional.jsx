import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TarjetaProfesional({ profesional, modo = 'resultado' }) {
  const navigate = useNavigate()
  const [verMasServicios, setVerMasServicios] = useState(false)
  const [verMasValoraciones, setVerMasValoraciones] = useState(false)

  if (!profesional) return null

  // MODO RESULTADO: tarjeta horizontal naranja con botones
  if (modo === 'resultado') {
    return (
      <div className="tarjeta-resultado">
        <div className="tarjeta-resultado-avatar">👤</div>
        <div className="tarjeta-resultado-info">
          <h3>
            {profesional.nombre}
            {profesional.verificado && <span className="check">✔</span>}
          </h3>
          <p className="oficio">{profesional.oficio}</p>
          <p className="puntuacion">
            {profesional.puntuacion != null && <>⭐ {profesional.puntuacion} / </>}
            Zona: {profesional.zona}
          </p>
        </div>
        <div className="tarjeta-resultado-acciones">
          <button onClick={() => navigate(`/perfil/${profesional.id}`)}>VER PERFIL</button>
          <button onClick={() => navigate(`/perfil/${profesional.id}`)}>
            SOLICITAR PRESUPUESTO
          </button>
        </div>
      </div>
    )
  }

  // MODO PERFIL: bloques naranjas apilados
  const serviciosVisibles = verMasServicios
    ? profesional.servicios
    : profesional.servicios.slice(0, 2)

  const valoracionesVisibles = verMasValoraciones
    ? profesional.valoraciones
    : profesional.valoraciones.slice(0, 1)

  return (
    <div className="perfil-contenedor">
      <div className="perfil-cabecera">
        <div className="perfil-avatar">👤</div>
        <div className="perfil-datos">
          <h2>{profesional.nombre}</h2>
          <p>{profesional.oficio}</p>
          <p>
            {profesional.puntuacion != null && <>⭐ {profesional.puntuacion} / </>}
            Zona: {profesional.zona}
          </p>
          <p>Disponibilidad: {profesional.disponibilidad}</p>
        </div>
      </div>

      <div className="perfil-bloque">
        <h3>Sobre mí</h3>
        <p>{profesional.sobreMi}</p>
      </div>

      <div className="perfil-bloque">
        <h3>Servicios ofrecidos</h3>
        <ul>
          {serviciosVisibles.map((s, i) => (
            <li key={i}>
              - {s.nombre} ${s.precio.toLocaleString('es-AR')}
            </li>
          ))}
        </ul>
        {profesional.servicios.length > 2 && (
          <button
            className="ver-mas"
            onClick={() => setVerMasServicios(!verMasServicios)}
          >
            {verMasServicios ? 'ver menos ▲' : 'ver más ▼'}
          </button>
        )}
      </div>

      <div className="perfil-bloque">
        <h3>Valoraciones</h3>
        {valoracionesVisibles.length === 0 ? (
          <p>Sin valoraciones todavía.</p>
        ) : (
          <ul>
            {valoracionesVisibles.map((v, i) => (
              <li key={i}>
                {v.puntuacion}⭐ {v.usuario}: {v.comentario}
              </li>
            ))}
          </ul>
        )}
        {profesional.valoraciones.length > 1 && (
          <button
            className="ver-mas"
            onClick={() => setVerMasValoraciones(!verMasValoraciones)}
          >
            {verMasValoraciones ? 'ver menos ▲' : 'ver más ▼'}
          </button>
        )}
      </div>

      <button
        className="boton-solicitar"
        onClick={() => navigate(`/presupuesto/${profesional.id}`)}
      >
        SOLICITAR PRESUPUESTO
      </button>
    </div>
  )
}

export default TarjetaProfesional