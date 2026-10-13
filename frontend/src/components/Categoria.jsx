import { useNavigate } from 'react-router-dom'

function Categoria({ id, nombre }) {
  const navigate = useNavigate()

  return (
    <button
      className="categoria"
      onClick={() => {
        const params = new URLSearchParams({ categoria_id: id, oficio: nombre })
        navigate(`/resultados?${params.toString()}`)
      }}
    >
      <span className="categoria-nombre">{nombre}</span>
    </button>
  )
}

export default Categoria