const express = require('express');
const router = express.Router();
const { verificarToken, esCliente, esAdministrador } = require('../middlewares/auth');
const {
    crearReporte,
    obtenerMisReportes,
    obtenerReportesPendientes,
    resolverReporte
} = require('../controllers/reportesController');

router.post('/', verificarToken, esCliente, crearReporte);
router.get('/mis-reportes', verificarToken, esCliente, obtenerMisReportes);
router.get('/pendientes', verificarToken, esAdministrador, obtenerReportesPendientes);
router.patch('/:id', verificarToken, esAdministrador, resolverReporte);

module.exports = router;
