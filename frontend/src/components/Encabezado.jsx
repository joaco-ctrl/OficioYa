import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import api from '../api/api.js'

const intervaloNotificaciones = 30000

function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')
  } catch {
    return null
  }
}

function contarNotificaciones(clave) {
  try {
    const notificaciones = JSON.parse(localStorage.getItem(clave) || 'null')
    return Object.values(notificaciones?.unread || {})
      .reduce((total, elementos) => total + (Array.isArray(elementos) ? elementos.length : 0), 0)
  } catch {
    return 0
  }
}

function leerNotificaciones(clave) {
  try {
    const notificaciones = JSON.parse(localStorage.getItem(clave) || 'null')
    return notificaciones && typeof notificaciones === 'object' ? notificaciones : null
  } catch {
    return null
  }
}

function crearSnapshot(elementos) {
  return Object.fromEntries(elementos.map((elemento) => [String(elemento.id), String(elemento.estado || '')]))
}

function notificarCambio(clave) {
  window.dispatchEvent(new CustomEvent('oficioya-notificaciones-cambiadas', { detail: { clave } }))
}

function Encabezado({ textoDerecha = '', rutaDerecha = -1, mostrarAuth = false }) {
  const navigate = useNavigate()
  const [logueado, setLogueado] = useState(() => Boolean(localStorage.getItem('oficioya_token')))
  const usuario = obtenerUsuario()
  const claveNotificaciones = `oficioya_notificaciones_${usuario?.rol}_${usuario?.id || usuario?.email || 'usuario'}`
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(() => contarNotificaciones(claveNotificaciones))

  useEffect(() => {
    const actualizar = (event) => {
      if (event.type === 'storage' && event.key !== claveNotificaciones) return
      if (event.type === 'oficioya-notificaciones-cambiadas' && event.detail?.clave !== claveNotificaciones) return
      setCantidadNotificaciones(contarNotificaciones(claveNotificaciones))
    }

    window.addEventListener('storage', actualizar)
    window.addEventListener('oficioya-notificaciones-cambiadas', actualizar)
    return () => {
      window.removeEventListener('storage', actualizar)
      window.removeEventListener('oficioya-notificaciones-cambiadas', actualizar)
    }
  }, [claveNotificaciones])

  useEffect(() => {
    if (!logueado || (usuario?.rol !== 'cliente' && usuario?.rol !== 'profesional')) return undefined

    let vigente = true
    let consultando = false
    const consultarNotificaciones = async () => {
      if (consultando) return
      consultando = true

      try {
        const respuestas = usuario.rol === 'profesional'
          ? await Promise.all([
            api.get('/presupuestos/mis-solicitudes'),
            api.get('/contratos/mis-servicios')
          ])
          : await Promise.all([
            api.get('/presupuestos/mis-presupuestos'),
            api.get('/contratos/mis-contratos')
          ])
        if (!vigente) return

        const snapshot = usuario.rol === 'profesional'
          ? {
            presupuestos: crearSnapshot(respuestas[0].data),
            trabajos: crearSnapshot(respuestas[1].data)
          }
          : {
            presupuestos: crearSnapshot(respuestas[0].data),
            contratos: crearSnapshot(respuestas[1].data)
          }
        const anterior = leerNotificaciones(claveNotificaciones)

        if (!anterior?.snapshot) {
          localStorage.setItem(claveNotificaciones, JSON.stringify({ snapshot, unread: {} }))
          notificarCambio(claveNotificaciones)
          return
        }

        const unread = { ...(anterior.unread || {}) }
        Object.entries(snapshot).forEach(([categoria, estados]) => {
          const estadosAnteriores = anterior.snapshot[categoria] || {}
          const elementosSinLeer = new Set(unread[categoria] || [])
          Object.entries(estados).forEach(([id, estado]) => {
            if (
              estadosAnteriores[id] === undefined
                ? categoria === 'trabajos' || (usuario.rol === 'profesional' && categoria === 'presupuestos')
                : estadosAnteriores[id] !== estado
            ) {
              elementosSinLeer.add(id)
            }
          })
          unread[categoria] = [...elementosSinLeer]
        })

        localStorage.setItem(claveNotificaciones, JSON.stringify({ snapshot, unread }))
        notificarCambio(claveNotificaciones)
      } catch (error) {
        console.error('No se pudieron consultar las notificaciones del perfil.', error)
      } finally {
        consultando = false
      }
    }

    consultarNotificaciones()
    const intervalo = window.setInterval(consultarNotificaciones, intervaloNotificaciones)
    const alVolver = () => {
      if (document.visibilityState === 'visible') consultarNotificaciones()
    }
    document.addEventListener('visibilitychange', alVolver)

    return () => {
      vigente = false
      window.clearInterval(intervalo)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [claveNotificaciones, logueado, usuario?.rol])

  const handleClick = () => {
    if (rutaDerecha === -1) navigate(-1)
    else navigate(rutaDerecha)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('oficioya_token')
    localStorage.removeItem('oficioya_usuario')
    setLogueado(false)
    navigate('/')
  }

  return (
    <header className="encabezado">
      <Link to="/" className="encabezado-logo">
        <img src={logo} alt="OficioYa" />
        <span className="logo-texto">
          OFICIO<span className="logo-ya">YA</span>
        </span>
      </Link>

      <div className="encabezado-derecha">
        {/* Si NO está logueado → Iniciar Sesión + Registrarse */}
        {mostrarAuth && !logueado && (
          <>

            <Link to="/" className="encabezado-link">Inicio</Link>
            <Link to="/inicio-sesion" className="encabezado-link">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="encabezado-boton">
              Registrarse
            </Link>
          </>
        )}
        {logueado && (
          <>
            <Link to="/inicio" className="encabezado-link">Inicio</Link>
            <Link
              to="/mi-perfil"
              className="encabezado-link encabezado-link-perfil"
              aria-label={cantidadNotificaciones ? `Mi perfil, ${cantidadNotificaciones} novedades sin revisar` : 'Mi perfil'}
            >
              Mi perfil
              {cantidadNotificaciones > 0 && (
                <span className="perfil-nav-notificacion" aria-hidden="true">
                  {cantidadNotificaciones > 9 ? '9+' : cantidadNotificaciones}
                </span>
              )}
            </Link>
            <button className="encabezado-link" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}

        {/* Botón de acción (Volver, etc.) */}
        {!mostrarAuth && textoDerecha && (
          <button className="encabezado-accion" onClick={handleClick}>
            {textoDerecha}
          </button>
        )}
      </div>
    </header>
  )
}

export default Encabezado