const express = require('express');
const router = express.Router();
const { verificarToken, esCliente, esProfesional } = require('../middlewares/auth');
const {
    obtenerMisContratos,
    obtenerMisServiciosContratados,
    iniciarContrato,
    finalizarContrato,
    cancelarContrato
} = require('../controllers/contratosController');

router.get('/mis-contratos', verificarToken, esCliente, obtenerMisContratos);
router.get('/mis-servicios', verificarToken, esProfesional, obtenerMisServiciosContratados);
router.patch('/:id/iniciar', verificarToken, esProfesional, iniciarContrato);
router.patch('/:id/finalizar', verificarToken, esProfesional, finalizarContrato);
router.patch('/:id/cancelar', verificarToken, esCliente, cancelarContrato);

module.exports = router;
