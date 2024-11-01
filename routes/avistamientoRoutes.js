const express = require('express');
const router = express.Router();
const avistamientoController = require('../controllers/avistamientoController');

router.get('/avistamiento/:id', avistamientoController.getAvistamiento);
router.get('/avistamiento', avistamientoController.getAllAvistamientos);
router.post('/avistamiento/crearAvistamiento', avistamientoController.crearAvistamiento);
router.post('/avistamiento/subirFotoAvistamiento', avistamientoController.crearFotoAvistamiento);
router.put('/avistamiento/:id', avistamientoController.updateAvistamiento);
router.delete('/avistamiento/:id', avistamientoController.deleteAvistamiento);
router.get('/avistamiento/obtenerAvistamientoPublicacion/:idPublicacion', avistamientoController.getAvistamientoPublicacion);

module.exports = router;