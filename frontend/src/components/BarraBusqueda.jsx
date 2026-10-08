import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { oficios, zonas } from '../data/datos.js'

function BarraBusqueda() {
  const [oficio, setOficio] = useState('')
  const [zona, setZona] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (oficio) params.set('oficio', oficio)
    if (zona) params.set('zona', zona)
    navigate(`/resultados?${params.toString()}`)
  }

  return (
    <form className="barra-busqueda" onSubmit={handleSubmit}>
      <div className="select-busqueda">
        <label>OFICIO:</label>
        <select value={oficio} onChange={(e) => setOficio(e.target.value)}>
          <option value="">Elegir</option>
          {oficios.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="select-busqueda">
        <label>ZONA:</label>
        <select value={zona} onChange={(e) => setZona(e.target.value)}>
          <option value="">Elegir</option>
          {zonas.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="boton-buscar">
        BUSCAR
      </button>
    </form>
  )
}

export default BarraBusqueda