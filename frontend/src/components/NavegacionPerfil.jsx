import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import api from '../api/api.js'

function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')
  } catch {
    return null
  }
}

function NavegacionPerfil() {
  const usuario = obtenerUsuario()
  const rol = usuario?.rol
  const location = useLocation()
  const esPaginaPerfil = location.pathname === '/mi-perfil'
  const [perfil, setPerfil] = useState({ email: usuario?.email || '' })

  useEffect(() => {
    const ruta = rol === 'profesional' ? '/profesionales/mi-perfil' : '/auth/mi-perfil'
    api.get(ruta)
      .then(({ data }) => setPerfil(data.perfil || data))
      .catch(() => {})
  }, [rol])

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
            <NavLink to="/solicitudes-profesional">Ver pedidos</NavLink>
            <NavLink to="/mis-trabajos">Ver contratos</NavLink>
            <Link to="/mi-perfil?tab=perfil" aria-current={location.pathname === '/mi-perfil' && (!location.search || location.search === '?tab=perfil') ? 'page' : undefined}>Actualizar perfil</Link>
            <Link to="/mi-perfil?tab=servicios" aria-current={location.pathname === '/mi-perfil' && location.search === '?tab=servicios' ? 'page' : undefined}>Mis servicios</Link>
            <Link to="/mi-perfil?tab=crear-servicio" aria-current={location.pathname === '/mi-perfil' && location.search === '?tab=crear-servicio' ? 'page' : undefined}>Crear servicios</Link>
          </>
        ) : (
          <>
            <NavLink to="/mis-solicitudes">Ver pedidos</NavLink>
            <NavLink to="/mis-contratos">Ver contratos</NavLink>
          </>
        )}
      </nav>
    </>
  )
}

export default NavegacionPerfil
