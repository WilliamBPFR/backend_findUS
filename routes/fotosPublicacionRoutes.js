const express = require('express');
const router = express.Router();
const fotospublicacionController = require('../controllers/fotosPublicacionController');

router.post('/fotospublicacion/crearFotoPublicacion', fotospublicacionController.createFotoPublicacion);

module.exports = router;