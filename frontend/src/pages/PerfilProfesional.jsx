import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import TarjetaProfesional from '../components/TarjetaProfesional.jsx'
import api from '../api/api.js'
import { obtenerMensajeError } from '../utilidades/mensajeError.js'

function PerfilProfesional() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profesional, setProfesional] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    setError('')
    api.get(`/profesionales/${id}`)
      .then((perfil) => setProfesional({
        id: perfil.profesional_id,
        nombre: `${perfil.nombre} ${perfil.apellido}`,
        oficio: 'Profesional',
        zona: perfil.zona || 'Sin zona informada',
        disponibilidad: perfil.disponibilidad || 'Sin disponibilidad informada',
        sobreMi: perfil.biografia || 'Sin descripción disponible.',
        puntuacion: null,
        servicios: [],
        valoraciones: [],
      }))
      .catch((error) => setError(obtenerMensajeError(error, 'No se pudo cargar el perfil profesional.')))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando || error || !profesional) {
    return (
      <>
        <Encabezado mostrarPerfil={true} />
        <div className="seccion">
          <p>{cargando ? 'Cargando perfil...' : error || 'Profesional no encontrado.'}</p>
          <button onClick={() => navigate('/resultados')}>Volver a resultados</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Encabezado mostrarPerfil={true} />

      <button className="volver-resultados" onClick={() => navigate(-1)}>
        ← VOLVER A RESULTADOS
      </button>

      <TarjetaProfesional profesional={profesional} modo="perfil" />
    </>
  )
}

export default PerfilProfesional