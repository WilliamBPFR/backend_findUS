const express = require('express');
const app = express();
const cors = require('cors');

// Aumentar el límite para peticiones JSON
app.use(express.json({ limit: '50mb' }));  // Ajusta el tamaño según tus necesidades

// Aumentar el límite para peticiones URL encoded (formularios)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const userRoutes = require('./routes/userRoutes');
const recursosEducativosRoutes = require('./routes/recursosEducativosRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const desaparecidoRoutes = require('./routes/desaparecidoRoutes');
const avistamientoRoutes = require('./routes/avistamientoRoutes');
const fotospublicacionRoutes = require('./routes/fotosPublicacionRoutes');

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
app.use('/api', fotospublicacionRoutes);

module.exports = app;
