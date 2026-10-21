import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

const estados = ['todas', 'pendiente', 'respondido', 'aceptado', 'rechazado']

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const valor = new Date(fecha)
  return Number.isNaN(valor.getTime()) ? '—' : valor.toLocaleDateString('es-AR')
}

function MisSolicitudes() {
  const navigate = useNavigate()
  const [solicitudes, setSolicitudes] = useState([])
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aceptando, setAceptando] = useState(null)

  useEffect(() => {
    let vigente = true

    if (!localStorage.getItem('oficioya_token')) {
      setCargando(false)
      return () => {
        vigente = false
      }
    }

    api.get('/presupuestos/mis-presupuestos')
      .then(({ data }) => {
        if (vigente) setSolicitudes(data)
      })
      .catch((requestError) => {
        if (vigente) setError(mensajeError(requestError, 'No se pudieron cargar tus solicitudes.'))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [])

  const solicitudesFiltradas = solicitudes.filter(
    (solicitud) => filtroEstado === 'todas' || solicitud.estado === filtroEstado
  )
  const formatearPrecio = (precio) => (
    precio == null ? 'A definir' : `$${Number(precio).toLocaleString('es-AR')}`
  )

  const aceptarPresupuesto = async (solicitud) => {
    setError('')
    setAceptando(solicitud.id)
    try {
      await api.patch(`/presupuestos/${solicitud.id}/aceptar`)
      navigate('/mis-contratos')
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo aceptar el presupuesto.'))
    } finally {
      setAceptando(null)
    }
  }

  return (
    <>
      <Encabezado mostrarAuth={true} />
      <NavegacionPerfil />
      <div className="solicitudes-contenedor">
        <div className="solicitudes-header">
          <div>
            <h2>Mis solicitudes</h2>
            <p className="solicitudes-subtitulo">
              Estas son las solicitudes de presupuesto que enviaste a los profesionales.
            </p>
          </div>
        </div>

        {!localStorage.getItem('oficioya_token') && (
          <p role="alert" className="sin-resultados">
            Iniciá sesión como cliente para consultar tus solicitudes.{' '}
            <Link to="/inicio-sesion" className="link-naranja">Iniciar sesión</Link>
          </p>
        )}
        {error && <p role="alert" className="sin-resultados">{error}</p>}

        <div className="solicitudes-filtros">
          {estados.map((estado) => (
            <button
              key={estado}
              className={`filtro-estado ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado === 'todas' ? 'Todas' : estado[0].toUpperCase() + estado.slice(1)}
              {' '}({estado === 'todas'
                ? solicitudes.length
                : solicitudes.filter((solicitud) => solicitud.estado === estado).length})
            </button>
          ))}
        </div>

        <div className="solicitudes-lista">
          {cargando ? (
            <p className="sin-resultados">Cargando solicitudes...</p>
          ) : !error && solicitudesFiltradas.length === 0 ? (
            <div className="solicitudes-vacio">
              <p>No tenés solicitudes {filtroEstado !== 'todas' ? `en estado ${filtroEstado}` : ''}.</p>
              <button
                className="boton boton-naranja"
                onClick={() => navigate('/resultados')}
              >
                Buscar profesionales
              </button>
            </div>
          ) : (
            solicitudesFiltradas.map((solicitud) => (
              <div key={solicitud.id} className="solicitud-card">
                <div className="solicitud-card-header">
                  <div className="solicitud-card-info">
                    <h3>{solicitud.profesional_nombre} {solicitud.profesional_apellido}</h3>
                    <p>{solicitud.servicio_titulo}</p>
                  </div>
                  <span className={`estado-badge estado-${solicitud.estado}`}>
                    {solicitud.estado}
                  </span>
                </div>

                <div className="solicitud-card-body">
                  <div className="solicitud-campo">
                    <span className="solicitud-label">Descripción</span>
                    <span className="solicitud-valor">{solicitud.descripcion}</span>
                  </div>
                  {solicitud.condiciones && (
                    <div className="solicitud-campo">
                      <span className="solicitud-label">Detalles</span>
                      <span className="solicitud-valor">{solicitud.condiciones}</span>
                    </div>
                  )}
                  <div className="solicitud-campo">
                    <span className="solicitud-label">Monto estimado</span>
                    <span className="solicitud-valor solicitud-precio">
                      {formatearPrecio(solicitud.monto_estimado)}
                    </span>
                  </div>
                </div>

                <div className="solicitud-card-footer">
                  <span className="solicitud-fecha">
                    Enviada el {formatearFecha(solicitud.created_at)}
                  </span>
                  {solicitud.estado === 'respondido' && (
                    <button
                      className="boton boton-naranja"
                      disabled={aceptando === solicitud.id}
                      onClick={() => aceptarPresupuesto(solicitud)}
                    >
                      {aceptando === solicitud.id ? 'Aceptando...' : 'Aceptar presupuesto'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default MisSolicitudes
