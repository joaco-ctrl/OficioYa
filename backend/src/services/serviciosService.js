const conexion = require('../config/database');


const crearServicio = (datosServicio, callback) => {
  const { profesional_id, categoria_id, titulo, descripcion, precio } = datosServicio;

  const sql = `
    INSERT INTO servicios (profesional_id, categoria_id, titulo, descripcion, precio)
    VALUES (?, ?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [profesional_id, categoria_id, titulo, descripcion || null, precio || null],
    (err, result) => {
      if (err) return callback(err, null);
      
      return callback(null, {
        id: result.insertId,
        profesional_id,
        categoria_id,
        titulo,
        precio
      });
    }
  );
};


const buscarServicios = (filtros = {}, callback) => {
  const { categoria_id, zona } = filtros;

  let sql = `
    SELECT 
      s.id AS servicio_id,
      s.titulo,
      s.descripcion AS servicio_descripcion,
      s.precio,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      p.id AS profesional_id,
      p.zona,
      p.verificado,
      p.confianza,
      u.nombre AS profesional_nombre,
      u.apellido AS profesional_apellido
    FROM servicios s
    INNER JOIN categorias c ON s.categoria_id = c.id
    INNER JOIN profesionales p ON s.profesional_id = p.id
    INNER JOIN usuarios u ON p.user_id = u.id
    WHERE s.activo = 1
  `;

  const params = [];

  if (categoria_id) {
    sql += ` AND s.categoria_id = ?`;
    params.push(categoria_id);
  }

  if (zona) {
    sql += ` AND p.zona LIKE ?`;
    params.push(`%${zona}%`);
  }

  sql += ` ORDER BY s.id DESC`;

  conexion.query(sql, params, (err, rows) => {
    if (err) return callback(err, null);
    return callback(null, rows);
  });
};


const obtenerServicioPorId = (servicioId, callback) => {
  const sql = `
    SELECT 
      s.id AS servicio_id,
      s.titulo,
      s.descripcion AS servicio_descripcion,
      s.precio,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      p.id AS profesional_id,
      p.biografia,
      p.zona,
      p.disponibilidad,
      p.verificado,
      p.confianza,
      u.nombre AS profesional_nombre,
      u.apellido AS profesional_apellido,
      u.email AS profesional_email,
      u.telefono AS profesional_telefono
    FROM servicios s
    INNER JOIN categorias c ON s.categoria_id = c.id
    INNER JOIN profesionales p ON s.profesional_id = p.id
    INNER JOIN usuarios u ON p.user_id = u.id
    WHERE s.id = ? AND s.activo = 1
  `;

  conexion.query(sql, [servicioId], (err, rows) => {
    if (err) return callback(err, null);
    return callback(null, rows[0] || null);
  });
};


const obtenerServiciosPorProfesional = (profesionalId, callback) => {
  const sql = `
    SELECT 
      s.id AS servicio_id,
      s.titulo,
      s.descripcion,
      s.precio,
      s.activo,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM servicios s
    INNER JOIN categorias c ON s.categoria_id = c.id
    WHERE s.profesional_id = ?
    ORDER BY s.id DESC
  `;

  conexion.query(sql, [profesionalId], (err, rows) => {
    if (err) return callback(err, null);
    return callback(null, rows);
  });
};


const actualizarServicio = (servicioId, profesionalId, datos, callback) => {
  const { categoria_id, titulo, descripcion, precio } = datos;

  const sql = `
    UPDATE servicios 
    SET categoria_id = ?, titulo = ?, descripcion = ?, precio = ?
    WHERE id = ? AND profesional_id = ?
  `;

  conexion.query(
    sql,
    [categoria_id, titulo, descripcion, precio, servicioId, profesionalId],
    (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result.affectedRows > 0);
    }
  );
};


const eliminarServicio = (servicioId, profesionalId, callback) => {
  const sql = `
    UPDATE servicios 
    SET activo = 0 
    WHERE id = ? AND profesional_id = ?
  `;

  conexion.query(sql, [servicioId, profesionalId], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result.affectedRows > 0);
  });
};

module.exports = {
  crearServicio,
  buscarServicios,
  obtenerServicioPorId,
  obtenerServiciosPorProfesional,
  actualizarServicio,
  eliminarServicio
};