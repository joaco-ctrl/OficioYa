import { useEffect, useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import BarraBusqueda from '../components/BarraBusqueda.jsx'
import Categoria from '../components/Categoria.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function Inicio() {
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/categorias/obtener-categorias')
      .then(({ data }) => setCategorias(data))
      .catch((requestError) => setError(mensajeError(requestError)))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      <Encabezado mostrarAuth={true} />

      <section className="hero">
        <h1>¿QUÉ SERVICIO ESTAS BUSCANDO?</h1>
        <p>Encontrá los mejores profesionales</p>
        <BarraBusqueda />
      </section>

      <section className="seccion">
        <h2>CATEGORIAS POPULARES</h2>
        <div className="grilla-categorias">
          {categorias.map((categoria) => (
            <Categoria key={categoria.id} {...categoria} />
          ))}
          {error && <p role="alert" className="sin-resultados">{error}</p>}
          {cargando && <p className="sin-resultados">Cargando categorías...</p>}
          {!cargando && !error && categorias.length === 0 && (
            <p className="sin-resultados">No hay categorías disponibles.</p>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-contenido">
          <span className="footer-logo">
            OFICIO<span className="footer-logo-ya">YA</span>
          </span>
          <p className="footer-texto">
            © 2026 OficioYa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Inicio