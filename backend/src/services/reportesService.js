const conexion = require('../config/database');

const crearReporte = (datosReporte, callback) => {
    const { contratacion_id, descripcion } = datosReporte;

    if (!contratacion_id || !descripcion) {
        return callback(new Error('La contratación y la descripción son obligatorias'), null);
    }

    const sql = `
        INSERT INTO reportes (contratacion_id, descripcion, estado)
        SELECT c.id, ?, 'pendiente'
        FROM contratacion c
        INNER JOIN presupuestos pr ON pr.id = c.presupuesto_id
        WHERE c.id = ? AND pr.user_id = ? AND c.estado = 'en_proceso'
    `;

    conexion.query(sql, [descripcion, contratacion_id, datosReporte.usuario_id], (err, result) => {
        if (err) return callback(err, null);

        if (result.affectedRows === 0) {
            return callback(new Error('La contratación no existe o no pertenece al usuario'), null);
        }

        return callback(null, {
            id: result.insertId,
            contratacion_id,
            descripcion,
            estado: 'pendiente'
        });
    });
};

const obtenerMisReportes = (usuarioId, rol, callback) => {
    const columnaUsuario = rol === 'profesional' ? 'pr.user_id' : 'p.user_id';
    const sql = `
        SELECT
            r.id,
            r.contratacion_id,
            r.descripcion,
            r.estado,
            r.created_at,
            s.titulo AS servicio_titulo,
            cliente.nombre AS usuario_nombre,
            cliente.apellido AS usuario_apellido,
            profesional.nombre AS profesional_nombre,
            profesional.apellido AS profesional_apellido
        FROM reportes r
        INNER JOIN contratacion c ON c.id = r.contratacion_id
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        INNER JOIN profesionales pr ON pr.id = s.profesional_id
        INNER JOIN usuarios cliente ON cliente.id = p.user_id
        INNER JOIN usuarios profesional ON profesional.id = pr.user_id
        WHERE ${columnaUsuario} = ?
        ORDER BY r.id DESC
    `;

    conexion.query(sql, [usuarioId], callback);
};

const obtenerReportesPendientes = (callback) => {
    const sql = `
        SELECT
            r.id,
            r.contratacion_id,
            r.descripcion,
            r.estado,
            r.created_at,
            cliente.nombre AS usuario_nombre,
            cliente.apellido AS usuario_apellido,
            profesional.nombre AS profesional_nombre,
            profesional.apellido AS profesional_apellido,
            s.titulo AS servicio_titulo
        FROM reportes r
        INNER JOIN contratacion c ON c.id = r.contratacion_id
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        INNER JOIN profesionales pr ON pr.id = s.profesional_id
        INNER JOIN usuarios profesional ON profesional.id = pr.user_id
        INNER JOIN usuarios cliente ON cliente.id = p.user_id
        WHERE r.estado = 'pendiente'
        ORDER BY r.id DESC
    `;

    conexion.query(sql, callback);
};

const resolverReporte = (reporteId, estado, callback) => {
    if (!['resuelto', 'desestimado'].includes(estado)) {
        return callback(new Error('Estado de reporte no válido'), null);
    }

    const sql = `
        UPDATE reportes
        SET estado = ?
        WHERE id = ? AND estado = 'pendiente'
    `;

    conexion.query(sql, [estado, reporteId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows > 0);
    });
};

module.exports = {
    crearReporte,
    obtenerMisReportes,
    obtenerReportesPendientes,
    resolverReporte
};
