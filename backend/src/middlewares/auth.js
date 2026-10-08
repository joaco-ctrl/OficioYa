
const jwt = require('jsonwebtoken');
const conexion = require('../config/database');

let usuarioLogueado = null;

function setUsuario(usuario) {
    usuarioLogueado = usuario;
}

function getUsuario() {
    return usuarioLogueado;
}

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET , (err, usuario) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido o expirado' });
        }
        req.usuario = usuario; 
        next();
    });
};


const esProfesional = (req, res, next) => {
    if (req.usuario.rol !== 'profesional') {
        return res.status(403).json({ mensaje: 'Acceso restringido solo para profesionales' });
    }

   
    const sql = 'SELECT id FROM profesionales WHERE user_id = ?';

    conexion.query(sql, [req.usuario.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error interno del servidor al validar rol' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Perfil profesional no encontrado' });
        }

       
        req.profesional_id = rows[0].id;
        next();
    });
};

const esCliente = (req, res, next) => {
    if (req.usuario.rol !== 'cliente') {
        return res.status(403).json({ mensaje: 'Acceso restringido solo para clientes' });
    }

    next();
};

const esAdministrador = (req, res, next) => {
    if (req.usuario.rol !== 'administrador') {
        return res.status(403).json({ mensaje: 'Acceso restringido solo para administradores' });
    }

    next();
};


module.exports = {
    setUsuario,
    getUsuario,
    verificarToken,
    esCliente,
    esProfesional,
    esAdministrador
};