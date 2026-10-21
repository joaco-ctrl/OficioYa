import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

const perfilInicial = { nombre: '', apellido: '', telefono: '', email: '', zona: '', disponibilidad: '', biografia: '' }
const servicioInicial = { categoria_id: '', titulo: '', descripcion: '', precio: '' }

function MiPerfil() {
  const location = useLocation()
  const navigate = useNavigate()
  const pestana = new URLSearchParams(location.search).get('tab') || 'perfil'
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')
    } catch {
      return null
    }
  })()
  const esProfesional = usuario?.rol === 'profesional'
  const esAdministrador = usuario?.rol === 'administrador'
  const [perfil, setPerfil] = useState(perfilInicial)
  const [categorias, setCategorias] = useState([])
  const [servicios, setServicios] = useState([])
  const [servicioForm, setServicioForm] = useState(servicioInicial)
  const [servicioEditando, setServicioEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarPerfil = async () => {
    setCargando(true)
    setError('')
    try {
      if (esProfesional) {
        const [perfilResponse, serviciosResponse, categoriasResponse] = await Promise.all([
          api.get('/profesionales/mi-perfil'),
          api.get('/servicios/mis-servicios/lista'),
          api.get('/categorias/obtener-categorias')
        ])
        setPerfil({ ...perfilInicial, ...perfilResponse.data })
        setServicios(serviciosResponse.data)
        setCategorias(categoriasResponse.data)
      } else {
        const { data } = await api.get('/auth/mi-perfil')
        setPerfil({ ...perfilInicial, ...data })
      }
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo cargar el perfil.'))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarPerfil() }, [])

  const cambiarCampoPerfil = (event) => {
    setPerfil((actual) => ({ ...actual, [event.target.name]: event.target.value }))
  }

  const guardarPerfil = async (event) => {
    event.preventDefault()
    setGuardando(true)
    setError('')
    setMensaje('')
    const campos = esProfesional
      ? { nombre: perfil.nombre, apellido: perfil.apellido, telefono: perfil.telefono, zona: perfil.zona, disponibilidad: perfil.disponibilidad, biografia: perfil.biografia }
      : { nombre: perfil.nombre, apellido: perfil.apellido, telefono: perfil.telefono }
    try {
      const ruta = esProfesional ? '/profesionales/mi-perfil' : '/auth/mi-perfil'
      const { data } = await api.put(ruta, campos)
      setPerfil((actual) => ({ ...actual, ...(data.perfil || data) }))
      setMensaje('Perfil actualizado correctamente.')
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo actualizar el perfil.'))
    } finally {
      setGuardando(false)
    }
  }

  const guardarServicio = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')
    const payload = {
      categoria_id: Number(servicioForm.categoria_id),
      titulo: servicioForm.titulo.trim(),
      descripcion: servicioForm.descripcion.trim() || null,
      precio: servicioForm.precio === '' ? null : Number(servicioForm.precio)
    }
    try {
      if (servicioEditando) {
        await api.put(`/servicios/${servicioEditando}`, payload)
        setMensaje('Servicio actualizado.')
      } else {
        await api.post('/servicios', payload)
        setMensaje('Servicio creado.')
      }
      setServicioForm(servicioInicial)
      setServicioEditando(null)
      const { data } = await api.get('/servicios/mis-servicios/lista')
      setServicios(data)
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo guardar el servicio.'))
    }
  }

  const editarServicio = (servicio) => {
    setServicioEditando(servicio.servicio_id)
    setServicioForm({
      categoria_id: String(servicio.categoria_id),
      titulo: servicio.titulo,
      descripcion: servicio.descripcion || '',
      precio: servicio.precio == null ? '' : String(Number(servicio.precio))
    })
  }

  const cambiarEstadoServicio = async (servicio) => {
    setError('')
    setMensaje('')
    try {
      await api.patch(`/servicios/${servicio.servicio_id}/estado`, { activo: !Boolean(servicio.activo) })
      setMensaje(Boolean(servicio.activo) ? 'Servicio desactivado.' : 'Servicio activado.')
      const { data } = await api.get('/servicios/mis-servicios/lista')
      setServicios(data)
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo cambiar el estado del servicio.'))
    }
  }

  const cancelarEdicion = () => {
    setServicioEditando(null)
    setServicioForm(servicioInicial)
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <main className="solicitudes-contenedor">
        {cargando ? <p className="sin-resultados">Cargando perfil...</p> : (
          <>
            <NavegacionPerfil />
            {error && <p role="alert" className="sin-resultados">{error}</p>}
            {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}

            {esProfesional && pestana === 'perfil' && (
              <section className="solicitud-card">
                <h2>Editar perfil</h2>
                <form onSubmit={guardarPerfil}>
                  <div className="solicitud-card-body">
                    <label className="solicitud-campo"><span className="solicitud-label">Nombre</span><input name="nombre" value={perfil.nombre || ''} onChange={cambiarCampoPerfil} required /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Apellido</span><input name="apellido" value={perfil.apellido || ''} onChange={cambiarCampoPerfil} required /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Teléfono</span><input name="telefono" value={perfil.telefono || ''} onChange={cambiarCampoPerfil} /></label>
                    <div className="solicitud-campo"><span className="solicitud-label">Correo electrónico</span><span className="solicitud-valor">{perfil.email}</span></div>
                    <label className="solicitud-campo"><span className="solicitud-label">Zona</span><input name="zona" value={perfil.zona || ''} onChange={cambiarCampoPerfil} /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Disponibilidad</span><input name="disponibilidad" value={perfil.disponibilidad || ''} onChange={cambiarCampoPerfil} /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Sobre mí</span><textarea name="biografia" rows="4" value={perfil.biografia || ''} onChange={cambiarCampoPerfil} /></label>
                  </div>
                  <div className="solicitud-card-footer"><button className="boton boton-naranja" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar perfil'}</button></div>
                </form>
              </section>
            )}

            {esProfesional && pestana === 'crear-servicio' && (
              <section className="solicitud-card">
                <h2>{servicioEditando ? 'Editar servicio' : 'Crear servicio'}</h2>
                <form onSubmit={guardarServicio}>
                  <div className="solicitud-card-body">
                    <label className="solicitud-campo"><span className="solicitud-label">Categoría</span><select value={servicioForm.categoria_id} onChange={(event) => setServicioForm({ ...servicioForm, categoria_id: event.target.value })} required><option value="">Elegir categoría</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}</select></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Título</span><input value={servicioForm.titulo} onChange={(event) => setServicioForm({ ...servicioForm, titulo: event.target.value })} required maxLength="150" /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Descripción</span><textarea rows="3" value={servicioForm.descripcion} onChange={(event) => setServicioForm({ ...servicioForm, descripcion: event.target.value })} /></label>
                    <label className="solicitud-campo"><span className="solicitud-label">Precio (opcional)</span><input type="number" min="0" step="0.01" value={servicioForm.precio} onChange={(event) => setServicioForm({ ...servicioForm, precio: event.target.value })} /></label>
                  </div>
                  <div className="solicitud-card-footer"><button className="boton boton-naranja">{servicioEditando ? 'Guardar cambios' : 'Publicar servicio'}</button>{servicioEditando && <button type="button" className="encabezado-link" onClick={cancelarEdicion}>Cancelar</button>}</div>
                </form>
              </section>
            )}

            {esProfesional && pestana === 'servicios' && (
              <>
                <section className="solicitudes-lista" aria-label="Mis servicios">
                  <h2>Mis servicios</h2>
                  {servicios.length === 0 ? <p className="sin-resultados">Todavía no publicaste servicios.</p> : servicios.map((servicio) => (
                    <article className="solicitud-card" key={servicio.servicio_id}>
                      <div className="solicitud-card-header"><div className="solicitud-card-info"><h3>{servicio.titulo}</h3><p>{servicio.categoria_nombre} · {servicio.precio == null ? 'Precio a consultar' : `$${Number(servicio.precio).toLocaleString('es-AR')}`}</p></div><span className={`estado-badge ${servicio.activo ? 'estado-respondido' : 'estado-rechazado'}`}>{servicio.activo ? 'Activo' : 'Inactivo'}</span></div>
                      {servicio.descripcion && <p className="solicitud-valor">{servicio.descripcion}</p>}
                      <div className="solicitud-card-footer"><button className="encabezado-link" onClick={() => { editarServicio(servicio); navigate('/mi-perfil?tab=crear-servicio') }}>Editar</button><button className="boton boton-naranja" onClick={() => cambiarEstadoServicio(servicio)}>{servicio.activo ? 'Desactivar' : 'Activar'}</button></div>
                    </article>
                  ))}
                </section>
              </>
            )}

          </>
        )}
      </main>
    </>
  )
}

export default MiPerfil
