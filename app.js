const express = require('express');
const app = express();
const userRoutes = require('./router/userRoutes');

app.use(express.json());
app.use('/api', userRoutes);

module.exports = app;
