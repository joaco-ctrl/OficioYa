const express = require('express');
const router = express.Router();
const{
    login,  
    usuarioRegistro,
    profesionalRegistro
}=require('../controllers/authController');

router.post('/login', login);
router.post('/register', usuarioRegistro);
router.post('/profesional-register', profesionalRegistro);

module.exports = router;