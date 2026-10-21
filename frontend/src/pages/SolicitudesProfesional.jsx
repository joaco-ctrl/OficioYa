import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function SolicitudesProfesional() {
  const [solicitudes, setSolicitudes] = useState([])
  const [respuestas, setRespuestas] = useState({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargar = () => api.get('/presupuestos/mis-solicitudes')
    .then(({ data }) => setSolicitudes(data))
    .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar las solicitudes.')))
    .finally(() => setCargando(false))

  useEffect(() => { cargar() }, [])

  const responder = async (solicitud) => {
    const respuesta = respuestas[solicitud.id] || {}
    if (!Number(respuesta.monto) || Number(respuesta.monto) <= 0) {
      setError('Ingresá un monto mayor que cero para responder.')
      return
    }
    setError('')
    setMensaje('')
    try {
      await api.put(`/presupuestos/${solicitud.id}`, {
        monto_estimado: Number(respuesta.monto),
        condiciones: respuesta.condiciones || undefined
      })
      setMensaje(`Presupuesto #${solicitud.id} respondido.`)
      await cargar()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo responder la solicitud.'))
    }
  }

  const rechazar = async (solicitud) => {
    setError('')
    setMensaje('')
    try {
      await api.patch(`/presupuestos/${solicitud.id}/rechazar`)
      setMensaje(`Solicitud #${solicitud.id} rechazada.`)
      await cargar()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo rechazar la solicitud.'))
    }
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header"><div><h1>Solicitudes de presupuesto</h1><p className="solicitudes-subtitulo">Revisá los pedidos y enviá una propuesta al cliente.</p></div></div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}
        {cargando ? <p className="sin-resultados">Cargando solicitudes...</p> : solicitudes.length === 0 ? (
          <p className="sin-resultados">No tenés solicitudes pendientes.</p>
        ) : (
          <div className="solicitudes-lista">
            {solicitudes.map((solicitud) => {
              const respuesta = respuestas[solicitud.id] || { monto: '', condiciones: '' }
              return (
                <article className="solicitud-card" key={solicitud.id}>
                  <div className="solicitud-card-header"><div className="solicitud-card-info"><h2>{solicitud.usuario_nombre} {solicitud.usuario_apellido}</h2><p>{solicitud.servicio_titulo}</p></div><span className={`estado-badge estado-${solicitud.estado}`}>{solicitud.estado}</span></div>
                  <div className="solicitud-card-body"><div className="solicitud-campo"><span className="solicitud-label">Pedido</span><span className="solicitud-valor">{solicitud.descripcion}</span></div>{solicitud.condiciones && <div className="solicitud-campo"><span className="solicitud-label">Detalles</span><span className="solicitud-valor">{solicitud.condiciones}</span></div>}</div>
                  {solicitud.estado === 'pendiente' && (
                    <div className="solicitud-card-body">
                      <label className="solicitud-campo"><span className="solicitud-label">Tu precio</span><input type="number" min="1" step="0.01" value={respuesta.monto} onChange={(event) => setRespuestas((actuales) => ({ ...actuales, [solicitud.id]: { ...respuesta, monto: event.target.value } }))} required /></label>
                      <label className="solicitud-campo"><span className="solicitud-label">Condiciones (opcional)</span><textarea rows="3" value={respuesta.condiciones} onChange={(event) => setRespuestas((actuales) => ({ ...actuales, [solicitud.id]: { ...respuesta, condiciones: event.target.value } }))} /></label>
                      <div className="solicitud-card-footer"><button className="boton boton-naranja" onClick={() => responder(solicitud)}>Enviar presupuesto</button><button className="encabezado-link" onClick={() => rechazar(solicitud)}>Rechazar</button></div>
                    </div>
                  )}
                  {solicitud.estado === 'respondido' && <div className="solicitud-card-body"><span className="solicitud-label">Precio enviado</span><strong>${Number(solicitud.monto_estimado).toLocaleString('es-AR')}</strong></div>}
                </article>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default SolicitudesProfesional
