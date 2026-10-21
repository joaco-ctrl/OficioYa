import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import TarjetaProfesional from '../components/TarjetaProfesional.jsx'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function PerfilProfesional() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profesional, setProfesional] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true

    const cargarPerfil = async () => {
      setCargando(true)
      setError('')

      try {
        const [perfilResponse, serviciosResponse, valoracionesResponse, promedioResponse] = await Promise.all([
          api.get(`/profesionales/${id}`),
          api.get('/servicios'),
          api.get(`/valoraciones/profesional/${id}`),
          api.get(`/valoraciones/profesional/${id}/promedio`)
        ])
        const perfil = perfilResponse.data
        const servicios = serviciosResponse.data
          .filter((servicio) => Number(servicio.profesional_id) === Number(id))
          .map((servicio) => ({
            id: Number(servicio.servicio_id),
            nombre: servicio.titulo,
            descripcion: servicio.servicio_descripcion || '',
            precio: servicio.precio == null ? null : Number(servicio.precio)
          }))

        if (vigente) {
          setProfesional({
            id: Number(perfil.profesional_id),
            servicioId: servicios[0]?.id,
            nombre: `${perfil.nombre} ${perfil.apellido}`.trim(),
            oficio: serviciosResponse.data.find(
              (servicio) => Number(servicio.profesional_id) === Number(id)
            )?.categoria_nombre || 'Profesional',
            titulo: servicios[0]?.nombre || 'Profesional',
            zona: perfil.zona || 'Zona no especificada',
            disponibilidad: perfil.disponibilidad,
            verificado: Boolean(serviciosResponse.data.find(
              (servicio) => Number(servicio.profesional_id) === Number(id)
            )?.verificado),
            puntuacion: Number(promedioResponse.data?.promedio) || 0,
            trabajosRealizados: null,
            sobreMi: perfil.biografia,
            servicios,
            valoraciones: valoracionesResponse.data.map((valoracion) => ({
              usuario: `${valoracion.usuario_nombre} ${valoracion.usuario_apellido}`.trim(),
              puntuacion: Number(valoracion.puntuacion),
              comentario: valoracion.comentario || ''
            }))
          })
        }
      } catch (requestError) {
        if (vigente) setError(mensajeError(requestError, 'No se pudo cargar el perfil.'))
      } finally {
        if (vigente) setCargando(false)
      }
    }

    cargarPerfil()
    return () => {
      vigente = false
    }
  }, [id])

  return (
    <>
      <Encabezado mostrarAuth={true} />
      {cargando ? (
        <p className="sin-resultados">Cargando perfil...</p>
      ) : error ? (
        <div className="seccion perfil-error" role="alert">
          <p>{error}</p>
          <button className="boton boton-naranja" onClick={() => navigate('/resultados')}>
            Volver a resultados
          </button>
        </div>
      ) : profesional ? (
        <>
          <button className="volver-resultados" onClick={() => navigate(-1)}>
            ← VOLVER A RESULTADOS
          </button>
          <TarjetaProfesional key={profesional.id} profesional={profesional} modo="perfil" />
        </>
      ) : null}
    </>
  )
}

export default PerfilProfesional
