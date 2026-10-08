const valoracionesService = require('../services/valoracionesService');

const crearValoracion = (req, res) => {
    const { contratacion_id, puntuacion, comentario } = req.body;

    if (!contratacion_id || !puntuacion) {
        return res.status(400).json({ mensaje: 'La contratación y la puntuación son obligatorias' });
    }

    valoracionesService.crearValoracion({
        contratacion_id,
        usuario_id: req.usuario.id,
        puntuacion,
        comentario
    }, (err, valoracion) => {
        if (err) {
            return res.status(400).json({ mensaje: err.message || 'Error al registrar la valoración' });
        }

        return res.status(201).json({
            mensaje: 'Valoración registrada correctamente',
            valoracion
        });
    });
};

const obtenerValoracionesPorProfesional = (req, res) => {
    const profesionalId = Number(req.params.id);

    if (!profesionalId) {
        return res.status(400).json({ mensaje: 'El identificador del profesional es inválido' });
    }

    valoracionesService.obtenerValoracionesPorProfesional(profesionalId, (err, valoraciones) => {
        if (err) {
            console.error('Error al consultar valoraciones:', err);
            return res.status(500).json({ mensaje: 'Error al consultar las valoraciones' });
        }

        return res.status(200).json(valoraciones);
    });
};

const obtenerPromedioValoraciones = (req, res) => {
    const profesionalId = Number(req.params.id);

    valoracionesService.obtenerPromedioValoraciones(profesionalId, (err, promedio) => {
        if (err) {
            console.error('Error al consultar promedio:', err);
            return res.status(500).json({ mensaje: 'Error al consultar el promedio' });
        }

        return res.status(200).json(promedio);
    });
};

module.exports = {
    crearValoracion,
    obtenerValoracionesPorProfesional,
    obtenerPromedioValoraciones
};
