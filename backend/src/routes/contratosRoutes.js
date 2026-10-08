const express = require('express');
const router = express.Router();
const { verificarToken, esProfesional } = require('../middlewares/auth');
const {
    obtenerMisContratos,
    obtenerMisServiciosContratados,
    iniciarContrato,
    finalizarContrato,
    cancelarContrato
} = require('../controllers/contratosController');

router.get('/mis-contratos', verificarToken, obtenerMisContratos);
router.get('/mis-servicios', verificarToken, esProfesional, obtenerMisServiciosContratados);
router.patch('/:id/iniciar', verificarToken, esProfesional, iniciarContrato);
router.patch('/:id/finalizar', verificarToken, esProfesional, finalizarContrato);
router.patch('/:id/cancelar', verificarToken, cancelarContrato);

module.exports = router;
