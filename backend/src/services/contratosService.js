const conexion = require('../config/database');

const obtenerMisContratos = (usuarioId, callback) => {
    const sql = `
        SELECT
            c.id,
            c.presupuesto_id,
            c.estado,
            c.monto_acordado,
            c.created_at,
            p.id AS profesional_id,
            u.nombre AS profesional_nombre,
            u.apellido AS profesional_apellido,
            s.id AS servicio_id,
            s.titulo AS servicio_titulo
        FROM contratacion c
        INNER JOIN presupuestos pr ON pr.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = pr.servicio_id
        INNER JOIN profesionales p ON p.id = s.profesional_id
        INNER JOIN usuarios u ON u.id = p.user_id
        WHERE pr.user_id = ?
        ORDER BY c.id DESC
    `;

    conexion.query(sql, [usuarioId], callback);
};

const obtenerMisServiciosContratados = (profesionalId, callback) => {
    const sql = `
        SELECT
            c.id,
            c.presupuesto_id,
            c.estado,
            c.monto_acordado,
            c.created_at,
            pr.user_id AS usuario_id,
            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            s.id AS servicio_id,
            s.titulo AS servicio_titulo
        FROM contratacion c
        INNER JOIN presupuestos pr ON pr.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = pr.servicio_id
        INNER JOIN usuarios u ON u.id = pr.user_id
        WHERE s.profesional_id = ?
        ORDER BY c.id DESC
    `;

    conexion.query(sql, [profesionalId], callback);
};

const obtenerContratoPorId = (contratoId, callback) => {
    const sql = 'SELECT * FROM contratacion WHERE id = ?';

    conexion.query(sql, [contratoId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

const actualizarEstadoContrato = (contratoId, profesionalId, nuevoEstado, callback) => {
    const transiciones = {
        en_proceso: 'pendiente',
        finalizado: 'en_proceso',
        cancelado: ['pendiente', 'en_proceso']
    };

    const estadoActual = transiciones[nuevoEstado];

    if (!estadoActual) {
        return callback(new Error('Estado de contrato no válido'), null);
    }

    let sql = `
        UPDATE contratacion c
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        SET c.estado = ?
        WHERE c.id = ? AND s.profesional_id = ?
    `;

    let parametros = [nuevoEstado, contratoId, profesionalId];

    if (Array.isArray(estadoActual)) {
        sql += ` AND c.estado IN (?, ?)`;
        parametros = [nuevoEstado, contratoId, profesionalId, estadoActual[0], estadoActual[1]];
    } else {
        sql += ` AND c.estado = ?`;
        parametros = [nuevoEstado, contratoId, profesionalId, estadoActual];
    }

    conexion.query(sql, parametros, (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows > 0);
    });
};

const actualizarEstadoContratoUsuario = (contratoId, usuarioId, nuevoEstado, callback) => {
    if (nuevoEstado !== 'cancelado') {
        return callback(new Error('Solo el usuario puede cancelar un contrato'), null);
    }

    const sql = `
        UPDATE contratacion c
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        SET c.estado = ?
        WHERE c.id = ? AND p.user_id = ? AND c.estado IN ('pendiente', 'en_proceso')
    `;

    conexion.query(sql, [nuevoEstado, contratoId, usuarioId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows > 0);
    });
};

module.exports = {
    obtenerMisContratos,
    obtenerMisServiciosContratados,
    obtenerContratoPorId,
    actualizarEstadoContrato,
    actualizarEstadoContratoUsuario
};
