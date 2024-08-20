const swaggerAutogen = require('swagger-autogen')();
const PORT = process.env.PORT || 3000;
const doc = {
  info: {
    title: 'FindUS API',
    description: 'Este es el SWAGGER de la API de FindUS, donde se podrá encontrar información sobre los endpoints y sus respectivas respuestas.',
  },
  host: `localhost:${PORT}`
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);