const userModel = require('../model/userModel');
const emailService = require('../services/emailService');
const userService = require('../services/userService');

const getUser = async (req, res) => {
    // #swagger.tags = ['User']
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
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
            return res.status(400).json({ message: "Código Inválido. Verifiquelo e inténtelo de nuevi." });
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
            return res.status(200).json({ message: "Usuario logueado correctamente", token: usuario.token });
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
        return res.status(200).json({ message: "Usuario modificado correctamente"});
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

module.exports = {
    getUser,
    registrar_usuario,
    confirmar_correo,
    login_usuario,
    modificar_usuario,
    modificar_rol_Usuario,
    solicitar_cambio_contrasena,
    verificar_codigo_cambio_contrasena,
    cambiar_contrasena
};