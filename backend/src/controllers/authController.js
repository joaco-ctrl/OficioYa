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


   const profesionalRegistro = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    }

    const nuevoProfesional = await authService.profesionalRegistro(req.body);

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
    profesionalRegistro
}
