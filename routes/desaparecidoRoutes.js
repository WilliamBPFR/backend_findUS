const express = require('express');
const router = express.Router();
const desaparecidoController = require('../controllers/desaparecidoController');
const {authenticate} = require('../routes/routeAutenthicationService');


// Rutas Protegidas
router.post('/desaparecido/crearDesaparecido', authenticate, desaparecidoController.createDesaparecido);


router.get('/desaparecido/obtenerDesaparecido/:id', desaparecidoController.getDesaparecido);
router.get('/desaparecido/obtenerDesaparecidos', desaparecidoController.getAllDesaparecidos);
router.put('/desaparecido/updateDesaparecido/:id', desaparecidoController.updateDesaparecido);
router.delete('/desaparecido/deleteDesaparecido/:id', desaparecidoController.deleteDesaparecido);
router.get('/desaparecido/obtenerDesaparecidosActivosScrollGrande/:page/:limit', desaparecidoController.getDesaparecidosActivosScrollGrande);
router.get('/desaparecido/obtenerDesaparecidosActivosScrollHorizontal', desaparecidoController.getDesaparecidosActivosScrollHorizontal);
router.get('/desaparecido/obtenerInfoDesaparecidoByID/:id', desaparecidoController.getInfoDesaparecidoByID);

module.exports = router;