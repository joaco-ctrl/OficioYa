const mysql = require('mysql2');

const conexion = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "oficioya",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

conexion.on('connection', () => {
  console.log('Conectado a la base de datos');
});

conexion.on('error', (error) => {
  console.error('Error en la conexión a la base de datos:', error);
});

module.exports = conexion;
