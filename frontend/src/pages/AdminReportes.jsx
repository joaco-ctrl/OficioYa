import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function AdminReportes() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarReportes = () => api.get('/reportes/pendientes')
    .then(({ data }) => setReportes(data))
    .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar los reportes.')))
    .finally(() => setCargando(false))

  useEffect(() => { cargarReportes() }, [])

  const resolver = async (reporte, estado) => {
    setError('')
    setMensaje('')
    try {
      await api.patch(`/reportes/${reporte.id}`, { estado })
      setMensaje(`Reporte #${reporte.id} ${estado === 'resuelto' ? 'resuelto' : 'desestimado'}.`)
      await cargarReportes()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo actualizar el reporte.'))
    }
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header"><div><h1>Reportes pendientes</h1><p className="solicitudes-subtitulo">Revisá los problemas informados por clientes durante una contratación.</p></div></div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}
        {cargando ? <p className="sin-resultados">Cargando reportes...</p> : reportes.length === 0 ? (
          <p className="sin-resultados">No hay reportes pendientes.</p>
        ) : (
          <div className="solicitudes-lista">
            {reportes.map((reporte) => (
              <article className="solicitud-card" key={reporte.id}>
                <div className="solicitud-card-header">
                  <div className="solicitud-card-info"><h2>Reporte #{reporte.id} · Contratación #{reporte.contratacion_id}</h2><p>{reporte.servicio_titulo}</p></div>
                  <span className="estado-badge estado-pendiente">Pendiente</span>
                </div>
                <div className="solicitud-card-body">
                  <div className="solicitud-campo"><span className="solicitud-label">Cliente</span><span className="solicitud-valor">{reporte.usuario_nombre} {reporte.usuario_apellido}</span></div>
                  <div className="solicitud-campo"><span className="solicitud-label">Profesional</span><span className="solicitud-valor">{reporte.profesional_nombre} {reporte.profesional_apellido}</span></div>
                  <div className="solicitud-campo"><span className="solicitud-label">Problema</span><span className="solicitud-valor">{reporte.descripcion}</span></div>
                  <div className="solicitud-campo"><span className="solicitud-label">Fecha</span><span className="solicitud-valor">{reporte.created_at ? new Date(reporte.created_at).toLocaleString('es-AR') : '—'}</span></div>
                </div>
                <div className="solicitud-card-footer"><button className="boton boton-naranja" onClick={() => resolver(reporte, 'resuelto')}>Marcar resuelto</button><button className="encabezado-link" onClick={() => resolver(reporte, 'desestimado')}>Desestimar</button></div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default AdminReportes
