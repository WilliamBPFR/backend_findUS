const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

// Aumentar el límite para peticiones JSON
app.use(express.json({ limit: '50mb' }));  // Ajusta el tamaño según tus necesidades

// Aumentar el límite para peticiones URL encoded (formularios)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// app.use(morgan(':method :url :status - :response-time ms'));

// // Middleware para capturar y registrar respuestas
// const logResponseMiddleware = (req, res, next) => {
//     const originalSend = res.send; // Guardar la referencia original de res.send

//     res.send = function (body) {
//         console.log(`
//         Ruta: ${req.originalUrl}
//         Método: ${req.method}
//         Código de estado: ${res.statusCode}
//         Respuesta: ${typeof body === 'object' ? JSON.stringify(body) : body}
//         `);
//         originalSend.call(this, body); // Llamar a la función original
//     };

//     next();
// };
// app.use(logResponseMiddleware);


const userRoutes = require('./routes/userRoutes');
const recursosEducativosRoutes = require('./routes/recursosEducativosRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const desaparecidoRoutes = require('./routes/desaparecidoRoutes');
const avistamientoRoutes = require('./routes/avistamientoRoutes');
const fotospublicacionRoutes = require('./routes/fotosPublicacionRoutes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', recursosEducativosRoutes);
app.use('/api', catalogosRoutes);
app.use('/api', desaparecidoRoutes);
app.use('/api', avistamientoRoutes);
app.use('/api', fotospublicacionRoutes);

module.exports = app;
