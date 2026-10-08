const conexion = require('../config/database');

const crearReporte = (datosReporte, callback) => {
    const { contratacion_id, descripcion } = datosReporte;

    if (!contratacion_id || !descripcion) {
        return callback(new Error('La contratación y la descripción son obligatorias'), null);
    }

    const sql = `
        SELECT c.id, pr.user_id AS usuario_id
        FROM contratacion c
        INNER JOIN presupuestos pr ON pr.id = c.presupuesto_id
        WHERE c.id = ? AND pr.user_id = ?
    `;

    conexion.query(sql, [contratacion_id, datosReporte.usuario_id], (err, rows) => {
        if (err) return callback(err, null);

        if (rows.length === 0) {
            return callback(new Error('La contratación no existe o no pertenece al usuario'), null);
        }

        const reporteSql = `
            INSERT INTO reportes (contratacion_id, descripcion, estado)
            VALUES (?, ?, 'pendiente')
        `;

        conexion.query(reporteSql, [contratacion_id, descripcion], (err, result) => {
            if (err) return callback(err, null);

            return callback(null, {
                id: result.insertId,
                contratacion_id,
                descripcion,
                estado: 'pendiente'
            });
        });
    });
};

const obtenerMisReportes = (usuarioId, callback) => {
    const sql = `
        SELECT
            r.id,
            r.contratacion_id,
            r.descripcion,
            r.estado,
            r.created_at,
            s.titulo AS servicio_titulo
        FROM reportes r
        INNER JOIN contratacion c ON c.id = r.contratacion_id
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        WHERE p.user_id = ?
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
            r.created_at
        FROM reportes r
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
