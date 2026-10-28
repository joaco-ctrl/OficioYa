import { Routes, Route, Navigate } from 'react-router-dom'
import Inicio from '../pages/Inicio.jsx'
import Resultados from '../pages/Resultados.jsx'
import PerfilProfesional from '../pages/PerfilProfesional.jsx'
import SolicitarPresupuesto from '../pages/SolicitarPresupuesto.jsx'
import MisSolicitudes from '../pages/MisSolicitudes.jsx'
import Registro from '../pages/Registro.jsx'
import RegistroCliente from '../pages/RegistroCliente.jsx'
import RegistroProfesional from '../pages/RegistroProfesional.jsx'
import InicioSesion from '../pages/InicioSesion.jsx'
import MisContratos from '../pages/MisContratos.jsx'
import MisReportes from '../pages/MisReportes.jsx'
import MisTrabajos from '../pages/MisTrabajos.jsx'
import SolicitudesProfesional from '../pages/SolicitudesProfesional.jsx'
import AdminCategorias from '../pages/AdminCategorias.jsx'
import AdminReportes from '../pages/AdminReportes.jsx'
import RutaPrivada from './RutaPrivada.jsx'
import MiPerfil from '../pages/MiPerfil.jsx'

function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/perfil/:id" element={<PerfilProfesional />} />
      <Route path="/mi-perfil" element={<RutaPrivada roles={['cliente', 'profesional', 'administrador']}><MiPerfil /></RutaPrivada>} />
      <Route path="/presupuesto/:id" element={<SolicitarPresupuesto />} />
      <Route path="/mis-solicitudes" element={<RutaPrivada roles={['cliente']}><MisSolicitudes /></RutaPrivada>} />
      <Route path="/mis-contratos" element={<RutaPrivada roles={['cliente']}><MisContratos /></RutaPrivada>} />
      <Route path="/mis-reportes" element={<RutaPrivada roles={['cliente', 'profesional']}><MisReportes /></RutaPrivada>} />
      <Route path="/mis-trabajos" element={<RutaPrivada roles={['profesional']}><MisTrabajos /></RutaPrivada>} />
      <Route path="/solicitudes-profesional" element={<RutaPrivada roles={['profesional']}><SolicitudesProfesional /></RutaPrivada>} />
      <Route path="/admin/categorias" element={<RutaPrivada roles={['administrador']}><AdminCategorias /></RutaPrivada>} />
      <Route path="/admin/reportes" element={<RutaPrivada roles={['administrador']}><AdminReportes /></RutaPrivada>} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro/cliente" element={<RegistroCliente />} />
      <Route path="/registro/profesional" element={<RegistroProfesional />} />
      <Route path="/inicio-sesion" element={<InicioSesion />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default RutasApp