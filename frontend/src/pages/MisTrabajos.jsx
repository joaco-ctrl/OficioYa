import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function MisTrabajos() {
  const [contratos, setContratos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarContratos = () => api.get('/contratos/mis-servicios')
    .then(({ data }) => setContratos(data))
    .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar tus trabajos.')))
    .finally(() => setCargando(false))

  useEffect(() => { cargarContratos() }, [])

  const cambiarEstado = async (contrato, accion) => {
    setError('')
    setMensaje('')
    try {
      const { data } = await api.patch(`/contratos/${contrato.id}/${accion}`)
      setMensaje(data.mensaje)
      await cargarContratos()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo actualizar la contratación.'))
    }
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header"><div><h1>Mis trabajos</h1><p className="solicitudes-subtitulo">Actualizá el estado de las contrataciones aceptadas.</p></div></div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}
        {cargando ? <p className="sin-resultados">Cargando trabajos...</p> : contratos.length === 0 ? (
          <p className="sin-resultados">Todavía no tenés trabajos contratados.</p>
        ) : (
          <div className="solicitudes-lista">
            {contratos.map((contrato) => (
              <article className="solicitud-card" key={contrato.id}>
                <div className="solicitud-card-header">
                  <div className="solicitud-card-info"><h2>{contrato.usuario_nombre} {contrato.usuario_apellido}</h2><p>{contrato.servicio_titulo}</p></div>
                  <span className={`estado-badge estado-${contrato.estado}`}>{contrato.estado.replace('_', ' ')}</span>
                </div>
                <div className="solicitud-card-body">
                  <div className="solicitud-campo"><span className="solicitud-label">Monto acordado</span><span className="solicitud-valor">{contrato.monto_acordado == null ? 'A definir' : `$${Number(contrato.monto_acordado).toLocaleString('es-AR')}`}</span></div>
                  <div className="solicitud-campo"><span className="solicitud-label">Contratación</span><span className="solicitud-valor">#{contrato.id}</span></div>
                </div>
                <div className="solicitud-card-footer">
                  {contrato.estado === 'pendiente' && <button className="boton boton-naranja" onClick={() => cambiarEstado(contrato, 'iniciar')}>Iniciar trabajo</button>}
                  {contrato.estado === 'en_proceso' && <button className="boton boton-naranja" onClick={() => cambiarEstado(contrato, 'finalizar')}>Marcar como terminado</button>}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default MisTrabajos
