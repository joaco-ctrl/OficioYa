import { useNavigate } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import Boton from '../components/Boton.jsx'

function Registro() {
  const navigate = useNavigate()

  return (
    <>
      <Encabezado textoDerecha="Iniciar Sesión" rutaDerecha="/inicio-sesion" />
      <Tarjeta ancho="480px">
        <h1>Registro</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#112d3f' }}>
          ¿Cómo quiere registrarse?
        </p>
        <Boton texto="CLIENTE" variante="blanco" onClick={() => navigate('/registro/cliente')} />
        <Boton texto="PROFESIONAL" variante="blanco" onClick={() => navigate('/registro/profesional')} />
      </Tarjeta>
    </>
  )
}

export default Registro