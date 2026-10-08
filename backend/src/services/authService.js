const conexion = require("../config/database")



function login(data, callback) {
    const { email, password } = data;
    if (!email && !password) {
        return callback(new Error("datos incompletos"))
    } else {
        conexion.query(
            " SELECT * FROM usuarios WHERE email=?",
            [email],
            callback

        )
    }


}

function usuarioRegistro(data, callback) {
    const {email, password, telefono, nombre, apellido } = data
    if (!email && !password && !telefono && !nombre && !apellido) {
        return callback(new Error("datos incompletos"))
    } else {
        conexion.query
        (
            "INSERT INTO usuarios (email, password, telefono, nombre, apellido) VALUES (?, ?, ?, ?, ?)",
            [email, password, telefono, nombre, apellido],
            callback
        )
    }
}

const profesionalRegistro = async (data) => {
  const { 
    nombre, apellido, telefono, email, password, 
    biografia, zona, disponibilidad} = data;
    
  const conexion = await db.getConnection();

  try {
    await conexion.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlUsuario = `
      INSERT INTO usuarios (nombre, apellido, telefono, email, password, rol)
      VALUES (?, ?, ?, ?, ?, 'profesional')
    `;
    const [resultUsuario] = await conexion.query(sqlUsuario, [
      nombre, apellido, telefono, email, hashedPassword
    ]);

    const userId = resultUsuario.insertId;

    const sqlProfesional = `
      INSERT INTO profesionales (user_id, biografia, zona, disponibilidad, documento_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await conexion.query(sqlProfesional, [
      userId, biografia, zona, disponibilidad, documento_url
    ]);

    await conexion.commit();

    return { id: userId, email, rol: 'profesional' };

  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
};

module.exports = {
    login,
    usuarioRegistro,
    profesionalRegistro
}
