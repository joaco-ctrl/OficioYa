const conexion = require("../config/database")
const bcrypt = require("bcrypt")



function login(data, callback) {
    const { email, password } = data;
    if (!email || !password) {
        return callback(new Error("datos incompletos"))
    }

    conexion.query(
        "SELECT * FROM usuarios WHERE email = ? AND activo = 1 AND deleted_at IS NULL",
        [email],
        callback
    )

}

function usuarioRegistro(data, callback) {
    const {email, password, telefono, nombre, apellido } = data
    if (!email || !password || !nombre || !apellido) {
        return callback(new Error("datos incompletos"))
    }

    conexion.query(
        "INSERT INTO usuarios (email, password, telefono, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?, 'cliente')",
        [email, password, telefono || null, nombre, apellido],
        callback
    )
}

function obtenerPerfilUsuario(usuarioId, callback) {
  conexion.query(
    'SELECT id, nombre, apellido, telefono, email, rol FROM usuarios WHERE id = ? AND activo = 1 AND deleted_at IS NULL',
    [usuarioId],
    (err, rows) => callback(err, rows?.[0] || null)
  );
}

function actualizarPerfilUsuario(usuarioId, datos, callback) {
  const { nombre, apellido, telefono } = datos;
  if (![nombre, apellido, telefono].some((valor) => valor !== undefined)) {
    return callback(new Error('No se recibieron campos para actualizar'), null);
  }

  const campos = [];
  const valores = [];
  if (nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }
  if (apellido !== undefined) {
    campos.push('apellido = ?');
    valores.push(apellido);
  }
  if (telefono !== undefined) {
    campos.push('telefono = ?');
    valores.push(telefono || null);
  }

  conexion.query(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
    [...valores, usuarioId],
    (err) => {
      if (err) return callback(err, null);
      obtenerPerfilUsuario(usuarioId, callback);
    }
  );
}

const profesionalRegistro = async (data) => {
  const { 
    nombre, apellido, telefono, email, password, 
    biografia, zona, disponibilidad, documento_url, categoria_id} = data;
    
  const connection = await conexion.promise().getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlUsuario = `
      INSERT INTO usuarios (nombre, apellido, telefono, email, password, rol)
      VALUES (?, ?, ?, ?, ?, 'profesional')
    `;
    const [resultUsuario] = await connection.query(sqlUsuario, [
      nombre, apellido, telefono, email, hashedPassword
    ]);

    const userId = resultUsuario.insertId;

    const sqlProfesional = `
      INSERT INTO profesionales (user_id, biografia, zona, disponibilidad, documento_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [resultProfesional] = await connection.query(sqlProfesional, [
      userId, biografia || null, zona || null, disponibilidad || null, documento_url || null
    ]);
    const profesionalId = resultProfesional.insertId;

    const [categorias] = await connection.query(
      'SELECT nombre FROM categorias WHERE id = ?',
      [categoria_id]
    );
    if (categorias.length === 0) {
      throw new Error('La categoría seleccionada no existe');
    }

    await connection.query(
      'INSERT INTO servicios (profesional_id, categoria_id, titulo) VALUES (?, ?, ?)',
      [profesionalId, categoria_id, categorias[0].nombre]
    );

    await connection.commit();

    return { id: userId, email, rol: 'profesional' };

  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      error.rollbackError = rollbackError;
    }
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
    login,
    usuarioRegistro,
  profesionalRegistro,
  obtenerPerfilUsuario,
  actualizarPerfilUsuario
}
