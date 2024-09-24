const express = require('express');
const router = express.Router();
const desaparecidoController = require('../controllers/desaparecidoController');

router.get('/desaparecido/obtenerDesaparecido/:id', desaparecidoController.getDesaparecido);
router.get('/desaparecido/obtenerDesaparecidos', desaparecidoController.getAllDesaparecidos);
router.post('/desaparecido/crearDesaparecido', desaparecidoController.createDesaparecido);
router.put('/desaparecido/updateDesaparecido/:id', desaparecidoController.updateDesaparecido);
router.delete('/desaparecido/deleteDesaparecido/:id', desaparecidoController.deleteDesaparecido);

module.exports = router;