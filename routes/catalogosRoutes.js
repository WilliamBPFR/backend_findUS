const express = require('express');
const router = express.Router();
const catalogosController = require('../controllers/catalogosController');

router.get('/tipo_documento/obtenerTipoDocumento', catalogosController.obtenerTipoDocumento);
router.post('/tipo_documento/crearTipoDocumento', catalogosController.crearTipoDocumento);
router.put('/tipo_documento/actualizarTipoDocumento/:id', catalogosController.actualizarTipoDocumento);

router.get('/roles/obtenerRoles', catalogosController.obtenerRoles);
router.post('/roles/crearRol', catalogosController.crearRol);
router.put('/roles/actualizarRol/:id', catalogosController.actualizarRol);

router.get('/categoria_material/obtenerCategoriaMaterial', catalogosController.obtenerCategoriaMaterial);
router.post('/categoria_material/crearCategoriaMaterial', catalogosController.crearCategoriaMaterial);
router.put('/categoria_material/actualizarCategoriaMaterial/:id', catalogosController.actualizarCategoriaMaterial);

router.get('/tipo_foto_publicacion/obtenerTipoFotoPublicacion', catalogosController.obtenerTipoFotoPublicacion);
router.post('/tipo_foto_publicacion/crearTipoFotoPublicacion', catalogosController.crearTipoFotoPublicacion);
router.put('/tipo_foto_publicacion/actualizarTipoFotoPublicacion/:id', catalogosController.actualizarTipoFotoPublicacion);

router.get('/idioma_aplicacion/obtenerIdiomaAplicacion', catalogosController.obtenerIdiomaAplicacion);
router.post('/idioma_aplicacion/crearIdiomaAplicacion', catalogosController.crearIdiomaAplicacion);
router.put('/idioma_aplicacion/actualizarIdiomaAplicacion/:id', catalogosController.actualizarIdiomaAplicacion);

router.get('/estado/obtenerEstado', catalogosController.obtenerEstado);
router.post('/estado/crearEstado', catalogosController.crearEstado);
router.put('/estado/actualizarEstado/:id', catalogosController.actualizarEstado);

module.exports = router;