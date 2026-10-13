import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zonas } from '../data/datos.js'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function BarraBusqueda() {
  const [categorias, setCategorias] = useState([])
  const [zonasDisponibles, setZonasDisponibles] = useState(zonas)
  const [categoriaId, setCategoriaId] = useState('')
  const [zona, setZona] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/categorias/obtener-categorias'),
      api.get('/servicios')
    ])
      .then(([categoriasResponse, serviciosResponse]) => {
        setCategorias(categoriasResponse.data)
        const zonasApi = serviciosResponse.data.map((servicio) => servicio.zona).filter(Boolean)
        setZonasDisponibles([...new Set([...zonas, ...zonasApi])])
      })
      .catch((requestError) => setError(mensajeError(requestError)))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    const categoria = categorias.find((item) => String(item.id) === categoriaId)
    if (categoria) {
      params.set('categoria_id', categoria.id)
      params.set('oficio', categoria.nombre)
    }
    if (zona) params.set('zona', zona)
    navigate(`/resultados?${params.toString()}`)
  }

  return (
    <form className="barra-busqueda" onSubmit={handleSubmit}>
      <div className="select-busqueda">
        <label>OFICIO:</label>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Elegir</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
      </div>

      <div className="select-busqueda">
        <label>ZONA:</label>
        <select value={zona} onChange={(e) => setZona(e.target.value)}>
          <option value="">Elegir</option>
          {zonasDisponibles.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="boton-buscar">
        BUSCAR
      </button>
      {error && <span role="alert">{error}</span>}
    </form>
  )
}

export default BarraBusqueda