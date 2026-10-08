import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { obtenerMensajeError } from '../utilidades/mensajeError.js'

function RegistroCliente() {
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: ''
  })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    setError('')

    try {
      await api.post('/auth/register', {
        ...datos,
        password: datos.contrasena,
      })
      setMensaje('Cuenta creada. Ya podés iniciar sesión.')
      setDatos({ nombre: '', apellido: '', email: '', contrasena: '' })
    } catch (error) {
      setError(obtenerMensajeError(error, 'No se pudo crear la cuenta.'))
    }
  }

  return (
    <>
      <Encabezado textoDerecha="Volver" rutaDerecha="/registro" />
      <Tarjeta ancho="480px">
        <h1>Cliente</h1>
        <form onSubmit={handleSubmit}>
          <CampoTexto label="NOMBRE" nombre="nombre" valor={datos.nombre} onChange={handleChange} />
          <CampoTexto label="APELLIDO" nombre="apellido" valor={datos.apellido} onChange={handleChange} />
          <CampoTexto label="EMAIL" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
          <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
          <Boton texto="CREAR CUENTA" tipo="submit" variante="azul" />
        </form>
        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p role="alert">{error}</p>}
      </Tarjeta>
    </>
  )
}

export default RegistroCliente