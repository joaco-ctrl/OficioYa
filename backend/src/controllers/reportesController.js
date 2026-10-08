const reportesService = require('../services/reportesService');

const crearReporte = (req, res) => {
    const { contratacion_id, descripcion } = req.body;

    if (!contratacion_id || !descripcion) {
        return res.status(400).json({ mensaje: 'La contratación y la descripción son obligatorias' });
    }

    reportesService.crearReporte({
        contratacion_id,
        descripcion,
        usuario_id: req.usuario.id
    }, (err, reporte) => {
        if (err) {
            return res.status(400).json({ mensaje: err.message || 'Error al registrar el reporte' });
        }

        return res.status(201).json({
            mensaje: 'Reporte registrado correctamente',
            reporte
        });
    });
};

const obtenerMisReportes = (req, res) => {
    reportesService.obtenerMisReportes(req.usuario.id, (err, reportes) => {
        if (err) {
            console.error('Error al consultar reportes:', err);
            return res.status(500).json({ mensaje: 'Error al consultar sus reportes' });
        }

        return res.status(200).json(reportes);
    });
};

const obtenerReportesPendientes = (req, res) => {
    reportesService.obtenerReportesPendientes((err, reportes) => {
        if (err) {
            console.error('Error al consultar reportes pendientes:', err);
            return res.status(500).json({ mensaje: 'Error al consultar los reportes pendientes' });
        }

        return res.status(200).json(reportes);
    });
};

const resolverReporte = (req, res) => {
    const reporteId = Number(req.params.id);
    const { estado } = req.body;

    reportesService.resolverReporte(reporteId, estado, (err, actualizado) => {
        if (err) {
            return res.status(400).json({ mensaje: err.message || 'Error al resolver el reporte' });
        }

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado o ya fue resuelto' });
        }

        return res.status(200).json({ mensaje: 'Reporte actualizado correctamente' });
    });
};

module.exports = {
    crearReporte,
    obtenerMisReportes,
    obtenerReportesPendientes,
    resolverReporte
};
