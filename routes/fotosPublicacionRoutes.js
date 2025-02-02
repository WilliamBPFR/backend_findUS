const express = require('express');
const router = express.Router();
const fotospublicacionController = require('../controllers/fotosPublicacionController');

router.post('/fotospublicacion/crearFotoPublicacion', fotospublicacionController.createFotoPublicacion);
router.put('/fotospublicacion/updateFotoPublicacionBO', fotospublicacionController.updateFotoPublicacionBO);
router.put('/fotospublicacion/updateArchivoPoliciaPublicacionBO', fotospublicacionController.updateArchivoPoliciaPublicacionBO);

module.exports = router;