const express = require('express');
const router = express.Router();
const recursosEducativosController = require('../controllers/recursosEducativosController');

router.get('/recursos_educativos/get_recursos_educativos_activos/:page/:limit', recursosEducativosController.obtenerRecursosEducativosActivos);

router.get('/recursos_educativos', recursosEducativosController.obtenerRecursosEducativos);
router.get('/recursos_educativos/:id', recursosEducativosController.obtenerRecursoEducativo);
router.post('/crear_recursos_educativos', recursosEducativosController.crearRecursoEducativo);
router.put('/recursos_educativos/:id', recursosEducativosController.actualizarRecursoEducativo);
router.delete('/recursos_educativos/:id', recursosEducativosController.desactivarRecursoEducativo);
router.put('/recursos_educativos/:id/activar', recursosEducativosController.activarRecursoEducativo);

module.exports = router;