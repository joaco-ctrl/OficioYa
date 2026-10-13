const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();


const authRoutes = require('./routes/authRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const contratosRoutes = require('./routes/contratosRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
const presupuestosRoutes = require('./routes/presupuestosRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const valoracionesRoutes = require('./routes/valoracionesRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/profesionales', profesionalRoutes);
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});
