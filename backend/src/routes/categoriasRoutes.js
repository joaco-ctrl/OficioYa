const express = require('express');
const router = express.Router();

const{
    crearCategorias,
    obtenerCategorias,
    obtenerCategoriasporId,
    actualizarCategorias,
    borrarCategorias
} = require("../controllers/categoriasController")

router.post('/crear-categorias', crearCategorias);
router.get('/obtener-categorias', obtenerCategorias);
router.get('/obtener-categorias/:id', obtenerCategoriasporId);
router.put('/actualizar-categorias', actualizarCategorias);
router.delete('/borrar-categorias', borrarCategorias);

module.exports = router;