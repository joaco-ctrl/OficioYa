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

app.use('/auth', authRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/contratos', contratosRoutes);
app.use('/profesionales', profesionalRoutes);
app.use('/presupuestos', presupuestosRoutes);
app.use('/reportes', reportesRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/valoraciones', valoracionesRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});
