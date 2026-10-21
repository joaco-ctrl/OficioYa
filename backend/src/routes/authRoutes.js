const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const{
    login,  
    usuarioRegistro,
    profesionalRegistro,
    obtenerMiPerfil,
    actualizarMiPerfil
}=require('../controllers/authController');

router.post('/login', login);
router.post('/register', usuarioRegistro);
router.post('/profesional-register', profesionalRegistro);
router.get('/mi-perfil', verificarToken, obtenerMiPerfil);
router.put('/mi-perfil', verificarToken, actualizarMiPerfil);

module.exports = router;