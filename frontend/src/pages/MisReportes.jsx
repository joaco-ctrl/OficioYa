import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

const estadosReporte = {
  pendiente: { etiqueta: 'Pendiente', clase: 'estado-pendiente' },
  resuelto: { etiqueta: 'Resuelto', clase: 'estado-aceptado' },
  desestimado: { etiqueta: 'Desestimado', clase: 'estado-rechazado' }
}

function usuarioEsProfesional() {
  try {
    return JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')?.rol === 'profesional'
  } catch {
    return false
  }
}

function MisReportes() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/reportes/mis-reportes')
      .then(({ data }) => setReportes(data))
      .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar tus reportes.')))
      .finally(() => setCargando(false))
  }, [])

  const esProfesional = usuarioEsProfesional()

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header">
          <div>
            <h1>Mis reportes</h1>
            <p className="solicitudes-subtitulo">Consultá el estado de los problemas informados al administrador.</p>
          </div>
        </div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {cargando ? <p className="sin-resultados">Cargando reportes...</p> : reportes.length === 0 ? (
          <p className="sin-resultados">Todavía no hay reportes para mostrar.</p>
        ) : (
          <div className="solicitudes-lista">
            {reportes.map((reporte) => {
              const estado = estadosReporte[reporte.estado] || { etiqueta: reporte.estado, clase: 'estado-pendiente' }
              const contraparte = esProfesional
                ? `${reporte.usuario_nombre || ''} ${reporte.usuario_apellido || ''}`.trim()
                : `${reporte.profesional_nombre || ''} ${reporte.profesional_apellido || ''}`.trim()

              return (
                <article className="solicitud-card" key={reporte.id}>
                  <div className="solicitud-card-header">
                    <div className="solicitud-card-info">
                      <h2>Reporte #{reporte.id} · Contratación #{reporte.contratacion_id}</h2>
                      <p>{reporte.servicio_titulo}</p>
                    </div>
                    <span className={`estado-badge ${estado.clase}`}>{estado.etiqueta}</span>
                  </div>
                  <div className="solicitud-card-body">
                    <div className="solicitud-campo">
                      <span className="solicitud-label">{esProfesional ? 'Cliente' : 'Profesional'}</span>
                      <span className="solicitud-valor">{contraparte || '—'}</span>
                    </div>
                    <div className="solicitud-campo">
                      <span className="solicitud-label">Fecha del reporte</span>
                      <span className="solicitud-valor">{reporte.created_at ? new Date(reporte.created_at).toLocaleString('es-AR') : '—'}</span>
                    </div>
                    <div className="solicitud-campo">
                      <span className="solicitud-label">Problema informado</span>
                      <span className="solicitud-valor">{reporte.descripcion}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default MisReportes
