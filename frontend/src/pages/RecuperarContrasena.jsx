import { useState } from 'react'
import { Link } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function RecuperarContrasena() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const solicitarEnlace = async (event) => {
    event.preventDefault()
    setMensaje('')
    setError('')
    setEnviando(true)

    try {
      const { data } = await api.post('/auth/recuperar-contrasena', { email })
      setMensaje(data.mensaje)
    } catch (requestError) {
      setError(requestError.response?.status === 404
        ? 'El backend que está corriendo no tiene habilitada la recuperación de contraseña. Reiniciá el backend desde la carpeta backend/src y volvé a intentar.'
        : mensajeError(requestError, 'No se pudo procesar la solicitud. Intentá nuevamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="480px">
          <h1>Recuperar contraseña</h1>
          <p className="registro-intro">
            Ingresá el correo asociado a tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
          </p>
          {mensaje ? (
            <p role="status" className="sin-resultados">{mensaje}</p>
          ) : (
            <form onSubmit={solicitarEnlace}>
              <CampoTexto
                label="CORREO ELECTRÓNICO"
                nombre="email"
                tipo="email"
                valor={email}
                onChange={(event) => setEmail(event.target.value)}
                requerido
              />
              {error && <p role="alert" className="sin-resultados">{error}</p>}
              <Boton texto={enviando ? 'ENVIANDO...' : 'Enviar enlace'} tipo="submit" variante="azul" />
            </form>
          )}
          <p className="registro-link">
            <Link to="/inicio-sesion" className="link-naranja">Volver a inicio de sesión</Link>
          </p>
        </Tarjeta>
      </div>
    </>
  )
}

export default RecuperarContrasena
