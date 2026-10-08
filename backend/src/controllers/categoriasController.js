const categoriasService = require('../services/categoriasService');

function crearCategorias(req, res) {
    const { nombre, descripcion } = req.body;
    categoriasService.crearCategorias({ nombre, descripcion }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(result);
    });
}

function obtenerCategorias( res) {
    categoriasService.obtenerCategorias( (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(result);
    });
}

function obtenerCategoriasporId(req, res) {
    const { id } = req.params;
    categoriasService.obtenerCategoriasPorId({ id }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(result);
    });
}

 function actualizarCategorias(req, res) {     
    const { nombre, descripcion } = req.body;
    categoriasService.actualizarCategorias({ nombre, descripcion }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(result);
    }); 

}
function borrarCategorias(req, res) {     
    const { id } = req.body;
    categoriasService.borrarCategorias({ id }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(result);
    }); 

}

module.exports={
    crearCategorias,
    obtenerCategorias,
    obtenerCategoriasporId,
    actualizarCategorias,
    borrarCategorias

}