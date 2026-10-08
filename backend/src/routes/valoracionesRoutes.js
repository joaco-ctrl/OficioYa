const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
    crearValoracion,
    obtenerValoracionesPorProfesional,
    obtenerPromedioValoraciones
} = require('../controllers/valoracionesController');

router.post('/', verificarToken, crearValoracion);
router.get('/profesional/:id', obtenerValoracionesPorProfesional);
router.get('/profesional/:id/promedio', obtenerPromedioValoraciones);

module.exports = router;
