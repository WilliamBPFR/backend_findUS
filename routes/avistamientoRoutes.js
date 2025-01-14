const express = require('express');
const router = express.Router();
const avistamientoController = require('../controllers/avistamientoController');
const {authenticate} = require('../routes/routeAutenthicationService');


router.get('/avistamiento/:id', avistamientoController.getAvistamiento);
router.get('/avistamiento', avistamientoController.getAllAvistamientos);
router.post('/avistamiento/crearAvistamiento', authenticate, avistamientoController.crearAvistamiento);
router.post('/avistamiento/subirFotoAvistamiento', avistamientoController.crearFotoAvistamiento);
router.put('/avistamiento/:id', avistamientoController.updateAvistamiento);
router.delete('/avistamiento/:id', avistamientoController.deleteAvistamiento);
router.get('/avistamiento/obtenerAvistamientoPublicacion/:idPublicacion', avistamientoController.getAvistamientoPublicacion);

router.put('/avistamiento/activarAvistamiento/:id', avistamientoController.activarAvistamiento);
router.put('/avistamiento/desactivarAvistamiento/:id', avistamientoController.desactivarAvistamiento);
router.put('/avistamiento/verificarAvistamiento/:id', avistamientoController.verificarAvistamiento);
router.put('/avistamiento/editarAvistamiento/:id', avistamientoController.editarAvistamiento);

module.exports = router;