import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function Encabezado({ textoDerecha = 'Volver', rutaDerecha = -1, mostrarPerfil = false }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (rutaDerecha === -1) navigate(-1)
    else navigate(rutaDerecha)
  }

  return (
    <header className="encabezado">
      <div
        className="encabezado-logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logo} alt="OficioYa" />
        <span className="logo-texto">
          OFICIO<span className="logo-ya">YA</span>
        </span>
      </div>

      <div className="encabezado-derecha">
        {mostrarPerfil ? (
          <button className="encabezado-perfil" onClick={() => navigate('/perfil')}>
            <span className="icono-perfil">👤</span> PERFIL
          </button>
        ) : (
          textoDerecha && (
            <button className="encabezado-accion" onClick={handleClick}>
              {textoDerecha}
            </button>
          )
        )}
      </div>
    </header>
  )
}

export default Encabezado