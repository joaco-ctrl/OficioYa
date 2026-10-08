import { useNavigate } from 'react-router-dom'

function Categoria({ id, nombre }) {
  const navigate = useNavigate()

  return (
    <button
      className="categoria"
      onClick={() => navigate(`/resultados?oficio=${nombre}`)}
    >
      <span className="categoria-nombre">{nombre}</span>
    </button>
  )
}

export default Categoria