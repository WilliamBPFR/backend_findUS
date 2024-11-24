const userModel = require('../model/userModel');
const emailService = require('../services/emailService');
const userService = require('../services/userService');

const getUserById = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const user = await userModel.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUser = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const users = await userModel.getAllUser();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registrar_usuario = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para registrar un usuario.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del usuario.',
              required: true,
              schema: {
                 nombres: 'Juan',
                 apellidos: 'Perez',
                 email: 'correo@ejemplo.com',
                 contrasena: '123456',
                 fechaNacimiento: '1990-01-01',
                 numeroTelefono: '1234567890',
                 IdTipoDocumento: 1,
                 numero_documento: '1234567890',
              }
         }

    */
    try {
        const existe = await userModel.usuarioExistnente(req.body.email, req.body.numero_documento);
        if(existe.existe){
            return res.status(400).json({ message: existe.message });
        }
        else{
            const usuario = await userModel.crearUsuario(req.body);
            if(!usuario.success){
                return res.status(400).json({ message: "Error al crear el usuario"});
            }
            return res.status(200).json({ email: usuario.user.email, message: "Usuario creado exitosamente"});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const confirmar_correo = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para registrar un usuario.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para confirmar el correo.',
            required: true,
            schema: {
                email: 'usuario@correo.com',
                codigoVerificacion: 123456,
            }
        }
    */
    try {
        const verificado = await userModel.verificarOTP(req.body.email, req.body.codigoVerificacion, "signup");
        if(verificado.verificado){
            const updb = await userModel.verificarUsuario(req.body.email);
            console.log(updb);
            return res.status(200).json({ message: "Usuario Verificado" });
        }else if(verificado.message == "otp_expired"){
            return res.status(400).json({ message: "Código Inválido. Verifiquelo e inténtelo de nuevo." });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const solicitar_cambio_contrasena = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para solicitar un cambio de contraseña.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para solicitar un cambio de contraseña.',
            required: true,
            schema: {
                email: 'usuario@correo.com',
                resend: false
            }
        }
    */
    try {
        console.log(req.body);
        const verificado = await userModel.solicitarCambiorContrasenaUsuario(req.body.email, req.body.resend ? true : false);
        if(verificado.verificado){
            return res.status(200).json({ message: verificado.message });
        }else if(verificado.message == "otp_expired"){
            return res.status(400).json({ message: "Código Inválido. Verifíquelo e inténtelo de nuevo." });
        }else{
            return res.status(403).json({ message: verificado.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const verificar_codigo_cambio_contrasena = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para verificar el código de cambio de contraseña.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para verificar el código de cambio de contraseña.',
            required: true,
            schema: {
                email: 'usuario@correo.com',
                codigoVerificacion: 123456,
            }
        }
    */
    try {
        console.log("PARASVERIFICARRRRR")
        console.log(req.body);
        const verificado = await userModel.verificarOTP(req.body.email, req.body.codigoVerificacion, "recovery");
        if(verificado.verificado){
            return res.status(200).json({ message: "Código Válido", token: verificado.token });
        }else if(verificado.message == "otp_expired"){
            return res.status(400).json({ message: "Código Inválido. Verifíquelo e inténtelo de nuevo." });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const cambiar_contrasena = async (req, res) => {
    /* #swagger.tags = ['User']
        #swagger.security = [{
            "authorization": []
        }] 
       #swagger.description = 'Endpoint para cambiar la contraseña.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para cambiar la contraseña.',
            required: true,
            schema: {
                contrasena: '123456',
            }
        }
    */
    try {
        const verificado = await userModel.cambiarContrasenaUsuario(req.body.contrasena,req.user.id);
        if(verificado.verificado){
            return res.status(200).json({ message: "Contraseña cambiada correctamente" });
        }else{
            if(verificado.message == "otp_expired"){
                return res.status(400).json({ message: "Código Inválido. Verifíquelo e inténtelo de nuevo." });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const login_usuario = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para iniciar sesión.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para iniciar sesión.',
            required: true,
            schema: {
                email: 'usuario@ejemplo.com',
                contrasena: '123456'
            }
        }
    */
    try {
        const usuario = await userModel.loginUsuario(req.body.email, req.body.contrasena);
        if(usuario.autenticado){
            console.log(usuario);
            return res.status(200).json({ message: "Usuario logueado correctamente", token: usuario.token, autenticado: true, });
        }else{
            return res.status(400).json({ message: "Correo o Contraseña incorrecta. Revise e intente de nuevo"  }); //usuario.message.includes("Invalid login credentials") ? "Contraseña o Correo" : usuario.message
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const modificar_usuario = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para modificar un usuario.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para modificar.',
            required: true,
            schema: {
              nombre: 'Juan',
                 apellido: 'Perez',
                 email: 'correo@ejemplo.com',
                 contrasena: '123456',
                 fechaNacimiento: '1990-01-01',
                 numeroTelefono: '1234567890',
                 urlFotoPerfil: 'https://www.ejemplo.com/imagen.jpg',
                 Verificado: true,
                 codigoVerificacionUsuario: '123456',
                 IdTipoDocumento: 1,
                 numeroDocumento: '1234567890',
                 idRol: 1,
                 idEstado: 1,
            }
        }
    */
    try {
        const usuario = await userModel.modificarUsuario(req.body);
        return res.status(200).json({ message: "Usuario modificado correctamente", usuario: usuario });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const verificar_token_valido = async (req, res) => {
    /* #swagger.tags = ['User']
        #swagger.security = [{
            "authorization": []
        }] 
       #swagger.description = 'Endpoint para verificar si el token es válido.'
    */
    try {
        console.log("TOKEN VALIDO");
        console.log(req.user.id);
        return res.status(200).json({ message: "Token válido" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const modificar_rol_Usuario = async (req, res) => {
    /* #swagger.tags = ['User']
       #swagger.description = 'Endpoint para modificar el rol de un usuario.'
       #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Información del usuario para modificar el rol.',
            required: true,
            schema: {
                email: 'usuario@email.com',
                idRol: 1
            }
        }
    */
    try {
        const usuario = await userModel.cambiarRolUsuario(req.body.email, req.body.idRol);
        return res.status(200).json({ message: "Rol de usuario modificado correctamente"});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateAdminAUsuario = async (req, res) => {
    // #swagger.tags = ['User']
    const iduser = parseInt(req.params.id);
    try {
        const usuario = await userModel.modificarAdminAUsuario(iduser, req.body);
        console.log("id", req.params)
        console.log(usuario);
        return res.status(200).json({ message: "Usuario actualizado correctamente", usuario: usuario });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserInfoForAsyncStorage = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const profilePicture = await userModel.getUserInfoForAsyncStorage(req.user.id_user);
        res.status(200).json(profilePicture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const prueba_refresh_token = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        console.log("REFRESH TOKEN");
        const usuario = await userModel.prueba_refresh_token(req.params.token);
        return res.status(200).json({ message: "Token actualizado correctamente", token: usuario.token });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUsuariosTableBO = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const usuarios = await userModel.getUsuarioTableBO(req.params.page, req.params.limit,req.query);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProfileInfo = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const profileInfo = await userModel.getProfileInfo(parseInt(req.user.id_user));
        const estadisticasPublicaciones = await userModel.getEstadisticasPublicaciones(parseInt(req.user.id_user));
        res.status(200).json({informacionesPerfil: profileInfo, estadisticasPublicaciones: estadisticasPublicaciones});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const obtenerInfoEditarUsuario = async (req, res) => {
    try {
        const usuario = await userModel.obtenerInfoEditarUsuario(req.user.id_user);
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const editarUsuario = async (req, res) => {
    try {
        console.log("EDITAR USUARIO");
        console.log(req.body);
        const usuario = await userModel.editarUsuario(parseInt(req.user.id_user), req.body);
        if(!usuario.success){
            return res.status(400).json({ message: usuario.message});
        }
        return res.status(200).json({ message: "Usuario modificado correctamente"});	
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const cambiarFotoPerfil = async (req, res) => {
    try {
        const usuario = await userModel.cambiarImagenPerfil(parseInt(req.user.id_user), req.body);
        if(!usuario.success){
            return res.status(400).json({ message: usuario.message});
        }
        return res.status(200).json({ message: usuario.message, urlFotoPerfil: usuario.urlFotoPerfil});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const informacionesHomeBO = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const informaciones = await userModel.informacionesHomeBO();
        res.status(200).json(informaciones);
    } catch (error) {
        console.error('Error al obtener las informaciones:', error);
        res.status(500).json({ message: error.message });
    }
}

const guardarUbicacionRTUsuario = async (req, res) => {
    try {
        const usuario = await userModel.guardarUbicacionRTUsuario(parseInt(req.user.id_user), req.body);
        if(!usuario.success){
            return res.status(400).json({ message: usuario.message});
        }
        return res.status(200).json({ message: "Ubicación guardada correctamente"});	
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registrar_usuario,
    confirmar_correo,
    login_usuario,
    modificar_usuario,
    modificar_rol_Usuario,
    solicitar_cambio_contrasena,
    verificar_codigo_cambio_contrasena,
    cambiar_contrasena,
    getAllUser,
    getUserById,
    verificar_token_valido,
    getUserInfoForAsyncStorage,
    prueba_refresh_token,
    getUsuariosTableBO,
    updateAdminAUsuario,
    getProfileInfo,
    obtenerInfoEditarUsuario,
    editarUsuario,
    cambiarFotoPerfil,
    informacionesHomeBO,
    guardarUbicacionRTUsuario   
};