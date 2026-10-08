const conexion = require("../config/database")


function crearCategorias(data, callback) {
    const { nombre, descripcion } = data
    if (!nombre) {
        return callback(new Error("nombre incompleto"))
    } else {
        conexion.query
            (
                "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
                [nombre, descripcion],
                callback
            )
    }
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
    const {  nombre, descripcion } = data
    const id = Number(data.id)
    if (!Number.isInteger(id) || id <= 0 || !nombre) {
        return callback(new Error("datos incompletos"))
    }else{
        conexion.query(
            "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
            [nombre, descripcion, id],
            callback
        )
    }
}


module.exports = {
    crearCategorias,
    obtenerCategoriasPorId,
    obtenerCategorias,
    borrarCategorias,
    actualizarCategorias
}