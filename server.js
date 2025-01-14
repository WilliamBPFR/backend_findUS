const express = require('express');
const app = require('./app');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Cargar el archivo JSON generado

const PORT = process.env.PORT || 5000;

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint de health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'API ARRIBAAAAA - Version 3.0.0 - 14/01/2025' });
});


app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});