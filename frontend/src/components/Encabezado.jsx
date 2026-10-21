import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Encabezado({ textoDerecha = '', rutaDerecha = -1, mostrarAuth = false }) {
  const navigate = useNavigate()
  const [logueado, setLogueado] = useState(() => Boolean(localStorage.getItem('oficioya_token')))

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
            <Link to="/mi-perfil" className="encabezado-link">Mi perfil</Link>
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