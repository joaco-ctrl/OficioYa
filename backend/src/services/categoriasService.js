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

function obtenerCategoriasPorId(data, callback) {
    const { id } = Number(data)
    conexion.query(
        "SELECT * FROM categorias WHERE id = ?",
        [id],
        callback
    )
}


function obtenerCategorias(callback) {
conexion.query("SELECT * FROM categorias ",callback)
}

function borrarCategorias(data, callback) {
    const  id  = Number(data.id)
    conexion.query(
        "DELETE FROM categorias WHERE id = ?",
        [id],
        callback
    )
}

function actualizarCategorias(data, callback){
    const {  nombre, descripcion } = data
    const id = Number(data.id)
    if (!id && !nombre) {
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