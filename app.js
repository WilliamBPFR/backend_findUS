const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const desaparecidoRoutes = require('./routes/desaparecidoRoutes');
const avistamientoRoutes = require('./routes/avistamientoRoutes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', desaparecidoRoutes);
app.use('/api', avistamientoRoutes);

module.exports = app;
