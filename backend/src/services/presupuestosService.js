const conexion = require('../config/database');

const crearPresupuesto = (datosPresupuesto, callback) => {
    const {
        user_id,
        servicio_id,
        descripcion,
        condiciones,
        monto_estimado
    } = datosPresupuesto;

    if (!user_id || !servicio_id || !descripcion) {
        return callback(new Error('El usuario, el servicio y la descripción son obligatorios'), null);
    }

    const sql = `
        INSERT INTO presupuestos (
            user_id,
            servicio_id,
            descripcion,
            condiciones,
            monto_estimado,
            estado
        ) VALUES (?, ?, ?, ?, ?, 'pendiente')
    `;

    conexion.query(
        sql,
        [user_id, servicio_id, descripcion, condiciones || null, monto_estimado || null],
        (err, result) => {
            if (err) return callback(err, null);

            return callback(null, {
                id: result.insertId,
                user_id,
                servicio_id,
                descripcion,
                condiciones,
                monto_estimado,
                estado: 'pendiente'
            });
        }
    );
};

const obtenerMisPresupuestos = (usuarioId, callback) => {
    const sql = `
        SELECT
            p.id,
            p.servicio_id,
            s.titulo AS servicio_titulo,
            p.descripcion,
            p.condiciones,
            p.monto_estimado,
            p.estado,
            p.created_at,
            u.id AS profesional_id,
            u.nombre AS profesional_nombre,
            u.apellido AS profesional_apellido
        FROM presupuestos p
        INNER JOIN servicios s ON s.id = p.servicio_id
        INNER JOIN profesionales pr ON pr.id = s.profesional_id
        INNER JOIN usuarios u ON u.id = pr.user_id
        WHERE p.user_id = ?
        ORDER BY p.id DESC
    `;

    conexion.query(sql, [usuarioId], callback);
};

const obtenerMisSolicitudes = (profesionalId, callback) => {
    const sql = `
        SELECT
            p.id,
            p.user_id AS usuario_id,
            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            p.servicio_id,
            s.titulo AS servicio_titulo,
            p.descripcion,
            p.condiciones,
            p.monto_estimado,
            p.estado,
            p.created_at
        FROM presupuestos p
        INNER JOIN servicios s ON s.id = p.servicio_id
        INNER JOIN usuarios u ON u.id = p.user_id
        WHERE s.profesional_id = ?
        ORDER BY p.id DESC
    `;

    conexion.query(sql, [profesionalId], callback);
};

const obtenerPresupuestoPorId = (presupuestoId, callback) => {
    const sql = 'SELECT * FROM presupuestos WHERE id = ?';

    conexion.query(sql, [presupuestoId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

const actualizarPresupuesto = (presupuestoId, profesionalId, datos, callback) => {
    const { descripcion, condiciones, monto_estimado } = datos;

    if (!descripcion && !condiciones && !monto_estimado) {
        return callback(new Error('No se recibieron campos para actualizar'), null);
    }

    const sql = `
        UPDATE presupuestos p
        INNER JOIN servicios s ON s.id = p.servicio_id
        SET p.descripcion = ?, p.condiciones = ?, p.monto_estimado = ?
        WHERE p.id = ? AND s.profesional_id = ? AND p.estado = 'pendiente'
    `;

    conexion.query(
        sql,
        [descripcion || null, condiciones || null, monto_estimado || null, presupuestoId, profesionalId],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result.affectedRows > 0);
        }
    );
};

const rechazarPresupuesto = (presupuestoId, profesionalId, callback) => {
    const sql = `
        UPDATE presupuestos p
        INNER JOIN servicios s ON s.id = p.servicio_id
        SET p.estado = 'rechazado'
        WHERE p.id = ? AND s.profesional_id = ? AND p.estado = 'pendiente'
    `;

    conexion.query(sql, [presupuestoId, profesionalId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows > 0);
    });
};

const aceptarPresupuesto = (presupuestoId, usuarioId, callback) => {
    const connection = conexion.promise();

    connection.beginTransaction()
        .then(() => {
            const presupuestoSql = `
                SELECT
                    p.id,
                    p.user_id AS usuario_id,
                    p.servicio_id,
                    s.profesional_id,
                    p.monto_estimado,
                    p.estado
                FROM presupuestos p
                INNER JOIN servicios s ON s.id = p.servicio_id
                WHERE p.id = ? AND p.user_id = ?
            `;

            return connection.query(presupuestoSql, [presupuestoId, usuarioId])
                .then(([rows]) => {
                    if (rows.length === 0) {
                        throw new Error('Presupuesto no encontrado o no pertenece al usuario');
                    }

                    const presupuesto = rows[0];

                    if (presupuesto.estado !== 'pendiente') {
                        throw new Error('El presupuesto no puede ser aceptado en su estado actual');
                    }

                    if (!presupuesto.monto_estimado) {
                        throw new Error('El presupuesto debe contener un monto estimado para ser aceptado');
                    }

                    const contratoSql = `
                        INSERT INTO contratacion (
                            presupuesto_id,
                            estado,
                            monto_acordado
                        ) VALUES (?, 'pendiente', ?)
                    `;

                    return connection.query(contratoSql, [
                        presupuesto.id,
                        presupuesto.monto_estimado
                    ]).then(([result]) => {
                        const contratoId = result.insertId;

                        return connection.query(
                            'UPDATE presupuestos SET estado = ? WHERE id = ?',
                            ['aceptado', presupuestoId]
                        ).then(() => ({
                            id: contratoId,
                            presupuesto_id: presupuesto.id,
                            monto_acordado: presupuesto.monto_estimado,
                            estado: 'pendiente'
                        }));
                    });
                });
        })
        .then((contrato) => {
            return connection.commit()
                .then(() => callback(null, contrato));
        })
        .catch((err) => {
            connection.rollback()
                .then(() => callback(err, null))
                .catch(() => callback(err, null));
        });
};

module.exports = {
    crearPresupuesto,
    obtenerMisPresupuestos,
    obtenerMisSolicitudes,
    obtenerPresupuestoPorId,
    actualizarPresupuesto,
    rechazarPresupuesto,
    aceptarPresupuesto
};
