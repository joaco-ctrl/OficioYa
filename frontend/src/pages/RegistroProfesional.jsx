import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { obtenerMensajeError } from '../utilidades/mensajeError.js'

function RegistroProfesional() {
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    zona: '',
    telefono: '',
    horarios: '',
    oficio: ''
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
      await api.post('/auth/profesional-register', {
        ...datos,
        password: datos.contrasena,
        disponibilidad: datos.horarios,
      })
      setMensaje('Cuenta creada. Ya podés iniciar sesión.')
      setDatos({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        zona: '',
        telefono: '',
        horarios: '',
        oficio: '',
      })
    } catch (error) {
      setError(obtenerMensajeError(error, 'No se pudo crear la cuenta.'))
    }
  }

  return (
    <>
      <Encabezado textoDerecha="Volver" rutaDerecha="/registro" />
      <Tarjeta ancho="900px">
        <h1>Profesional</h1>
        <form onSubmit={handleSubmit} className="form-profesional">
          <CampoTexto label="NOMBRE" nombre="nombre" valor={datos.nombre} onChange={handleChange} />
          <CampoTexto label="APELLIDO" nombre="apellido" valor={datos.apellido} onChange={handleChange} />
          <CampoTexto label="EMAIL" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
          <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
          <CampoTexto label="ZONA DE COBERTURA" nombre="zona" valor={datos.zona} onChange={handleChange} />
          <CampoTexto label="TELEFONO" nombre="telefono" valor={datos.telefono} onChange={handleChange} />
          <CampoTexto label="HORARIOS" nombre="horarios" valor={datos.horarios} onChange={handleChange} />
          <div className="campo">
            <label htmlFor="oficio">OFICIO</label>
            <select id="oficio" name="oficio" value={datos.oficio} onChange={handleChange}>
              <option value="">Seleccioná un oficio</option>
              <option value="electricista">Electricista</option>
              <option value="plomero">Plomero</option>
              <option value="pintor">Pintor</option>
              <option value="carpintero">Carpintero</option>
              <option value="albañil">Albañil</option>
            </select>
          </div>
          <div className="boton-contenedor">
            <Boton texto="CREAR CUENTA" tipo="submit" variante="azul" />
          </div>
        </form>
        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p role="alert">{error}</p>}
      </Tarjeta>
    </>
  )
}

export default RegistroProfesional