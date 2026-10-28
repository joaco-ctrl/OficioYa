import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function RestablecerContrasena() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [datos, setDatos] = useState({ contrasena: '', confirmarContrasena: '' })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiarCampo = (event) => {
    setDatos((actuales) => ({ ...actuales, [event.target.name]: event.target.value }))
  }

  const restablecerContrasena = async (event) => {
    event.preventDefault()
    setMensaje('')
    setError('')

    if (datos.contrasena !== datos.confirmarContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    try {
      const { data } = await api.post('/auth/restablecer-contrasena', {
        token,
        password: datos.contrasena
      })
      setMensaje(data.mensaje)
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo cambiar la contraseña. Solicitá un nuevo enlace.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="480px">
          <h1>Nueva contraseña</h1>
          {!token ? (
            <p role="alert" className="sin-resultados">
              El enlace no es válido. Solicitá uno nuevo para continuar.
            </p>
          ) : mensaje ? (
            <p role="status" className="sin-resultados">{mensaje}</p>
          ) : (
            <form onSubmit={restablecerContrasena}>
              <CampoTexto
                label="NUEVA CONTRASEÑA"
                nombre="contrasena"
                tipo="password"
                valor={datos.contrasena}
                onChange={cambiarCampo}
                requerido
                minimo={8}
                maximo={72}
              />
              <CampoTexto
                label="CONFIRMAR CONTRASEÑA"
                nombre="confirmarContrasena"
                tipo="password"
                valor={datos.confirmarContrasena}
                onChange={cambiarCampo}
                requerido
                minimo={8}
                maximo={72}
              />
              {error && <p role="alert" className="sin-resultados">{error}</p>}
              <Boton texto={enviando ? 'GUARDANDO...' : 'Cambiar contraseña'} tipo="submit" variante="azul" />
            </form>
          )}
          <p className="registro-link">
            {mensaje ? (
              <Link to="/inicio-sesion" className="link-naranja">Iniciar sesión</Link>
            ) : (
              <Link to="/recuperar-contrasena" className="link-naranja">Solicitar otro enlace</Link>
            )}
          </p>
        </Tarjeta>
      </div>
    </>
  )
}

export default RestablecerContrasena
