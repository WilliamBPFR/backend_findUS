const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate} = require('../routes/routeAutenthicationService');

// Rutas protegidas
router.post('/user/cambiar_contrasena', authenticate, userController.cambiar_contrasena);
router.get("/user/verificar_token_valido/", authenticate, userController.verificar_token_valido);
router.get("/user/obtener_info_basica_user", authenticate, userController.getUserInfoForAsyncStorage);
router.get("/user/obtener_info_user_perfil/", authenticate, userController.getProfileInfo);
router.get("/obtener_info_editar_usuario",authenticate, userController.obtenerInfoEditarUsuario);
router.put("/user/editar_usuario",authenticate, userController.editarUsuario);
router.put("/user/cambiar_foto_perfil",authenticate, userController.cambiarFotoPerfil);
router.get("/user/obtener_informaciones_home_bo/",authenticate, userController.informacionesHomeBO);
router.put("/user/actualizar_ubicacion_usuario",authenticate, userController.guardarUbicacionRTUsuario);
router.post("/user/guardar_id_notificacion",authenticate, userController.guardarIDNotificacionUsuario);
router.get("/user/obtener_publicacion_filtros_movil/:page/:limit",authenticate, userController.getPublicacionesFitltroMovil);
router.get("/user/crear_reporte_backoffice", authenticate, userController.crear_reporte_backoffice);
router.post("/user/verificar_usuario_link", authenticate, userController.verificar_usuario_link);
// Rutas públicas
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUser);
router.put('/user/admin_update_user/:id', userController.updateAdminAUsuario);
router.post('/user/registrar_usuario', userController.registrar_usuario);
router.post('/user/confirmar_correo', userController.confirmar_correo);
router.post('/user/login', userController.login_usuario);
router.post('/user/login_user_bo', userController.loginUsuarioBackOffice);
router.put('/user/modificar_usuario', userController.modificar_usuario);
router.put('/user/cambiar_rol', userController.modificar_rol_Usuario);
router.post('/user/solicitar_cambio_contrasena', userController.solicitar_cambio_contrasena);
router.post('/user/verificar_codigo_cambio_contrasena',userController.verificar_codigo_cambio_contrasena);
router.post('/user/prueba_refesh_token/:token', userController.prueba_refresh_token);
router.get('/user/obtenerUsuariosTabla/:page/:limit', userController.getUsuariosTableBO);

module.exports = router;