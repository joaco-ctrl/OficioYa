const express = require('express');
const router = express.Router();
const { verificarToken, esCliente } = require('../middlewares/auth');
const {
    crearValoracion,
    obtenerValoracionesPorProfesional,
    obtenerPromedioValoraciones
} = require('../controllers/valoracionesController');

router.post('/', verificarToken, esCliente, crearValoracion);
router.get('/profesional/:id', obtenerValoracionesPorProfesional);
router.get('/profesional/:id/promedio', obtenerPromedioValoraciones);

module.exports = router;
