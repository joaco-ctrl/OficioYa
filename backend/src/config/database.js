const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST ||"localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME||"oficioya"
})

conexion.connect((error) => {
    if (error) {
        console.log("error de conexion")
    }
    else {
        console.log("conectado a la base de datos")
    }
})
module.exports = conexion;
