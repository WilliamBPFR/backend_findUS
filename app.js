const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const recursosEducativosRoutes = require('./routes/recursosEducativosRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', recursosEducativosRoutes);
app.use('/api', catalogosRoutes);

module.exports = app;
