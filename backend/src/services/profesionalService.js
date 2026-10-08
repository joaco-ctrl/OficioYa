const conexion = require('../config/database');

const obtenerPerfilProfesional = (userId, callback) => {
    const sql = `
        SELECT
            u.id AS usuario_id,
            u.nombre,
            u.apellido,
            u.telefono,
            u.email,
            p.id AS profesional_id,
            p.biografia,
            p.zona,
            p.disponibilidad,
            p.confianza
        FROM usuarios u
        INNER JOIN profesionales p ON p.user_id = u.id
        WHERE u.id = ?
    `;

    conexion.query(sql, [userId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

const obtenerPerfilPublicoProfesional = (profesionalId, callback) => {
    const sql = `
        SELECT
            u.id AS usuario_id,
            u.nombre,
            u.apellido,
            p.id AS profesional_id,
            p.biografia,
            p.zona,
            p.disponibilidad,
            p.confianza
        FROM usuarios u
        INNER JOIN profesionales p ON p.user_id = u.id
        WHERE p.id = ?
    `;

    conexion.query(sql, [profesionalId], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows[0] || null);
    });
};

const actualizarPerfilProfesional = (userId, datos, callback) => {
    const {
        nombre,
        apellido,
        telefono,
        biografia,
        zona,
        disponibilidad
    } = datos;

    if (!nombre && !apellido && !telefono && !biografia && !zona && !disponibilidad ) {
        return callback(new Error('No se recibieron campos para actualizar'), null);
    }

    const connection = conexion.promise();

    connection.beginTransaction()
        .then(() => {
            const camposUsuario = [];
            const valoresUsuario = [];

            if (nombre !== undefined) {
                camposUsuario.push('nombre = ?');
                valoresUsuario.push(nombre);
            }

            if (apellido !== undefined) {
                camposUsuario.push('apellido = ?');
                valoresUsuario.push(apellido);
            }

            if (telefono !== undefined) {
                camposUsuario.push('telefono = ?');
                valoresUsuario.push(telefono);
            }

            const camposProfesional = [];
            const valoresProfesional = [];

            if (biografia !== undefined) {
                camposProfesional.push('biografia = ?');
                valoresProfesional.push(biografia || null);
            }

            if (zona !== undefined) {
                camposProfesional.push('zona = ?');
                valoresProfesional.push(zona || null);
            }

            if (disponibilidad !== undefined) {
                camposProfesional.push('disponibilidad = ?');
                valoresProfesional.push(disponibilidad || null);
            }

            const consultas = [];

            if (camposUsuario.length > 0) {
                consultas.push(
                    connection.query(
                        `UPDATE usuarios SET ${camposUsuario.join(', ')} WHERE id = ?`,
                        [...valoresUsuario, userId]
                    )
                );
            }

            if (camposProfesional.length > 0) {
                consultas.push(
                    connection.query(
                        `UPDATE profesionales SET ${camposProfesional.join(', ')} WHERE user_id = ?`,
                        [...valoresProfesional, userId]
                    )
                );
            }

            return Promise.all(consultas).then(() => connection.commit());
        })
        .then(() => obtenerPerfilProfesional(userId, callback))
        .catch((err) => {
            connection.rollback()
                .then(() => callback(err, null))
                .catch(() => callback(err, null));
        });
};

module.exports = {
    obtenerPerfilProfesional,
    obtenerPerfilPublicoProfesional,
    actualizarPerfilProfesional
};
