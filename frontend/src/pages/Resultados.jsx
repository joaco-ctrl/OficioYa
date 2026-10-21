import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import TarjetaProfesional from '../components/TarjetaProfesional.jsx'
import { zonas } from '../data/datos.js'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function normalizar(texto) {
  return (texto || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function Resultados() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [zonasDisponibles, setZonasDisponibles] = useState(zonas)
  const [servicios, setServicios] = useState([])
  const [filtroOficio, setFiltroOficio] = useState('')
  const [filtroZona, setFiltroZona] = useState('')
  const [filtroPuntuacion, setFiltroPuntuacion] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const queryString = params.toString()

  useEffect(() => {
    let vigente = true

    const cargarResultados = async () => {
      setCargando(true)
      setError('')

      try {
        const queryParams = new URLSearchParams(queryString)
        const oficio = queryParams.get('oficio') || ''
        const categoryIdFromUrl = queryParams.get('categoria_id') || ''
        const { data: categoriasApi } = await api.get('/categorias/obtener-categorias')
        const categoria = categoriasApi.find(
          (item) => String(item.id) === categoryIdFromUrl ||
            normalizar(item.nombre) === normalizar(oficio)
        )
        const categoriaId = categoria?.id
        const { data: serviciosApi } = await api.get('/servicios', {
          params: {
            ...(categoriaId ? { categoria_id: categoriaId } : {}),
            ...(queryParams.get('zona') ? { zona: queryParams.get('zona') } : {})
          }
        })
        const profesionalIds = [...new Set(serviciosApi.map((item) => item.profesional_id))]
        const promedios = await Promise.all(
          profesionalIds.map(async (id) => {
            const { data } = await api.get(`/valoraciones/profesional/${id}/promedio`)
            return [id, Number(data?.promedio) || 0]
          })
        )
        const promediosPorProfesional = new Map(promedios)
        const profesionalesPorId = new Map()
        serviciosApi.forEach((servicio) => {
          const id = Number(servicio.profesional_id)
          if (!profesionalesPorId.has(id)) {
            profesionalesPorId.set(id, {
              id,
              servicioId: Number(servicio.servicio_id),
              nombre: `${servicio.profesional_nombre} ${servicio.profesional_apellido}`.trim(),
              categorias: [],
              zona: servicio.zona || 'Zona no especificada',
              puntuacion: promediosPorProfesional.get(servicio.profesional_id) || 0,
              verificado: Boolean(servicio.verificado),
              trabajosRealizados: null,
              servicios: []
            })
          }

          const profesional = profesionalesPorId.get(id)
          if (!profesional.categorias.includes(servicio.categoria_nombre)) {
            profesional.categorias.push(servicio.categoria_nombre)
          }
          profesional.servicios.push({
            id: Number(servicio.servicio_id),
            nombre: servicio.titulo,
            precio: servicio.precio == null ? null : Number(servicio.precio)
          })
        })

        if (vigente) {
          setCategorias(categoriasApi)
          setZonasDisponibles((actuales) => [...new Set([
            ...actuales,
            ...serviciosApi.map((servicio) => servicio.zona).filter(Boolean)
          ])])
          setFiltroOficio(categoria?.nombre || oficio)
          setFiltroZona(queryParams.get('zona') || '')
          setServicios([...profesionalesPorId.values()].map((profesional) => ({
            ...profesional,
            oficio: profesional.categorias.join(', ')
          })))
        }
      } catch (requestError) {
        if (vigente) {
          setError(mensajeError(requestError, 'No se pudieron cargar los resultados.'))
          setServicios([])
        }
      } finally {
        if (vigente) setCargando(false)
      }
    }

    cargarResultados()
    return () => {
      vigente = false
    }
  }, [queryString])

  const resultados = useMemo(() => servicios.filter((profesional) => (
    (!filtroOficio || normalizar(profesional.oficio).includes(normalizar(filtroOficio))) &&
    (!filtroZona || normalizar(profesional.zona).includes(normalizar(filtroZona))) &&
    (!filtroPuntuacion || profesional.puntuacion >= filtroPuntuacion)
  )), [servicios, filtroOficio, filtroZona, filtroPuntuacion])

  const aplicarFiltros = () => {
    const nuevos = new URLSearchParams()
    const categoria = categorias.find((item) => item.nombre === filtroOficio)
    if (categoria) {
      nuevos.set('categoria_id', categoria.id)
      nuevos.set('oficio', categoria.nombre)
    }
    if (filtroZona) nuevos.set('zona', filtroZona)
    navigate(`/resultados?${nuevos.toString()}`)
  }

  return (
    <>
      <Encabezado mostrarAuth={true} />

      <div className="layout-resultados">
        <aside className="sidebar-filtros">
          <button className="volver-inicio" onClick={() => navigate('/')}>
            ← VOLVER AL INICIO
          </button>

          <div className="filtros-caja">
            <h3>FILTROS</h3>

            <div className="filtro-grupo">
              <label>ZONA</label>
              <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
                <option value="">Todas</option>
                {zonasDisponibles.map((zona) => (
                  <option key={zona} value={zona}>{zona}</option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>CATEGORÍAS</label>
              {categorias.map((categoria) => (
                <label key={categoria.id} className="filtro-check">
                  <input
                    type="radio"
                    name="oficio"
                    value={categoria.nombre}
                    checked={filtroOficio === categoria.nombre}
                    onChange={(e) => setFiltroOficio(e.target.value)}
                  />
                  {categoria.nombre}
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
          <h2>RESULTADOS DE LA BÚSQUEDA</h2>
          <p className="subtitulo">
            Mostrando profesionales {filtroOficio && `de ${filtroOficio}`}{' '}
            {filtroZona && `en ${filtroZona}`}
          </p>

          <div className="lista-resultados">
            {cargando ? (
              <p className="sin-resultados">Cargando resultados...</p>
            ) : error ? (
              <p role="alert" className="sin-resultados">{error}</p>
            ) : resultados.length === 0 ? (
              <p className="sin-resultados">
                No se encontraron profesionales para esta búsqueda.
              </p>
            ) : (
              resultados.map((profesional) => (
                <TarjetaProfesional key={profesional.servicioId} profesional={profesional} modo="resultado" />
              ))
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Resultados
