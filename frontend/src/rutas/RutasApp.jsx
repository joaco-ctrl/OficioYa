import InicioSesion from '../pages/InicioSesion.jsx'
import Registro from '../pages/Registro.jsx'
import RegistroCliente from '../pages/RegistroCliente.jsx'
import RegistroProfesional from '../pages/RegistroProfesional.jsx'
import { Routes, Route } from 'react-router-dom'
import Inicio from '../pages/Inicio.jsx'
import Resultado from '../pages/Resultado.jsx'
import PerfilProfesional from '../pages/PerfilProfesional.jsx'

function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/resultados" element={<Resultado />} />
      <Route path="/perfil/:id" element={<PerfilProfesional />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro/cliente" element={<RegistroCliente />} />
      <Route path="/registro/profesional" element={<RegistroProfesional />} />
      <Route path="/inicio-sesion" element={<InicioSesion />} />
    </Routes>
  )
}

export default RutasApp