const express = require('express');
const router = express.Router();
const { verificarToken, esCliente, esProfesional, esAdministrador } = require('../middlewares/auth');
const {
    crearReporte,
    obtenerMisReportes,
    obtenerReportesPendientes,
    resolverReporte
} = require('../controllers/reportesController');

const esParticipante = (req, res, next) => {
    if (req.usuario.rol === 'cliente') {
        return esCliente(req, res, next);
    }

    if (req.usuario.rol === 'profesional') {
        return esProfesional(req, res, next);
    }

    return res.status(403).json({ mensaje: 'Acceso restringido a clientes y profesionales' });
};

router.post('/', verificarToken, esCliente, crearReporte);
router.get('/mis-reportes', verificarToken, esParticipante, obtenerMisReportes);
router.get('/pendientes', verificarToken, esAdministrador, obtenerReportesPendientes);
router.patch('/:id', verificarToken, esAdministrador, resolverReporte);

module.exports = router;
