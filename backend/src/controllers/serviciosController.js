const serviciosService = require('../services/serviciosService');


const crearServicio = (req, res) => {
  const { categoria_id, titulo, descripcion, precio } = req.body;


  if (!categoria_id || !titulo) {
    return res.status(400).json({ mensaje: 'La categoría y el título son obligatorios' });
  }

  const datosServicio = {
    profesional_id: req.profesional_id, 
    categoria_id,
    titulo,
    descripcion,
    precio
  };

  serviciosService.crearServicio(datosServicio, (err, nuevoServicio) => {
    if (err) {
      console.error('Error al crear servicio:', err);
      return res.status(500).json({ mensaje: 'Error al registrar el servicio' });
    }
    return res.status(201).json({
      mensaje: 'Servicio creado exitosamente',
      datos: nuevoServicio
    });
  });
};


const buscarServicios = (req, res) => {
  const filtros = {
    categoria_id: req.query.categoria_id,
    zona: req.query.zona
  };

  serviciosService.buscarServicios(filtros, (err, servicios) => {
    if (err) {
      console.error('Error al buscar servicios:', err);
      return res.status(500).json({ mensaje: 'Error al obtener los servicios' });
    }
    return res.status(200).json(servicios);
  });
};


const obtenerServicioPorId = (req, res) => {
  const servicioId = req.params.id;

  serviciosService.obtenerServicioPorId(servicioId, (err, servicio) => {
    if (err) {
      console.error('Error al obtener servicio:', err);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    return res.status(200).json(servicio);
  });
};


const obtenerMisServicios = (req, res) => {
  const profesionalId = req.profesional_id; 

  serviciosService.obtenerServiciosPorProfesional(profesionalId, (err, servicios) => {
    if (err) {
      console.error('Error al obtener mis servicios:', err);
      return res.status(500).json({ mensaje: 'Error al consultar sus servicios' });
    }
    return res.status(200).json(servicios);
  });
};


const actualizarServicio = (req, res) => {
  const servicioId = req.params.id;
  const profesionalId = req.profesional_id;
  const { categoria_id, titulo, descripcion, precio } = req.body;

  if (!categoria_id || !titulo) {
    return res.status(400).json({ mensaje: 'La categoría y el título son obligatorios' });
  }

  const datos = { categoria_id, titulo, descripcion, precio };

  serviciosService.actualizarServicio(servicioId, profesionalId, datos, (err, actualizado) => {
    if (err) {
      console.error('Error al actualizar servicio:', err);
      return res.status(500).json({ mensaje: 'Error al modificar el servicio' });
    }

    if (!actualizado) {
      return res.status(404).json({ 
        mensaje: 'Servicio no encontrado o no tiene permisos para editarlo' 
      });
    }

    return res.status(200).json({ mensaje: 'Servicio actualizado correctamente' });
  });
};


const eliminarServicio = (req, res) => {
  const servicioId = req.params.id;
  const profesionalId = req.profesional_id;

  serviciosService.eliminarServicio(servicioId, profesionalId, (err, eliminado) => {
    if (err) {
      console.error('Error al eliminar servicio:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
    }

    if (!eliminado) {
      return res.status(404).json({ 
        mensaje: 'Servicio no encontrado o no tiene permisos para eliminarlo' 
      });
    }

    return res.status(200).json({ mensaje: 'Servicio eliminado correctamente' });
  });
};

module.exports = {
  crearServicio,
  buscarServicios,
  obtenerServicioPorId,
  obtenerMisServicios,
  actualizarServicio,
  eliminarServicio
};