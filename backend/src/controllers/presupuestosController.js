const presupuestosService = require('../services/presupuestosService');

const crearPresupuesto = (req, res) => {
    const { descripcion, condiciones, monto_estimado } = req.body;
    const servicioId = Number(req.body.servicio_id);

    if (!Number.isInteger(servicioId) || servicioId <= 0 || typeof descripcion !== 'string' || !descripcion.trim()) {
        return res.status(400).json({ mensaje: 'El servicio y la descripción son obligatorios' });
    }

    const datosPresupuesto = {
        user_id: req.usuario.id,
        servicio_id: servicioId,
        descripcion,
        condiciones,
        monto_estimado
    };

    presupuestosService.crearPresupuesto(datosPresupuesto, (err, presupuesto) => {
        if (err) {
            console.error('Error al crear presupuesto:', err);
            return res.status(500).json({ mensaje: 'Error al registrar el presupuesto' });
        }

        return res.status(201).json({
            mensaje: 'Presupuesto solicitado correctamente',
            presupuesto
        });
    });
};

const obtenerMisPresupuestos = (req, res) => {
    presupuestosService.obtenerMisPresupuestos(req.usuario.id, (err, presupuestos) => {
        if (err) {
            console.error('Error al consultar presupuestos:', err);
            return res.status(500).json({ mensaje: 'Error al consultar sus presupuestos' });
        }

        return res.status(200).json(presupuestos);
    });
};

const obtenerMisSolicitudes = (req, res) => {
    presupuestosService.obtenerMisSolicitudes(req.profesional_id, (err, presupuestos) => {
        if (err) {
            console.error('Error al consultar solicitudes:', err);
            return res.status(500).json({ mensaje: 'Error al consultar las solicitudes' });
        }

        return res.status(200).json(presupuestos);
    });
};

const actualizarPresupuesto = (req, res) => {
    const presupuestoId = Number(req.params.id);
    const { descripcion, condiciones, monto_estimado } = req.body;
    const cambios = [descripcion, condiciones, monto_estimado];

    if (cambios.every((valor) => valor === undefined)) {
        return res.status(400).json({ mensaje: 'No se recibieron campos para actualizar' });
    }

    if (!Number.isInteger(presupuestoId) || presupuestoId <= 0) {
        return res.status(400).json({ mensaje: 'El identificador del presupuesto es inválido' });
    }

    presupuestosService.actualizarPresupuesto(presupuestoId, req.profesional_id, { descripcion, condiciones, monto_estimado }, (err, actualizado) => {
        if (err) {
            console.error('Error al actualizar presupuesto:', err);
            return res.status(500).json({ mensaje: 'Error al actualizar el presupuesto' });
        }

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Presupuesto no encontrado o no tiene permisos para editarlo' });
        }

        return res.status(200).json({ mensaje: 'Presupuesto actualizado correctamente' });
    });
};

const rechazarPresupuesto = (req, res) => {
    const presupuestoId = Number(req.params.id);

    presupuestosService.rechazarPresupuesto(presupuestoId, req.profesional_id, (err, rechazado) => {
        if (err) {
            console.error('Error al rechazar presupuesto:', err);
            return res.status(500).json({ mensaje: 'Error al rechazar el presupuesto' });
        }

        if (!rechazado) {
            return res.status(404).json({ mensaje: 'Presupuesto no encontrado o no puede ser rechazado' });
        }

        return res.status(200).json({ mensaje: 'Presupuesto rechazado correctamente' });
    });
};

const aceptarPresupuesto = (req, res) => {
    const presupuestoId = Number(req.params.id);

    presupuestosService.aceptarPresupuesto(presupuestoId, req.usuario.id, (err, contrato) => {
        if (err) {
            console.error('Error al aceptar presupuesto:', err);
            return res.status(400).json({ mensaje: err.message || 'Error al aceptar el presupuesto' });
        }

        return res.status(201).json({
            mensaje: 'Presupuesto aceptado correctamente',
            contrato
        });
    });
};

module.exports = {
    crearPresupuesto,
    obtenerMisPresupuestos,
    obtenerMisSolicitudes,
    actualizarPresupuesto,
    rechazarPresupuesto,
    aceptarPresupuesto
};
