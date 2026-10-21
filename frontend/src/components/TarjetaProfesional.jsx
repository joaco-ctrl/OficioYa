import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TarjetaProfesional({ profesional, modo = 'resultado' }) {
  const navigate = useNavigate()
  const [pestana, setPestana] = useState('servicios')
  const [servicioSeleccionado, setServicioSeleccionado] = useState('')
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
          <p className="oficio">{profesional.oficio}</p>
          <p className="servicio-resumen">
            {profesional.servicios.map((servicio) => servicio.nombre).join(' · ')}
          </p>
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
  const valoracionesVisibles = verMasValoraciones
    ? valoraciones
    : valoraciones.slice(0, 1)

  if (modo === 'perfil') {
    const servicioId = Number(servicioSeleccionado) || servicios[0]?.id
    const irASolicitar = () => {
      if (servicioId) navigate(`/presupuesto/${servicioId}`)
    }

    return (
      <main className="perfil-publico">
        <section className="perfil-publico-banner" aria-label="Información del profesional">
          <div className="perfil-publico-presentacion">
            <div className="perfil-publico-avatar">{inicial}</div>
            <div className="perfil-publico-identidad">
              <div className="perfil-publico-nombre">
                <h1>{profesional.nombre}</h1>
                {profesional.verificado && <span className="badge-verificado">Verificado</span>}
              </div>
              <p className="perfil-publico-oficio">{profesional.oficio || profesional.titulo || 'Profesional'}</p>
              <div className="perfil-publico-meta">
                {profesional.puntuacion > 0 && <span>{profesional.puntuacion} ★</span>}
                <span>{profesional.zona}</span>
                {profesional.disponibilidad && <span>{profesional.disponibilidad}</span>}
              </div>
            </div>
          </div>
          <div className="perfil-publico-sobre-mi">
            <h2>Sobre mí</h2>
            <p>{profesional.sobreMi || 'Este profesional todavía no agregó una descripción.'}</p>
          </div>
        </section>

        <nav className="perfil-publico-nav" aria-label="Secciones del perfil">
          <button type="button" aria-current={pestana === 'servicios' ? 'page' : undefined} onClick={() => setPestana('servicios')}>Servicios</button>
          <button type="button" aria-current={pestana === 'solicitar' ? 'page' : undefined} onClick={() => setPestana('solicitar')}>Solicitar servicios</button>
        </nav>

        {pestana === 'servicios' ? (
          <section className="perfil-publico-panel">
            <h2>Servicios ofrecidos</h2>
            {servicios.length === 0 ? (
              <p className="sin-resultados">Este profesional todavía no tiene servicios publicados.</p>
            ) : (
              <ul className="perfil-publico-servicios">
                {servicios.map((servicio) => (
                  <li key={servicio.id}>
                    <div>
                      <h3>{servicio.nombre}</h3>
                      {servicio.descripcion && <p>{servicio.descripcion}</p>}
                      <span>{servicio.precio == null ? 'Precio a consultar' : `$${Number(servicio.precio).toLocaleString('es-AR')}`}</span>
                    </div>
                    <button type="button" className="boton boton-naranja" onClick={() => {
                      setServicioSeleccionado(String(servicio.id))
                      setPestana('solicitar')
                    }}>Seleccionar</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="perfil-publico-valoraciones">
              <h2>Valoraciones</h2>
              {valoraciones.length === 0 ? (
                <p className="sin-valoraciones">Sin valoraciones todavía.</p>
              ) : (
                <ul className="lista-valoraciones">
                  {valoracionesVisibles.map((valoracion, index) => (
                    <li key={`${valoracion.usuario}-${index}`}>
                      <div className="valoracion-header">
                        <span className="valoracion-usuario">{valoracion.usuario}</span>
                        <span className="valoracion-puntuacion">{valoracion.puntuacion} ★</span>
                      </div>
                      <p className="valoracion-comentario">{valoracion.comentario}</p>
                    </li>
                  ))}
                </ul>
              )}
              {valoraciones.length > 1 && (
                <button className="ver-mas" onClick={() => setVerMasValoraciones(!verMasValoraciones)}>
                  {verMasValoraciones ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="perfil-publico-panel">
            <h2>¿Qué servicio necesitás?</h2>
            {servicios.length === 0 ? (
              <p className="sin-resultados">Este profesional todavía no tiene servicios publicados.</p>
            ) : (
              <>
                <label className="perfil-publico-selector">
                  <span>Elegí un servicio</span>
                  <select value={servicioId || ''} onChange={(event) => setServicioSeleccionado(event.target.value)}>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}{servicio.precio == null ? ' · Consultar precio' : ` · $${Number(servicio.precio).toLocaleString('es-AR')}`}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="boton-solicitar" onClick={irASolicitar}>
                  Solicitar presupuesto
                </button>
              </>
            )}
          </section>
        )}
      </main>
    )
  }

  return null
}

export default TarjetaProfesional