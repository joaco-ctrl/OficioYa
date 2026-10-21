const conexion = require("../config/database")


function crearCategorias(data, callback) {
    const { nombre, descripcion } = data
    const nombreLimpio = String(nombre || '').trim()
    const descripcionLimpia = descripcion == null ? null : String(descripcion).trim()

    if (!nombreLimpio) {
        return callback(new Error("nombre incompleto"))
    }

    conexion.query(
        "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
        [nombreLimpio, descripcionLimpia || null],
        callback
    )
}

function obtenerCategoriasPorId(id, callback) {
    conexion.query(
        "SELECT * FROM categorias WHERE id = ?",
        [Number(id)],
        callback
    )
}


function obtenerCategorias(callback) {
conexion.query("SELECT * FROM categorias ",callback)
}

function borrarCategorias(data, callback) {
    const  id  = Number(data.id)
    if (!Number.isInteger(id) || id <= 0) {
        return callback(new Error("identificador de categoría inválido"))
    }

    conexion.query(
        "DELETE FROM categorias WHERE id = ?",
        [id],
        callback
    )
}

function actualizarCategorias(data, callback){
    const { nombre, descripcion } = data
    const id = Number(data.id)
    const nombreLimpio = String(nombre || '').trim()
    const descripcionLimpia = descripcion == null ? null : String(descripcion).trim()

    if (!Number.isInteger(id) || id <= 0 || !nombreLimpio) {
        return callback(new Error("datos incompletos"))
    }

    conexion.query(
        "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
        [nombreLimpio, descripcionLimpia || null, id],
        callback
    )
}


module.exports = {
    crearCategorias,
    obtenerCategoriasPorId,
    obtenerCategorias,
    borrarCategorias,
    actualizarCategorias
}