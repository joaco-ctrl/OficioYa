import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function MisContratos() {
  const [contratos, setContratos] = useState([])
  const [reportes, setReportes] = useState({})
  const [valoraciones, setValoraciones] = useState({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarContratos = () => api.get('/contratos/mis-contratos')
    .then(({ data }) => setContratos(data))
    .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar tus contrataciones.')))
    .finally(() => setCargando(false))

  useEffect(() => { cargarContratos() }, [])

  const reportarProblema = async (contratoId) => {
    setError('')
    setMensaje('')
    try {
      await api.post('/reportes', {
        contratacion_id: contratoId,
        descripcion: reportes[contratoId]?.descripcion || ''
      })
      setMensaje(`Reporte enviado para la contratación #${contratoId}.`)
      setReportes((actuales) => ({ ...actuales, [contratoId]: { ...actuales[contratoId], enviado: true } }))
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo enviar el reporte.'))
    }
  }

  const enviarValoracion = async (contratoId) => {
    setError('')
    setMensaje('')
    const valoracion = valoraciones[contratoId] || { puntuacion: 5, comentario: '' }
    try {
      await api.post('/valoraciones', {
        contratacion_id: contratoId,
        puntuacion: Number(valoracion.puntuacion),
        comentario: valoracion.comentario
      })
      setMensaje(`Gracias por valorar la contratación #${contratoId}.`)
      await cargarContratos()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo guardar la valoración.'))
    }
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header">
          <div>
            <h1>Mis contrataciones</h1>
            <p className="solicitudes-subtitulo">Seguí el estado, reportá inconvenientes durante el trabajo y valorá al finalizar.</p>
          </div>
        </div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}
        {cargando ? <p className="sin-resultados">Cargando contrataciones...</p> : contratos.length === 0 ? (
          <div className="solicitudes-vacio">
            <p>Todavía no tenés contrataciones.</p>
            <Link className="boton boton-naranja" to="/resultados">Buscar profesionales</Link>
          </div>
        ) : (
          <div className="solicitudes-lista">
            {contratos.map((contrato) => {
              const reporte = reportes[contrato.id] || { descripcion: '', enviado: false }
              const valoracion = valoraciones[contrato.id] || { puntuacion: 5, comentario: '' }
              return (
                <article className="solicitud-card" key={contrato.id}>
                  <div className="solicitud-card-header">
                    <div className="solicitud-card-info">
                      <h2>{contrato.profesional_nombre} {contrato.profesional_apellido}</h2>
                      <p>{contrato.servicio_titulo}</p>
                    </div>
                    <span className={`estado-badge estado-${contrato.estado}`}>{contrato.estado.replace('_', ' ')}</span>
                  </div>
                  <div className="solicitud-card-body">
                    <div className="solicitud-campo"><span className="solicitud-label">Monto acordado</span><span className="solicitud-valor">{contrato.monto_acordado == null ? 'A definir' : `$${Number(contrato.monto_acordado).toLocaleString('es-AR')}`}</span></div>
                    <div className="solicitud-campo"><span className="solicitud-label">Contratación</span><span className="solicitud-valor">#{contrato.id}</span></div>
                  </div>
                  {contrato.estado === 'en_proceso' && (
                    <div className="solicitud-card-body">
                      <label className="solicitud-campo">
                        <span className="solicitud-label">Reportar un problema</span>
                        <textarea rows="3" value={reporte.descripcion} disabled={reporte.enviado} onChange={(event) => setReportes((actuales) => ({ ...actuales, [contrato.id]: { ...reporte, descripcion: event.target.value } }))} placeholder="Describí el inconveniente" />
                      </label>
                      <button className="boton boton-naranja" type="button" disabled={reporte.enviado || !reporte.descripcion.trim()} onClick={() => reportarProblema(contrato.id)}>{reporte.enviado ? 'Reporte enviado' : 'Enviar reporte'}</button>
                    </div>
                  )}
                  {contrato.estado === 'finalizado' && (
                    <div className="solicitud-card-body">
                      {contrato.valoracion_id ? (
                        <p role="status">Tu valoración: {contrato.valoracion_puntuacion} ★ {contrato.valoracion_comentario && `· ${contrato.valoracion_comentario}`}</p>
                      ) : (
                        <>
                          <label className="solicitud-campo">
                            <span className="solicitud-label">Tu calificación</span>
                            <select value={valoracion.puntuacion} onChange={(event) => setValoraciones((actuales) => ({ ...actuales, [contrato.id]: { ...valoracion, puntuacion: event.target.value } }))}>
                              {[5, 4, 3, 2, 1].map((puntos) => <option value={puntos} key={puntos}>{puntos} estrellas</option>)}
                            </select>
                          </label>
                          <label className="solicitud-campo">
                            <span className="solicitud-label">Comentario</span>
                            <textarea rows="3" value={valoracion.comentario} onChange={(event) => setValoraciones((actuales) => ({ ...actuales, [contrato.id]: { ...valoracion, comentario: event.target.value } }))} placeholder="¿Cómo fue el trabajo?" />
                          </label>
                          <button className="boton boton-naranja" type="button" onClick={() => enviarValoracion(contrato.id)}>Guardar valoración</button>
                        </>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default MisContratos
