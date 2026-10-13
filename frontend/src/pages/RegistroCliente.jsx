import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function RegistroCliente() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: ''
  })
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
      await api.post('/auth/register', {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        password: datos.contrasena
      })
      navigate('/inicio-sesion', {
        state: { mensaje: 'Cuenta creada. Iniciá sesión para continuar.' }
      })
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo crear la cuenta.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="480px">
          <h1>Crear cuenta de Cliente</h1>
          <form onSubmit={handleSubmit}>
            <CampoTexto label="NOMBRE" nombre="nombre" valor={datos.nombre} onChange={handleChange} />
            <CampoTexto label="APELLIDO" nombre="apellido" valor={datos.apellido} onChange={handleChange} />
            <CampoTexto label="EMAIL" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
            <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
            {error && <p role="alert" className="sin-resultados">{error}</p>}
            <Boton texto={enviando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'} tipo="submit" variante="azul" />
          </form>
        </Tarjeta>
      </div>
    </>
  )
}

export default RegistroCliente