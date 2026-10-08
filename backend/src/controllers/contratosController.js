const contratosService = require('../services/contratosService');

const obtenerMisContratos = (req, res) => {
    contratosService.obtenerMisContratos(req.usuario.id, (err, contratos) => {
        if (err) {
            console.error('Error al consultar contratos:', err);
            return res.status(500).json({ mensaje: 'Error al consultar sus contratos' });
        }

        return res.status(200).json(contratos);
    });
};

const obtenerMisServiciosContratados = (req, res) => {
    contratosService.obtenerMisServiciosContratados(req.profesional_id, (err, contratos) => {
        if (err) {
            console.error('Error al consultar contratos del profesional:', err);
            return res.status(500).json({ mensaje: 'Error al consultar los contratos' });
        }

        return res.status(200).json(contratos);
    });
};

const iniciarContrato = (req, res) => {
    const contratoId = Number(req.params.id);

    contratosService.actualizarEstadoContrato(contratoId, req.profesional_id, 'en_proceso', (err, actualizado) => {
        if (err) {
            console.error('Error al iniciar contrato:', err);
            return res.status(400).json({ mensaje: err.message || 'Error al iniciar el contrato' });
        }

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado o no puede iniciarse' });
        }

        return res.status(200).json({ mensaje: 'Contrato iniciado correctamente' });
    });
};

const finalizarContrato = (req, res) => {
    const contratoId = Number(req.params.id);

    contratosService.actualizarEstadoContrato(contratoId, req.profesional_id, 'finalizado', (err, actualizado) => {
        if (err) {
            console.error('Error al finalizar contrato:', err);
            return res.status(400).json({ mensaje: err.message || 'Error al finalizar el contrato' });
        }

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado o no puede finalizarse' });
        }

        return res.status(200).json({ mensaje: 'Contrato finalizado correctamente' });
    });
};

const cancelarContrato = (req, res) => {
    const contratoId = Number(req.params.id);

    contratosService.actualizarEstadoContratoUsuario(contratoId, req.usuario.id, 'cancelado', (err, actualizado) => {
        if (err) {
            console.error('Error al cancelar contrato:', err);
            return res.status(400).json({ mensaje: err.message || 'Error al cancelar el contrato' });
        }

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado o no puede cancelarse' });
        }

        return res.status(200).json({ mensaje: 'Contrato cancelado correctamente' });
    });
};

module.exports = {
    obtenerMisContratos,
    obtenerMisServiciosContratados,
    iniciarContrato,
    finalizarContrato,
    cancelarContrato
};
