import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function RegistroProfesional() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    zona: '',
    telefono: '',
    horarios: '',
    categoriaId: ''
  })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    api.get('/categorias/obtener-categorias')
      .then(({ data }) => setCategorias(data))
      .catch((requestError) => setError(mensajeError(requestError)))
  }, [])

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await api.post('/auth/profesional-register', {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        password: datos.contrasena,
        telefono: datos.telefono,
        zona: datos.zona,
        disponibilidad: datos.horarios
      })
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo crear la cuenta profesional.'))
      setEnviando(false)
      return
    }

    try {
      const { data: login } = await api.post('/auth/login', {
        email: datos.email,
        password: datos.contrasena
      })
      localStorage.setItem('oficioya_token', login.token)
      localStorage.setItem('oficioya_usuario', JSON.stringify(login.usuario))

      await api.post('/servicios', {
        categoria_id: Number(datos.categoriaId),
        titulo: categorias.find((categoria) => String(categoria.id) === datos.categoriaId).nombre
      })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(
        `La cuenta fue creada, pero no se pudo publicar el servicio. ${mensajeError(requestError)}`
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="900px">
          <h1>Crear cuenta de Profesional</h1>
          <form onSubmit={handleSubmit} className="form-profesional">
            <CampoTexto label="NOMBRE" nombre="nombre" valor={datos.nombre} onChange={handleChange} />
            <CampoTexto label="APELLIDO" nombre="apellido" valor={datos.apellido} onChange={handleChange} />
            <CampoTexto label="EMAIL" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
            <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
            <CampoTexto label="ZONA DE COBERTURA" nombre="zona" valor={datos.zona} onChange={handleChange} />
            <CampoTexto label="TELÉFONO" nombre="telefono" valor={datos.telefono} onChange={handleChange} />
            <CampoTexto label="HORARIOS" nombre="horarios" valor={datos.horarios} onChange={handleChange} />
            <div className="campo">
              <label htmlFor="categoriaId">OFICIO</label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={datos.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccioná un oficio</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            {error && <p role="alert" className="sin-resultados">{error}</p>}
            <div className="boton-contenedor">
              <Boton
                texto={enviando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
                tipo="submit"
                variante="azul"
              />
            </div>
          </form>
        </Tarjeta>
      </div>
    </>
  )
}

export default RegistroProfesional
