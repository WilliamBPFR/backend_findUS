const userModel = require('../model/userModel');

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
                 fechaCreacion: '2021-01-01',
              }
         }

    */
    try {
        const existe = await userModel.usuarioExistnente(req.body.email, req.body.numeroDocumento);
        if(existe.existe){
            return res.status(400).json({ message: existe.message });
        }
        else{
            await userModel.crearUsuario(req.body);
            return res.status(200).json({ message: "Usuario creado exitosamente"});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getUser,
    registrar_usuario
};