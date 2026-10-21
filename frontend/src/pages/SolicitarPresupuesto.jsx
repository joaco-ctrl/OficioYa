import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function SolicitarPresupuesto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [servicio, setServicio] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [datos, setDatos] = useState({
    descripcion: '',
    direccion: '',
    fecha: '',
    presupuesto: ''
  })

  useEffect(() => {
    let vigente = true

    api.get(`/servicios/${id}`)
      .then(({ data }) => {
        if (vigente) setServicio(data)
      })
      .catch((requestError) => {
        if (vigente) setError(mensajeError(requestError, 'No se pudo cargar el servicio.'))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [id])

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!localStorage.getItem('oficioya_token')) {
      setError('Iniciá sesión como cliente para enviar una solicitud.')
      return
    }

    const condiciones = [
      datos.direccion && `Dirección: ${datos.direccion}`,
      datos.fecha && `Fecha estimada: ${datos.fecha}`
    ].filter(Boolean).join('\n')

    setEnviando(true)
    try {
      await api.post('/presupuestos', {
        servicio_id: Number(id),
        descripcion: datos.descripcion,
        condiciones: condiciones || undefined,
        monto_estimado: datos.presupuesto ? Number(datos.presupuesto) : undefined
      })
      navigate('/mis-solicitudes')
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo enviar la solicitud.'))
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <>
        <Encabezado mostrarAuth={true} />
        <p className="sin-resultados">Cargando servicio...</p>
      </>
    )
  }

  if (error && !servicio) {
    return (
      <>
        <Encabezado mostrarAuth={true} />
        <div className="seccion perfil-error" role="alert">
          <p>{error}</p>
          <button className="boton boton-naranja" onClick={() => navigate('/resultados')}>
            Volver a resultados
          </button>
        </div>
      </>
    )
  }

  const inicial = servicio.profesional_nombre.charAt(0).toUpperCase()

  return (
    <>
      <Encabezado mostrarAuth={true} />

      <button className="volver-resultados" onClick={() => navigate(-1)}>
        ← VOLVER AL PERFIL
      </button>

      <div className="solicitud-contenedor">
        <div className="solicitud-resumen">
          <div className="solicitud-avatar">{inicial}</div>
          <div>
            <h3>{servicio.profesional_nombre} {servicio.profesional_apellido}</h3>
            <p>{servicio.titulo}</p>
            <p className="solicitud-zona">{servicio.zona}</p>
          </div>
        </div>

        <Tarjeta ancho="720px">
          <h1>Solicitar presupuesto</h1>
          <p className="solicitud-intro">
            Contale al profesional qué necesitás. Cuanto más detalle, mejor va a ser el presupuesto.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="descripcion">Descripción del trabajo</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={datos.descripcion}
                onChange={handleChange}
                placeholder="Ej: Necesito reparar una pérdida en el baño."
                rows={5}
                required
              />
            </div>

            <CampoTexto label="Dirección del trabajo" nombre="direccion" valor={datos.direccion} onChange={handleChange} />
            <CampoTexto label="Fecha estimada" nombre="fecha" tipo="date" valor={datos.fecha} onChange={handleChange} />
            <CampoTexto
              label="Presupuesto estimado (opcional)"
              nombre="presupuesto"
              tipo="number"
              valor={datos.presupuesto}
              onChange={handleChange}
            />

            {error && (
              <p role="alert" className="sin-resultados">
                {error}{' '}
                {!localStorage.getItem('oficioya_token') && (
                  <Link
                    to="/inicio-sesion"
                    state={{ from: location.pathname }}
                    className="link-naranja"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </p>
            )}
            <Boton texto={enviando ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'} tipo="submit" variante="naranja" />
          </form>
        </Tarjeta>
      </div>
    </>
  )
}

export default SolicitarPresupuesto
