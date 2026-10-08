const conexion = require('../config/database');

const crearValoracion = (datosValoracion, callback) => {
    const { contratacion_id, usuario_id, puntuacion, comentario } = datosValoracion;

    if (!contratacion_id || !usuario_id || !puntuacion) {
        return callback(new Error('La contratación, el usuario y la puntuación son obligatorios'), null);
    }

    if (puntuacion < 1 || puntuacion > 5) {
        return callback(new Error('La puntuación debe estar entre 1 y 5'), null);
    }

    const sql = `
        SELECT c.id, pr.user_id AS usuario_id
        FROM contratacion c
        INNER JOIN presupuestos pr ON pr.id = c.presupuesto_id
        WHERE c.id = ? AND c.estado = 'finalizado' AND pr.user_id = ?
    `;

    conexion.query(sql, [contratacion_id, usuario_id], (err, rows) => {
        if (err) return callback(err, null);

        if (rows.length === 0) {
            return callback(new Error('La contratación no existe, no está finalizada o no pertenece al usuario'), null);
        }

        const valoracionSql = `
            INSERT INTO valoraciones (contratacion_id, puntuacion, comentario)
            VALUES (?, ?, ?)
        `;

        conexion.query(valoracionSql, [contratacion_id, puntuacion, comentario || null], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return callback(new Error('La contratación ya tiene una valoración'), null);
                }
                return callback(err, null);
            }

            return callback(null, {
                id: result.insertId,
                contratacion_id,
                puntuacion,
                comentario,
                fecha: new Date().toISOString()
            });
        });
    });
};

const obtenerValoracionesPorProfesional = (profesionalId, callback) => {
    const sql = `
        SELECT
            v.id,
            v.contratacion_id,
            v.puntuacion,
            v.comentario,
            v.fecha,
            uc.nombre AS usuario_nombre,
            uc.apellido AS usuario_apellido
        FROM valoraciones v
        INNER JOIN contratacion c ON c.id = v.contratacion_id
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        INNER JOIN usuarios uc ON uc.id = p.user_id
        WHERE s.profesional_id = ?
        ORDER BY v.fecha DESC
    `;

    conexion.query(sql, [profesionalId], callback);
};

const obtenerValoracionPorContrato = (contratacionId, callback) => {
    const sql = 'SELECT * FROM valoraciones WHERE contratacion_id = ?';

    conexion.query(sql, [contratacionId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

const obtenerPromedioValoraciones = (profesionalId, callback) => {
    const sql = `
        SELECT
            ROUND(AVG(v.puntuacion), 2) AS promedio,
            COUNT(v.id) AS cantidad
        FROM valoraciones v
        INNER JOIN contratacion c ON c.id = v.contratacion_id
        INNER JOIN presupuestos p ON p.id = c.presupuesto_id
        INNER JOIN servicios s ON s.id = p.servicio_id
        WHERE s.profesional_id = ?
    `;

    conexion.query(sql, [profesionalId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

module.exports = {
    crearValoracion,
    obtenerValoracionesPorProfesional,
    obtenerValoracionPorContrato,
    obtenerPromedioValoraciones
};
