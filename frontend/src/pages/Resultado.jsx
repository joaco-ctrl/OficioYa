import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import TarjetaProfesional from '../components/TarjetaProfesional.jsx'
import { profesionales, oficios, zonas } from '../data/datos.js'

function Resultados() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [filtroOficio, setFiltroOficio] = useState(params.get('oficio') || '')
  const [filtroZona, setFiltroZona] = useState(params.get('zona') || '')
  const [filtroPuntuacion, setFiltroPuntuacion] = useState(0)

  const resultados = useMemo(() => {
    return profesionales.filter((p) => {
      const coincideOficio =
        !filtroOficio || p.oficio.toLowerCase().includes(filtroOficio.toLowerCase())
      const coincideZona =
        !filtroZona || p.zona.toLowerCase().includes(filtroZona.toLowerCase())
      const coincidePuntuacion = !filtroPuntuacion || p.puntuacion >= filtroPuntuacion
      return coincideOficio && coincideZona && coincidePuntuacion
    })
  }, [filtroOficio, filtroZona, filtroPuntuacion])

  const aplicarFiltros = () => {
    const nuevos = new URLSearchParams()
    if (filtroOficio) nuevos.set('oficio', filtroOficio)
    if (filtroZona) nuevos.set('zona', filtroZona)
    navigate(`/resultados?${nuevos.toString()}`)
  }

  return (
    <>
      <Encabezado mostrarPerfil={true} />

      <div className="layout-resultados">
        <aside className="sidebar-filtros">
          <button className="volver-inicio" onClick={() => navigate('/')}>
            ← VOLVER AL INICIO
          </button>

          <div className="filtros-caja">
            <h3>FILTROS</h3>

            <div className="filtro-grupo">
              <label>ZONA</label>
              <select
                value={filtroZona}
                onChange={(e) => setFiltroZona(e.target.value)}
              >
                <option value="">Todas</option>
                {zonas.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>CATEGORIAS</label>
              {oficios.map((o) => (
                <label key={o} className="filtro-check">
                  <input
                    type="radio"
                    name="oficio"
                    value={o}
                    checked={filtroOficio === o}
                    onChange={(e) => setFiltroOficio(e.target.value)}
                  />
                  {o}
                </label>
              ))}
            </div>

            <div className="filtro-grupo">
              <label>CALIFICACIÓN</label>
              {[5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`estrella-filtro ${filtroPuntuacion === n ? 'activa' : ''}`}
                  onClick={() => setFiltroPuntuacion(n === filtroPuntuacion ? 0 : n)}
                >
                  {'★'.repeat(n)}
                  {'☆'.repeat(5 - n)}
                </button>
              ))}
            </div>

            <button className="aplicar-filtros" onClick={aplicarFiltros}>
              APLICAR FILTROS
            </button>
          </div>
        </aside>

        <main className="contenido-resultados">
          <h2>RESULTADOS DE LA BUSQUEDA</h2>
          <p className="subtitulo">
            Mostrando profesionales {filtroOficio && `de ${filtroOficio}`}{' '}
            {filtroZona && `en ${filtroZona}`}
          </p>

          <div className="lista-resultados">
            {resultados.length === 0 ? (
              <p className="sin-resultados">No se encontraron profesionales.</p>
            ) : (
              resultados.map((p) => (
                <TarjetaProfesional key={p.id} profesional={p} modo="resultado" />
              ))
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Resultados