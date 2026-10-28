const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const { verificarToken } = require('../middlewares/auth');
const{
    login,  
    usuarioRegistro,
    profesionalRegistro,
    obtenerMiPerfil,
    actualizarMiPerfil,
    solicitarRecuperacion,
    restablecerContrasena
}=require('../controllers/authController');

const limiteRecuperacion = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { mensaje: 'Demasiados intentos. Esperá unos minutos e intentá nuevamente.' }
});

router.post('/login', login);
router.post('/register', usuarioRegistro);
router.post('/profesional-register', profesionalRegistro);
router.post('/recuperar-contrasena', limiteRecuperacion, solicitarRecuperacion);
router.post('/restablecer-contrasena', limiteRecuperacion, restablecerContrasena);
router.get('/mi-perfil', verificarToken, obtenerMiPerfil);
router.put('/mi-perfil', verificarToken, actualizarMiPerfil);

module.exports = router;