const express = require('express');
const router = express.Router();
const { verificarToken, esProfesional } = require('../middlewares/auth');
const {
    obtenerMiPerfil,
    obtenerPerfilPublico,
    actualizarMiPerfil
} = require('../controllers/profesionalController');

router.get('/mi-perfil', verificarToken, esProfesional, obtenerMiPerfil);
router.get('/:id', obtenerPerfilPublico);
router.put('/mi-perfil', verificarToken, esProfesional, actualizarMiPerfil);

module.exports = router;
