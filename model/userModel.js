const { PrismaClient,  } = require('@prisma/client')
const encryptService = require('../services/encryptService');

const prisma = new PrismaClient()

const crearUsuario = async (user_data) => {
    const user = await prisma.usuario.create({data:{
         nombre: user_data.nombre,
         apellido: user_data.apellido,
         email: user_data.email,
         hash_contrasena: encryptService.hashPassword(user_data.hash_contrasena),
         fechaNacimiento: new Date(user_data.fechaNacimiento),
         numeroTelefono: user_data.numeroTelefono,
         urlFotoPerfil: user_data.urlFotoPerfil,
         Verificado: user_data.Verificado,
         codigoVerificacionUsuario: user_data.codigoVerificacionUsuario,
         IdTipoDocumento: user_data.IdTipoDocumento,
         numeroDocumento: user_data.numeroDocumento,
         idRol: user_data.idRol,
         idEstado: user_data.idEstado,
         fechaCreacion: new Date(user_data.fechaCreacion),
    }});
    return user;
}

const usuarioExistnente = async (email, documentoIdentidad) => {
    const usuario_existente_email = await prisma.usuario.findFirst({
        where: {
            email: email
        }
    })
    const usuario_existente_documento = await prisma.usuario.findFirst({
        where: {
            numeroDocumento: documentoIdentidad
        }
    })
    console.log((usuario_existente_email || usuario_existente_documento));

    if((usuario_existente_email || usuario_existente_documento) == null){
        return {message: "", existe: false};
    }else  if(usuario_existente_email && usuario_existente_documento){
        return {message: `El email: ${email} y el documento: ${documentoIdentidad} están en uso`, existe: true};
    }else if(usuario_existente_email){
        return {message: `El email: ${email} está en uso`, existe: true};
    } else if(usuario_existente_documento){
        return {message: `El documento: ${documentoIdentidad} está en uso`, existe: true};
    }
}

module.exports = {
    crearUsuario,
    usuarioExistnente,
};