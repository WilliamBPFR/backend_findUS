const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const recursosEducativosRoutes = require('./routes/recursosEducativosRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const desaparecidoRoutes = require('./routes/desaparecidoRoutes');
const avistamientoRoutes = require('./routes/avistamientoRoutes');

// // Configurar CORS para permitir solicitudes desde 'localhost:3000'
// app.use(cors({ origin: 'http://localhost:3000' }));

// O permitir todos los orígenes (para desarrollo)
app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));


app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', recursosEducativosRoutes);
app.use('/api', catalogosRoutes);
app.use('/api', desaparecidoRoutes);
app.use('/api', avistamientoRoutes);

module.exports = app;
