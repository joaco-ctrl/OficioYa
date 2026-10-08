const express = require('express');
const router = express.Router();
const { verificarToken, esAdministrador } = require('../middlewares/auth');

const{
    crearCategorias,
    obtenerCategorias,
    obtenerCategoriasporId,
    actualizarCategorias,
    borrarCategorias
} = require("../controllers/categoriasController")

router.post('/crear-categorias', verificarToken, esAdministrador, crearCategorias);
router.get('/obtener-categorias', obtenerCategorias);
router.get('/obtener-categorias/:id', obtenerCategoriasporId);
router.put('/actualizar-categorias', verificarToken, esAdministrador, actualizarCategorias);
router.delete('/borrar-categorias', verificarToken, esAdministrador, borrarCategorias);

module.exports = router;