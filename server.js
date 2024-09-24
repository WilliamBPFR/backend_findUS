const express = require('express');
const app = require('./app');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Cargar el archivo JSON generado

const PORT = process.env.PORT || 3000;

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});