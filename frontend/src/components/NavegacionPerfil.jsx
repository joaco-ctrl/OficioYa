import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import api from '../api/api.js'

const perfilesCache = new Map()

function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')
  } catch {
    return null
  }
}

function obtenerClavePerfil(usuario) {
  return `${usuario?.rol}_${usuario?.id || usuario?.email || 'usuario'}`
}

export function actualizarPerfilResumen(perfil) {
  const clave = obtenerClavePerfil(obtenerUsuario())
  const perfilActualizado = { ...perfilesCache.get(clave), ...perfil }
  perfilesCache.set(clave, perfilActualizado)
  window.dispatchEvent(new CustomEvent('oficioya-perfil-actualizado', {
    detail: { clave, perfil: perfilActualizado }
  }))
}

function leerNotificaciones(clave) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave) || 'null')
    return guardado && typeof guardado === 'object' ? guardado : null
  } catch {
    return null
  }
}

function notificarCambio(clave) {
  window.dispatchEvent(new CustomEvent('oficioya-notificaciones-cambiadas', { detail: { clave } }))
}

function contarNotificaciones(clave) {
  const notificaciones = leerNotificaciones(clave)
  return Object.fromEntries(
    ['presupuestos', 'contratos', 'trabajos'].map((categoria) => [
      categoria,
      notificaciones?.unread?.[categoria]?.length || 0
    ])
  )
}

function NavegacionPerfil() {
  const usuario = obtenerUsuario()
  const rol = usuario?.rol
  const clavePerfil = obtenerClavePerfil(usuario)
  const location = useLocation()
  const esPaginaPerfil = location.pathname === '/mi-perfil'
  const [perfil, setPerfil] = useState(() => (
    perfilesCache.get(clavePerfil) || { email: usuario?.email || '' }
  ))
  const claveNotificaciones = `oficioya_notificaciones_${rol}_${usuario?.id || usuario?.email || 'usuario'}`
  const [notificaciones, setNotificaciones] = useState(() => contarNotificaciones(claveNotificaciones))
  
  useEffect(() => {
    if (perfilesCache.has(clavePerfil)) return

    const ruta = rol === 'profesional' ? '/profesionales/mi-perfil' : '/auth/mi-perfil'
    api.get(ruta)
      .then(({ data }) => {
        const perfilCargado = data.perfil || data
        perfilesCache.set(clavePerfil, perfilCargado)
        setPerfil(perfilCargado)
      })
      .catch(() => {})
  }, [clavePerfil, rol])

  useEffect(() => {
    const actualizar = (event) => {
      if (event.detail?.clave === clavePerfil) setPerfil(event.detail.perfil)
    }

    window.addEventListener('oficioya-perfil-actualizado', actualizar)
    return () => window.removeEventListener('oficioya-perfil-actualizado', actualizar)
  }, [clavePerfil])

  useEffect(() => {
    const actualizar = (event) => {
      if (event.type === 'storage' && event.key !== claveNotificaciones) return
      if (event.type === 'oficioya-notificaciones-cambiadas' && event.detail?.clave !== claveNotificaciones) return
      setNotificaciones(contarNotificaciones(claveNotificaciones))
    }

    window.addEventListener('storage', actualizar)
    window.addEventListener('oficioya-notificaciones-cambiadas', actualizar)
    return () => {
      window.removeEventListener('storage', actualizar)
      window.removeEventListener('oficioya-notificaciones-cambiadas', actualizar)
    }
  }, [claveNotificaciones])

  const marcarLeidas = (categoria) => {
    const anterior = leerNotificaciones(claveNotificaciones)
    if (!anterior?.unread?.[categoria]?.length) return

    const unread = { ...anterior.unread, [categoria]: [] }
    localStorage.setItem(claveNotificaciones, JSON.stringify({ ...anterior, unread }))
    notificarCambio(claveNotificaciones)
    setNotificaciones((actuales) => ({ ...actuales, [categoria]: 0 }))
  }

  const indicador = (categoria) => notificaciones[categoria] > 0 && (
    <span className="perfil-nav-notificacion" aria-label={`${notificaciones[categoria]} novedades sin revisar`}>
      {notificaciones[categoria] > 9 ? '9+' : notificaciones[categoria]}
    </span>
  )

  return (
    <>
      <section className="perfil-resumen" aria-label="Resumen del perfil">
        <div className="perfil-resumen-avatar" aria-hidden="true">
          {(perfil.nombre || usuario?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="perfil-resumen-contenido">
          <span className="perfil-resumen-rol">
            {rol === 'profesional' ? 'Profesional' : rol === 'administrador' ? 'Administrador' : 'Cliente'}
          </span>
          {esPaginaPerfil ? (
            <h1>{`${perfil.nombre || ''} ${perfil.apellido || ''}`.trim() || 'Mi perfil'}</h1>
          ) : (
            <h2>{`${perfil.nombre || ''} ${perfil.apellido || ''}`.trim() || 'Mi perfil'}</h2>
          )}
          <p>{perfil.email || usuario?.email}</p>
          <div className="perfil-resumen-detalles">
            {perfil.telefono && <span>{perfil.telefono}</span>}
            {rol === 'profesional' && perfil.zona && <span>{perfil.zona}</span>}
            {rol === 'profesional' && perfil.disponibilidad && <span>{perfil.disponibilidad}</span>}
          </div>
        </div>
      </section>
      <nav className="perfil-nav" aria-label="Navegación del perfil">
        {rol === 'administrador' ? (
          <>
            <NavLink to="/admin/reportes">Ver reportes</NavLink>
            <NavLink to="/admin/categorias">Crear categorías</NavLink>
          </>
        ) : rol === 'profesional' ? (
          <>
            <NavLink to="/solicitudes-profesional" className="perfil-nav-enlace" onClick={() => marcarLeidas('presupuestos')}>
              Ver pedidos{indicador('presupuestos')}
            </NavLink>
            <NavLink to="/mis-trabajos" className="perfil-nav-enlace" onClick={() => marcarLeidas('trabajos')}>
              Ver contratos{indicador('trabajos')}
            </NavLink>
            <NavLink to="/mis-reportes">Ver reportes</NavLink>
            <Link to="/mi-perfil?tab=perfil" aria-current={location.pathname === '/mi-perfil' && (!location.search || location.search === '?tab=perfil') ? 'page' : undefined}>Actualizar perfil</Link>
            <Link to="/mi-perfil?tab=servicios" aria-current={location.pathname === '/mi-perfil' && location.search === '?tab=servicios' ? 'page' : undefined}>Mis servicios</Link>
            <Link to="/mi-perfil?tab=crear-servicio" aria-current={location.pathname === '/mi-perfil' && location.search === '?tab=crear-servicio' ? 'page' : undefined}>Crear servicios</Link>
          </>
        ) : (
          <>
            <NavLink to="/mis-solicitudes" className="perfil-nav-enlace" onClick={() => marcarLeidas('presupuestos')}>
              Ver pedidos{indicador('presupuestos')}
            </NavLink>
            <NavLink to="/mis-contratos" className="perfil-nav-enlace" onClick={() => marcarLeidas('contratos')}>
              Ver contratos{indicador('contratos')}
            </NavLink>
            <NavLink to="/mis-reportes">Ver reportes</NavLink>
          </>
        )}
      </nav>
    </>
  )
}

export default NavegacionPerfil
