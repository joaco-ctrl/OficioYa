const conexion = require("../config/database")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

async function solicitarRecuperacion(email) {
  const frontendUrl = process.env.FRONTEND_URL
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT)
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const smtpFrom = process.env.SMTP_FROM

  if (!frontendUrl || !smtpHost || !Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535 ||
      !smtpUser || !smtpPassword || !smtpFrom) {
    const error = new Error('La configuración de correo para recuperación está incompleta')
    error.code = 'PASSWORD_RESET_EMAIL_NOT_CONFIGURED'
    throw error
  }

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: smtpUser, pass: smtpPassword }
  })
  await conexion.promise().query(
    'DELETE FROM password_reset_tokens WHERE expires_at <= NOW()'
  )
  const [usuarios] = await conexion.promise().query(
    'SELECT email FROM usuarios WHERE email = ? AND activo = 1 AND deleted_at IS NULL LIMIT 1',
    [email]
  )

  if (usuarios.length === 0) return

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  await conexion.promise().query('DELETE FROM password_reset_tokens WHERE email = ?', [email])
  await conexion.promise().query(
    'INSERT INTO password_reset_tokens (email, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 20 MINUTE))',
    [email, tokenHash]
  )

  const link = `${frontendUrl.replace(/\/$/, '')}/restablecer-contrasena?token=${encodeURIComponent(token)}`

  try {
    await transport.sendMail({
      from: smtpFrom,
      to: usuarios[0].email,
      subject: 'Recuperá tu contraseña de OficioYa',
      text: `Para crear una nueva contraseña, abrí este enlace (vence en 20 minutos): ${link}`,
      html: `<p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p><p><a href="${link}">Crear una nueva contraseña</a></p><p>El enlace vence en 20 minutos. Si no solicitaste este cambio, podés ignorar este correo.</p>`
    })
  } catch (error) {
    error.passwordResetDeliveryFailed = true
    try {
      await conexion.promise().query('DELETE FROM password_reset_tokens WHERE token_hash = ?', [tokenHash])
    } catch (cleanupError) {
      error.cleanupError = cleanupError
    }
    throw error
  }
}

async function restablecerContrasena(token, password) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const [tokensVigentes] = await conexion.promise().query(
    'SELECT email FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() LIMIT 1',
    [tokenHash]
  )
  if (tokensVigentes.length === 0) return false

  const passwordHash = await bcrypt.hash(password, 10)
  const connection = await conexion.promise().getConnection()
  let transactionStarted = false

  try {
    await connection.beginTransaction()
    transactionStarted = true
    const [tokens] = await connection.query(
      'SELECT email FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() FOR UPDATE',
      [tokenHash]
    )

    if (tokens.length === 0) {
      await connection.rollback()
      transactionStarted = false
      return false
    }

    const email = tokens[0].email
    const [result] = await connection.query(
      'UPDATE usuarios SET password = ? WHERE email = ? AND activo = 1 AND deleted_at IS NULL',
      [passwordHash, email]
    )

    if (result.affectedRows === 0) {
      await connection.rollback()
      transactionStarted = false
      return false
    }

    await connection.query('DELETE FROM password_reset_tokens WHERE email = ?', [email])
    await connection.commit()
    transactionStarted = false
    return true
  } catch (error) {
    if (transactionStarted) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        error.rollbackError = rollbackError
      }
    }
    throw error
  } finally {
    connection.release()
  }
}

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
  actualizarPerfilUsuario,
  solicitarRecuperacion,
  restablecerContrasena
}
