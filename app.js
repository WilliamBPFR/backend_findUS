const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const recursosEducativosRoutes = require('./routes/recursosEducativosRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const desaparecidoRoutes = require('./routes/desaparecidoRoutes');
const avistamientoRoutes = require('./routes/avistamientoRoutes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', recursosEducativosRoutes);
app.use('/api', catalogosRoutes);
app.use('/api', desaparecidoRoutes);
app.use('/api', avistamientoRoutes);

module.exports = app;
