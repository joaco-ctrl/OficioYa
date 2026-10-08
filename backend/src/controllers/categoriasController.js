const categoriasService = require('../services/categoriasService');

function crearCategorias(req, res) {
    const { nombre, descripcion } = req.body;
    categoriasService.crearCategorias({ nombre, descripcion }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(201).json(result);
    });
}

function obtenerCategorias(req, res) {
    categoriasService.obtenerCategorias( (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(200).json(result);
    });
}

function obtenerCategoriasporId(req, res) {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: 'El identificador de categoría es inválido' });
    }

    categoriasService.obtenerCategoriasPorId(id, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        return res.status(200).json(result[0]);
    });
}

function actualizarCategorias(req, res) {
    const { nombre, descripcion } = req.body;
    const { id } = req.body;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: 'El identificador de categoría es inválido' });
    }

    categoriasService.actualizarCategorias({ id, nombre, descripcion }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        return res.status(200).json(result);
    }); 

}
function borrarCategorias(req, res) {     
    const { id } = req.body;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: 'El identificador de categoría es inválido' });
    }

    categoriasService.borrarCategorias({ id }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        return res.status(200).json(result);
    }); 

}

module.exports={
    crearCategorias,
    obtenerCategorias,
    obtenerCategoriasporId,
    actualizarCategorias,
    borrarCategorias

}