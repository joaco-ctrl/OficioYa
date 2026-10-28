import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function InicioSesion() {
  const navigate = useNavigate()
  const location = useLocation()
  const [datos, setDatos] = useState({ email: '', contrasena: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const { data } = await api.post('/auth/login', {
        email: datos.email,
        password: datos.contrasena
      })
      localStorage.setItem('oficioya_token', data.token)
      localStorage.setItem('oficioya_usuario', JSON.stringify(data.usuario))
      const destino = location.state?.from || '/'
      navigate(destino, { replace: true })
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo iniciar sesión.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="480px">
          <h1>Inicio de Sesión</h1>
          {location.state?.mensaje && (
            <p role="status" className="sin-resultados">{location.state.mensaje}</p>
          )}
          <form onSubmit={handleSubmit}>
            <CampoTexto
              label="CORREO ELECTRÓNICO"
              nombre="email"
              tipo="email"
              valor={datos.email}
              onChange={handleChange}
              requerido
            />
            <CampoTexto
              label="CONTRASEÑA"
              nombre="contrasena"
              tipo="password"
              valor={datos.contrasena}
              onChange={handleChange}
              requerido
            />
            {error && <p role="alert" className="sin-resultados">{error}</p>}
            <div className="inicio-sesion-acciones">
              <Boton texto={enviando ? 'INGRESANDO...' : 'Ingresar'} tipo="submit" variante="azul" />
              <Link to="/registro" className="boton boton-naranja">
                Crear una cuenta
              </Link>
            </div>
          </form>
          <p className="registro-link">
            ¿olvidaste tu contraseña?{' '}
            <Link to="/recuperar-contrasena" className="link-naranja">
              Recupérala acá
            </Link>
          </p>
        </Tarjeta>
      </div>
    </>
  )
}

export default InicioSesion