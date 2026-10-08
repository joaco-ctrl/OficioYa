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

const profesionalRegistro = async (data) => {
  const { 
    nombre, apellido, telefono, email, password, 
    biografia, zona, disponibilidad, documento_url} = data;
    
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
    await connection.query(sqlProfesional, [
      userId, biografia || null, zona || null, disponibilidad || null, documento_url || null
    ]);

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
    profesionalRegistro
}
