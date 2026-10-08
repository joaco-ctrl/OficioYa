import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import BarraBusqueda from '../components/BarraBusqueda.jsx'
import Categoria from '../components/Categoria.jsx'
import api from '../api/api.js'
import { obtenerMensajeError } from '../utilidades/mensajeError.js'

function Inicio() {
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/categorias/obtener-categorias')
      .then(setCategorias)
      .catch((error) => setError(obtenerMensajeError(error, 'No se pudieron cargar las categorías.')))
  }, [])

  return (
    <>
      <Encabezado mostrarPerfil={true} />

      <section className="hero">
        <h1>¿QUÉ SERVICIO ESTAS BUSCANDO?</h1>
        <p>Encontrá los mejores profesionales</p>
        <BarraBusqueda />
      </section>

      <section className="seccion">
        <h2>CATEGORIAS POPULARES</h2>
        <div className="grilla-categorias">
          {categorias.map((cat) => (
            <Categoria key={cat.id} {...cat} />
          ))}
        </div>
        {error && <p role="alert">{error}</p>}
      </section>
    </>
  )
}

export default Inicio