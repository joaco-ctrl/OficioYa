import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import NavegacionPerfil from '../components/NavegacionPerfil.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [formulario, setFormulario] = useState({ nombre: '', descripcion: '' })
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarCategorias = () => api.get('/categorias/obtener-categorias')
    .then(({ data }) => setCategorias(data))
    .catch((requestError) => setError(mensajeError(requestError, 'No se pudieron cargar las categorías.')))
    .finally(() => setCargando(false))

  useEffect(() => { cargarCategorias() }, [])

  const guardar = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')
    try {
      if (categoriaEditando) {
        await api.put('/categorias/actualizar-categorias', { id: categoriaEditando, ...formulario })
        setMensaje('Categoría actualizada.')
      } else {
        await api.post('/categorias/crear-categorias', formulario)
        setMensaje('Categoría creada.')
      }
      setFormulario({ nombre: '', descripcion: '' })
      setCategoriaEditando(null)
      await cargarCategorias()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo guardar la categoría.'))
    }
  }

  const editar = (categoria) => {
    setCategoriaEditando(categoria.id)
    setFormulario({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' })
    setError('')
    setMensaje('')
  }

  const eliminar = async (categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return
    setError('')
    setMensaje('')
    try {
      await api.delete('/categorias/borrar-categorias', { data: { id: categoria.id } })
      setMensaje('Categoría eliminada.')
      await cargarCategorias()
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo eliminar. Puede estar asociada a servicios.'))
    }
  }

  return (
    <>
      <Encabezado mostrarAuth />
      <NavegacionPerfil />
      <main className="solicitudes-contenedor">
        <div className="solicitudes-header"><div><h1>Administrar categorías</h1><p className="solicitudes-subtitulo">Creá y actualizá las categorías disponibles para los servicios.</p></div></div>
        {error && <p role="alert" className="sin-resultados">{error}</p>}
        {mensaje && <p role="status" className="sin-resultados">{mensaje}</p>}
        <form className="solicitud-card" onSubmit={guardar}>
          <h2>{categoriaEditando ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <div className="solicitud-card-body">
            <label className="solicitud-campo"><span className="solicitud-label">Nombre</span><input value={formulario.nombre} onChange={(event) => setFormulario({ ...formulario, nombre: event.target.value })} required maxLength="50" /></label>
            <label className="solicitud-campo"><span className="solicitud-label">Descripción</span><textarea rows="3" value={formulario.descripcion} onChange={(event) => setFormulario({ ...formulario, descripcion: event.target.value })} /></label>
          </div>
          <div className="solicitud-card-footer">
            <button className="boton boton-naranja" type="submit">{categoriaEditando ? 'Guardar cambios' : 'Crear categoría'}</button>
            {categoriaEditando && <button type="button" className="encabezado-link" onClick={() => { setCategoriaEditando(null); setFormulario({ nombre: '', descripcion: '' }) }}>Cancelar edición</button>}
          </div>
        </form>
        <section className="solicitudes-lista" aria-label="Categorías existentes">
          <h2>Categorías existentes</h2>
          {cargando ? <p>Cargando categorías...</p> : categorias.map((categoria) => (
            <article className="solicitud-card" key={categoria.id}>
              <div className="solicitud-card-header"><div className="solicitud-card-info"><h3>{categoria.nombre}</h3><p>{categoria.descripcion || 'Sin descripción'}</p></div></div>
              <div className="solicitud-card-footer"><button className="encabezado-link" onClick={() => editar(categoria)}>Editar</button><button className="encabezado-link" onClick={() => eliminar(categoria)}>Eliminar</button></div>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

export default AdminCategorias
