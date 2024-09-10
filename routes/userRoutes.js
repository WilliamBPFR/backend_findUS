const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate} = require('../routes/routeAutenthicationService');

router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUser);
router.post('/user/registrar_usuario', userController.registrar_usuario);
router.post('/user/confirmar_correo', userController.confirmar_correo);
router.post('/user/login', userController.login_usuario);
router.put('/user/modificar_usuario', userController.modificar_usuario);
router.put('/user/cambiar_rol', userController.modificar_rol_Usuario);
router.post('/user/solicitar_cambio_contrasena', userController.solicitar_cambio_contrasena);
router.post('/user/verificar_codigo_cambio_contrasena',userController.verificar_codigo_cambio_contrasena);

// Rutas protegidas
router.post('/user/cambiar_contrasena', authenticate, userController.cambiar_contrasena);
module.exports = router;
