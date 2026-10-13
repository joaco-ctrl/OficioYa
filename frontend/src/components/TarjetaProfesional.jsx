import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TarjetaProfesional({ profesional, modo = 'resultado' }) {
  const navigate = useNavigate()
  const [verMasServicios, setVerMasServicios] = useState(false)
  const [verMasValoraciones, setVerMasValoraciones] = useState(false)

  if (!profesional) return null

  const inicial = profesional.nombre.charAt(0).toUpperCase()

  if (modo === 'resultado') {
    return (
      <div className="tarjeta-resultado">
        <div className="tarjeta-resultado-avatar">{inicial}</div>
        <div className="tarjeta-resultado-info">
          <h3>
            {profesional.nombre}
            {profesional.verificado && (
              <span className="badge-verificado">Verificado</span>
            )}
          </h3>
          <p className="oficio">{profesional.titulo || profesional.oficio}</p>
          <div className="tarjeta-resultado-meta">
            {profesional.puntuacion > 0 && (
              <span className="puntuacion">{profesional.puntuacion} ★</span>
            )}
            <span className="separador">·</span>
            <span>{profesional.zona}</span>
            {profesional.trabajosRealizados != null && (
              <>
                <span className="separador">·</span>
                <span>{profesional.trabajosRealizados} trabajos</span>
              </>
            )}
          </div>
        </div>
        <div className="tarjeta-resultado-acciones">
          <button onClick={() => navigate(`/perfil/${profesional.id}`)}>
            Ver perfil
          </button>
          <button
            className="boton-secundario"
            onClick={() => navigate(`/presupuesto/${profesional.servicioId}`)}
          >
            Solicitar presupuesto
          </button>
        </div>
      </div>
    )
  }

  const servicios = profesional.servicios || []
  const valoraciones = profesional.valoraciones || []
  const serviciosVisibles = verMasServicios ? servicios : servicios.slice(0, 2)

  const valoracionesVisibles = verMasValoraciones
    ? valoraciones
    : valoraciones.slice(0, 1)

  return (
    <div className="perfil-contenedor">
      <div className="perfil-cabecera">
        <div className="perfil-avatar">{inicial}</div>
        <div className="perfil-datos">
          <div className="perfil-nombre-fila">
            <h2>{profesional.nombre}</h2>
            {profesional.verificado && (
              <span className="badge-verificado">Verificado</span>
            )}
          </div>
          <p className="perfil-titulo">{profesional.titulo || profesional.oficio}</p>
          <div className="perfil-meta">
            {profesional.puntuacion > 0 && <span>{profesional.puntuacion} ★</span>}
            <span className="separador">·</span>
            <span>{profesional.zona}</span>
            {profesional.trabajosRealizados != null && (
              <>
                <span className="separador">·</span>
                <span>{profesional.trabajosRealizados} trabajos</span>
              </>
            )}
          </div>
          {profesional.disponibilidad && (
            <p className="perfil-disponibilidad">
              Disponibilidad: {profesional.disponibilidad}
            </p>
          )}
        </div>
      </div>

      <div className="perfil-bloque">
        <h3>Sobre mí</h3>
        <p>{profesional.sobreMi || 'Este profesional todavía no agregó una descripción.'}</p>
      </div>

      <div className="perfil-bloque">
        <h3>Servicios ofrecidos</h3>
        <ul className="lista-servicios">
          {serviciosVisibles.map((s, i) => (
            <li key={i}>
              <span className="servicio-nombre">{s.nombre}</span>
              <span className="servicio-precio">
                {s.precio == null ? 'Consultar' : `$${Number(s.precio).toLocaleString('es-AR')}`}
              </span>
            </li>
          ))}
        </ul>
        {profesional.servicios.length > 2 && (
          <button
            className="ver-mas"
            onClick={() => setVerMasServicios(!verMasServicios)}
          >
            {verMasServicios ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      <div className="perfil-bloque">
        <h3>Valoraciones</h3>
        {valoracionesVisibles.length === 0 ? (
          <p className="sin-valoraciones">Sin valoraciones todavía.</p>
        ) : (
          <ul className="lista-valoraciones">
            {valoracionesVisibles.map((v, i) => (
              <li key={i}>
                <div className="valoracion-header">
                  <span className="valoracion-usuario">{v.usuario}</span>
                  <span className="valoracion-puntuacion">
                    {v.puntuacion} ★
                  </span>
                </div>
                <p className="valoracion-comentario">{v.comentario}</p>
              </li>
            ))}
          </ul>
        )}
        {valoraciones.length > 1 && (
          <button
            className="ver-mas"
            onClick={() => setVerMasValoraciones(!verMasValoraciones)}
          >
            {verMasValoraciones ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {(profesional.servicioId || profesional.servicios?.[0]?.id) && (
        <button
          className="boton-solicitar"
          onClick={() => navigate(`/presupuesto/${profesional.servicioId || profesional.servicios[0].id}`)}
        >
          Solicitar presupuesto
        </button>
      )}
    </div>
  )
}

export default TarjetaProfesional