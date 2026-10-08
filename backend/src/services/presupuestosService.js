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
    const actualizaciones = [];
    const valores = [];

    if (descripcion !== undefined) {
        actualizaciones.push('p.descripcion = ?');
        valores.push(descripcion || null);
    }

    if (condiciones !== undefined) {
        actualizaciones.push('p.condiciones = ?');
        valores.push(condiciones || null);
    }

    if (monto_estimado !== undefined) {
        const monto = Number(monto_estimado);
        if (!Number.isFinite(monto) || monto <= 0) {
            return callback(new Error('El monto estimado debe ser un número mayor que cero'), null);
        }
        actualizaciones.push('p.monto_estimado = ?');
        valores.push(monto);
    }

    if (actualizaciones.length === 0) {
        return callback(new Error('No se recibieron campos para actualizar'), null);
    }

    actualizaciones.push("p.estado = 'respondido'");
    const sql = `
        UPDATE presupuestos p
        INNER JOIN servicios s ON s.id = p.servicio_id
        SET ${actualizaciones.join(', ')}
        WHERE p.id = ? AND s.profesional_id = ? AND p.estado = 'pendiente'
    `;

    conexion.query(
        sql,
        [...valores, presupuestoId, profesionalId],
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
    (async () => {
        let connection;
        let transactionStarted = false;
        let contrato;
        let error;

        try {
            connection = await conexion.promise().getConnection();
            await connection.beginTransaction();
            transactionStarted = true;

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
                FOR UPDATE
            `;
            const [rows] = await connection.query(presupuestoSql, [presupuestoId, usuarioId]);

            if (rows.length === 0) {
                throw new Error('Presupuesto no encontrado o no pertenece al usuario');
            }

            const presupuesto = rows[0];
            if (presupuesto.estado !== 'respondido') {
                throw new Error('El presupuesto debe haber sido respondido antes de aceptarlo');
            }

            const montoAcordado = Number(presupuesto.monto_estimado);
            if (!Number.isFinite(montoAcordado) || montoAcordado <= 0) {
                throw new Error('El presupuesto debe contener un monto mayor que cero para ser aceptado');
            }

            const contratoSql = `
                INSERT INTO contratacion (presupuesto_id, estado, monto_acordado)
                VALUES (?, 'pendiente', ?)
            `;
            const [result] = await connection.query(contratoSql, [
                presupuesto.id,
                montoAcordado
            ]);

            const [actualizacion] = await connection.query(
                "UPDATE presupuestos SET estado = 'aceptado' WHERE id = ? AND estado = 'respondido'",
                [presupuestoId]
            );
            if (actualizacion.affectedRows !== 1) {
                throw new Error('El presupuesto ya no está disponible para aceptar');
            }

            await connection.commit();
            transactionStarted = false;
            contrato = {
                id: result.insertId,
                presupuesto_id: presupuesto.id,
                monto_acordado: montoAcordado,
                estado: 'pendiente'
            };
        } catch (err) {
            error = err;
            if (connection && transactionStarted) {
                try {
                    await connection.rollback();
                } catch (rollbackError) {
                    error.rollbackError = rollbackError;
                }
            }
        } finally {
            if (connection) connection.release();
        }

        callback(error || null, contrato || null);
    })();
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
