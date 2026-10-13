import { Routes, Route } from 'react-router-dom'
import Inicio from '../pages/Inicio.jsx'
import Resultados from '../pages/Resultados.jsx'
import PerfilProfesional from '../pages/PerfilProfesional.jsx'
import SolicitarPresupuesto from '../pages/SolicitarPresupuesto.jsx'
import MisSolicitudes from '../pages/MisSolicitudes.jsx'
import Registro from '../pages/Registro.jsx'
import RegistroCliente from '../pages/RegistroCliente.jsx'
import RegistroProfesional from '../pages/RegistroProfesional.jsx'
import InicioSesion from '../pages/InicioSesion.jsx'

function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/perfil/:id" element={<PerfilProfesional />} />
      <Route path="/presupuesto/:id" element={<SolicitarPresupuesto />} />
      <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro/cliente" element={<RegistroCliente />} />
      <Route path="/registro/profesional" element={<RegistroProfesional />} />
      <Route path="/inicio-sesion" element={<InicioSesion />} />
    </Routes>
  )
}

export default RutasApp