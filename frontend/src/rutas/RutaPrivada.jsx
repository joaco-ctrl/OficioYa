import { Navigate, useLocation } from 'react-router-dom'

function RutaPrivada({ children, roles = [] }) {
  const location = useLocation()
  const token = localStorage.getItem('oficioya_token')
  let usuario = null

  try {
    usuario = JSON.parse(localStorage.getItem('oficioya_usuario') || 'null')
  } catch {
    usuario = null
  }

  if (!token || !usuario) {
    return <Navigate to="/inicio-sesion" replace state={{ from: location.pathname }} />
  }

  if (roles.length && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaPrivada
