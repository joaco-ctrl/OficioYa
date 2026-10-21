import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import Boton from '../components/Boton.jsx'

function Registro() {
  const navigate = useNavigate()

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="480px">
          <h1>Registro</h1>
          <p className="registro-intro">
            ¿Cómo querés registrarte?
          </p>
          <Boton
            texto="CLIENTE"
            variante="azul"
            onClick={() => navigate('/registro/cliente')}
          />
          <Boton
            texto="PROFESIONAL"
            variante="naranja"
            onClick={() => navigate('/registro/profesional')}
          />
        </Tarjeta>
      </div>
    </>
  )
}

export default Registro