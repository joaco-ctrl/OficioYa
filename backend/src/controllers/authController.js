const authService = require('../services/authService');
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "email y contraseña son obligatorios" })
    }

    authService.login({ email, password }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "error en la base de datos" })
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ error: "email o contraseña incorrectos" })
        }
        const usuario = results[0];
        const hashAlmacenado = usuario.password
        if (!hashAlmacenado) {
            return res.status(500).json({ error: "usuario sin contraseña registrada" })
        }
        bcrypt.compare(password, hashAlmacenado, (err, coincide) => {
            if (err) {
                return res.status(500).json({ error: "error al verificar contraseña" })
            }
            if (coincide) {
                if (!process.env.JWT_SECRET) {
                    return res.status(500).json({ error: "JWT_SECRET no está configurado" });
                }

                const token = jwt.sign(
                    { id: usuario.id, email: usuario.email, rol: usuario.rol },
                    process.env.JWT_SECRET
                );
                auth.setUsuario(usuario);
                res.json({
                    mensaje: "Login exitoso",
                    token: token,
                    usuario: {
                        email: usuario.email,
                        id: usuario.id,
                        rol: usuario.rol
                    }
                })
            }else{
                 return res.status(401).json({ error: "contraseña incorrecta" })
            }

        })

    })
}

function usuarioRegistro(req, res) {
    const { email, password, telefono, nombre, apellido } = req.body;
    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({ error: "nombre, apellido, email y contraseña son obligatorios" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: "Error al encriptar contraseña" });
        }
        authService.usuarioRegistro({ email, password: hash, telefono, nombre, apellido }, (err, results) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ mensaje: "Registro exitoso" });
        });
    });
}

function obtenerMiPerfil(req, res) {
    authService.obtenerPerfilUsuario(req.usuario.id, (err, perfil) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar el perfil' });
        if (!perfil) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        return res.status(200).json(perfil);
    });
}

function actualizarMiPerfil(req, res) {
    const { nombre, apellido, telefono } = req.body;
    if ((nombre !== undefined && !String(nombre).trim()) || (apellido !== undefined && !String(apellido).trim())) {
        return res.status(400).json({ mensaje: 'Nombre y apellido no pueden estar vacíos' });
    }

    authService.actualizarPerfilUsuario(req.usuario.id, { nombre, apellido, telefono }, (err, perfil) => {
        if (err) return res.status(400).json({ mensaje: err.message || 'Error al actualizar el perfil' });
        if (!perfil) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        return res.status(200).json({ mensaje: 'Perfil actualizado correctamente', perfil });
    });
}

async function solicitarRecuperacion(req, res) {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({ mensaje: 'Ingresá un correo electrónico válido.' });
      }

      try {
          await authService.solicitarRecuperacion(email);
          return res.status(202).json({
              mensaje: 'Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer la contraseña.'
          });
      } catch (error) {
          console.error('Error al procesar la recuperación de contraseña:', {
              code: error.code,
              message: error.message,
              cleanupError: error.cleanupError?.message
          });
          if (error.code === 'PASSWORD_RESET_EMAIL_NOT_CONFIGURED') {
              return res.status(503).json({
                  mensaje: 'La recuperación todavía no está configurada: falta configurar el servicio de correo (SMTP) en el backend.'
              });
          }
          if (error.passwordResetDeliveryFailed) {
              return res.status(202).json({
                  mensaje: 'Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer la contraseña.'
              });
          }
          return res.status(503).json({ mensaje: 'No se pudo procesar la solicitud. Intentá nuevamente más tarde.' });
      }
}

async function restablecerContrasena(req, res) {
      const { token, password } = req.body || {};
      if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
          return res.status(400).json({ mensaje: 'El enlace no es válido o venció. Solicitá uno nuevo.' });
      }
      if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') < 8 || Buffer.byteLength(password, 'utf8') > 72) {
          return res.status(400).json({ mensaje: 'La contraseña debe tener entre 8 y 72 bytes.' });
      }

      try {
          const actualizado = await authService.restablecerContrasena(token, password);
          if (!actualizado) {
              return res.status(400).json({ mensaje: 'El enlace no es válido o venció. Solicitá uno nuevo.' });
          }
          return res.status(200).json({ mensaje: 'Tu contraseña fue actualizada. Ya podés iniciar sesión.' });
      } catch (error) {
          console.error('Error al restablecer la contraseña:', error.code || error.message);
          return res.status(500).json({ mensaje: 'No se pudo cambiar la contraseña. Intentá nuevamente.' });
      }
}


     const profesionalRegistro = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
        const categoria_id = Number(req.body.categoria_id);

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    }

        if (!Number.isInteger(categoria_id) || categoria_id <= 0) {
            return res.status(400).json({ message: 'Seleccioná una categoría válida para tu servicio.' });
        }

        const nuevoProfesional = await authService.profesionalRegistro({ ...req.body, categoria_id });

    return res.status(201).json({
      message: 'Profesional registrado con éxito',
      data: nuevoProfesional
    });

  } catch (error) {
    console.error('Error al registrar profesional:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {
    login,
    usuarioRegistro,
    profesionalRegistro,
    obtenerMiPerfil,
    actualizarMiPerfil,
    solicitarRecuperacion,
    restablecerContrasena
}
