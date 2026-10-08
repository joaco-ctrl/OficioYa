const express = require('express');
const router = express.Router();
const { verificarToken, esProfesional } = require('../middlewares/auth');
const {
    crearPresupuesto,
    obtenerMisPresupuestos,
    obtenerMisSolicitudes,
    actualizarPresupuesto,
    rechazarPresupuesto,
    aceptarPresupuesto
} = require('../controllers/presupuestosController');

router.post('/', verificarToken, crearPresupuesto);
router.get('/mis-presupuestos', verificarToken, obtenerMisPresupuestos);
router.get('/mis-solicitudes', verificarToken, esProfesional, obtenerMisSolicitudes);
router.put('/:id', verificarToken, esProfesional, actualizarPresupuesto);
router.patch('/:id/rechazar', verificarToken, esProfesional, rechazarPresupuesto);
router.patch('/:id/aceptar', verificarToken, aceptarPresupuesto);

module.exports = router;
