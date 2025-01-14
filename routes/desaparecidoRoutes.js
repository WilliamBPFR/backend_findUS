const express = require('express');
const router = express.Router();
const desaparecidoController = require('../controllers/desaparecidoController');
const {authenticate} = require('../routes/routeAutenthicationService');


// Rutas Protegidas
router.post('/desaparecido/crearDesaparecido', authenticate, desaparecidoController.createDesaparecido);
router.get('/desaparecido/obtenerDesaparecidosByUser', authenticate, desaparecidoController.getDesaparecidosByUser);
router.post('/desaparecido/crearComentarioPublicaciones',authenticate, desaparecidoController.crearComentarioPublicaciones);


router.get('/desaparecido/obtenerDesaparecidoTabla/:page/:limit', desaparecidoController.getDesaparecidosTableBO);
router.get('/desaparecido/obtenerDesaparecido/:id', desaparecidoController.getDesaparecido);
router.get('/desaparecido/obtenerDesaparecidos', desaparecidoController.getAllDesaparecidos);
router.put('/desaparecido/updateDesaparecido/:id', desaparecidoController.updateDesaparecido);
router.delete('/desaparecido/deleteDesaparecido/:id', desaparecidoController.deleteDesaparecido);

// Rutas Públicas
router.get('/desaparecido/obtenerDesaparecidosActivosScrollGrande/:page/:limit', desaparecidoController.getDesaparecidosActivosScrollGrande);
router.get('/desaparecido/obtenerDesaparecidosActivosScrollHorizontal', desaparecidoController.getDesaparecidosActivosScrollHorizontal);
router.get('/desaparecido/obtenerInfoDesaparecidoByID_Movil/:id', desaparecidoController.getInfoDesaparecidoByID_Movil);
router.get('/desaparecido/obtenerInfoDesaparecidoByID_BO/:id', desaparecidoController.getInfoDesaparecidoByID_BO);
router.post('/desaparecido/pruebaLocalidad', desaparecidoController.pruebaLocalidad);
router.get('/desaparecido/obtenerInformacionEditarPublicacionBO/:id', desaparecidoController.obtenerInformacionEditarPublicacionBO);
router.put('/desaparecido/actualizarDesaparecidoBO/:id', desaparecidoController.updateDesaparecidoBO);
router.put('/desaparecido/activarPublicacion/:id', desaparecidoController.activarDesaparecido);
router.put('/desaparecido/desactivarPublicacion/:id', desaparecidoController.desactivarDesaparecido);
router.put('/desaparecido/verificarPublicacion/:id', desaparecidoController.verificarPublicacion);
router.put('/desaparecido/cerrarPublicacion/:id/:tipoCierre', desaparecidoController.cerrarDesaparecido);
router.get('/desaparecido/pruebaLongitudService/:latitud/:longitud', desaparecidoController.pruebaDistanciaUbicacion);

module.exports = router;