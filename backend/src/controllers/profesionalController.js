const profesionalService = require('../services/profesionalService');

const obtenerMiPerfil = (req, res) => {
    profesionalService.obtenerPerfilProfesional(req.usuario.id, (err, perfil) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al consultar el perfil' });
        }

        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil profesional no encontrado' });
        }

        return res.status(200).json(perfil);
    });
};

const obtenerPerfilPublico = (req, res) => {
    const profesionalId = req.params.id;

    profesionalService.obtenerPerfilPublicoProfesional(profesionalId, (err, perfil) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al consultar el perfil' });
        }

        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil profesional no encontrado' });
        }

        return res.status(200).json(perfil);
    });
};

const actualizarMiPerfil = (req, res) => {
    const datos = req.body;

    profesionalService.actualizarPerfilProfesional(req.usuario.id, datos, (err, perfil) => {
        if (err) {
            return res.status(400).json({ mensaje: err.message || 'Error al actualizar el perfil' });
        }

        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil profesional no encontrado' });
        }

        return res.status(200).json({
            mensaje: 'Perfil actualizado correctamente',
            perfil
        });
    });
};

module.exports = {
    obtenerMiPerfil,
    obtenerPerfilPublico,
    actualizarMiPerfil
};
