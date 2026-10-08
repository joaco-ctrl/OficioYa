import { useState } from 'react'
import { Link } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { obtenerMensajeError } from '../utilidades/mensajeError.js'
import { useNavigate } from 'react-router-dom'

function InicioSesion() {
  const [datos, setDatos] = useState({ email: '', contrasena: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const respuesta = await api.post('/auth/login', {
        email: datos.email,
        password: datos.contrasena,
      })
      localStorage.setItem('token', respuesta.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario))
      navigate('/')
    } catch (error) {
      setError(obtenerMensajeError(error, 'No se pudo iniciar sesión.'))
    }
  }

  return (
    <>
      <Encabezado textoDerecha="" />
      <Tarjeta ancho="480px">
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
          <CampoTexto label="CORREO ELECTRÓNICO" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
          <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
          <Boton texto="Ingresar" tipo="submit" variante="azul-claro" />
        </form>
        {error && <p role="alert">{error}</p>}
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#112d3f' }}>
          ¿No tenes cuenta? <Link to="/registro" style={{ fontWeight: 600, textDecoration: 'underline' }}>Registrate acá</Link>
        </p>
      </Tarjeta>
    </>
  )
}

export default InicioSesion