const express = require('express');
const router = express.Router();
const recursosEducativosController = require('../controllers/recursosEducativosController');

router.get('/recursos_educativos/get_recursos_educativos_activos/:page/:limit', recursosEducativosController.obtenerRecursosEducativosActivos);

router.get('/recursos_educativos', recursosEducativosController.obtenerRecursosEducativos);
router.get('/recursos_educativos/:id', recursosEducativosController.obtenerRecursoEducativo);
router.post('/crear_recursos_educativos', recursosEducativosController.crearRecursoEducativo);
// router.put('/recursos_educativos/:id', recursosEducativosController.actualizarRecursoEducativo);

router.put('/recursos_educativos/editarRecursoEducativo/:id', recursosEducativosController.editarRecursoEducativo);
router.put('/recursos_educativos/desactivarRecursoEducativo/:id', recursosEducativosController.desactivarRecursoEducativo);
router.put('/recursos_educativos/activarRecursoEducativo/:id', recursosEducativosController.activarRecursoEducativo);

router.get('/recursos_educativos/obtenerMaterialEducativoTabla/:page/:limit', recursosEducativosController.getMaterialEducativoTableBO);
router.get('/recursos_educativos/obtenerMaterialEducativoByID/:id', recursosEducativosController.getMaterialEducativoByID);

module.exports = router;