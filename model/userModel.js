const { PrismaClient,  } = require('@prisma/client')
const encryptService = require('../services/encryptService');
const {supabaseAnon,supabaseAdmin} = require('../services/supabaseService');
const e = require('express');

const prisma = new PrismaClient()

const crearUsuario = async (user_data) => {
    // Registrar al usuario con Supabase Auth
    const { data, error } = await supabaseAnon.auth.signUp({
        email: user_data.email,
        password: user_data.contrasena,
    });
    if (error) {
        console.error('Error en el registro en Supabase Auth:', error);
        return { success: false, error };
    }

    try{
        const user = await prisma.usuario.create({data:{
            idauthusuario: data.user.id,
            nombre: user_data.nombres,
            apellido: user_data.apellidos,
            email: user_data.email,
            fechanacimiento: new Date(user_data.fechaNacimiento),
            numerotelefono: user_data.numeroTelefono,
            idtipodocumento: user_data.IdTipoDocumento,
            numerodocumento: user_data.numero_documento,
            //Campos por defecto
            urlfotoperfil: "https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671142.jpg",
            verificado: false,
            codigoverificacionusuario: encryptService.generateVerificationCode(4),
            idrol: 1,
            idestado: 1,
            fechacreacion: new Date(),
        }});
        return { success: true, user };
    }catch(error){
        console.error('Error en el registro en la base de datos:', error);
        return { success: false, error };
    }
}

const getUserById = async (id) => {
    const user = await prisma.usuario.findFirst({
        where: {
            id: id
        }
    });
    return user;
}

const getAllUser = async () => {
    const users = await prisma.usuario.findMany();
    return users;
}

const usuarioExistnente = async (email, documentoIdentidad) => {
    const usuario_existente_email = await prisma.usuario.findFirst({
        where: {
            email: email
        }
    })
    const usuario_existente_documento = await prisma.usuario.findFirst({
        where: {
            numerodocumento: documentoIdentidad
        }
    })
    console.log((usuario_existente_email || usuario_existente_documento));

    if((usuario_existente_email || usuario_existente_documento) == null){
        return {message: "", existe: false};
    }else  if(usuario_existente_email  && usuario_existente_documento){
        return {message: `El email: ${email} y el documento: ${documentoIdentidad} están en uso`, existe: true};
    }else if(usuario_existente_email){
        return {message: `El email: ${email} está en uso`, existe: true};
    } else if(usuario_existente_documento){
        return {message: `El documento: ${documentoIdentidad} está en uso`, existe: true};
    }
}

const verificarOTP = async (email, codigoVerificacion,type) => {
    const {data,error} = await supabaseAnon.auth.verifyOtp({email: email, token: codigoVerificacion, type:type})
    if(error){
        console.error('Error en la verificación del correo:', error);
        return { verificado: false, message: error.code };
    }

    if(data){
        console.log(data);
        return {message: "Usuario verificado", verificado: true, token: data?.session.access_token};
    }
}

const verificarUsuario = async (email) => {
    const user = await prisma.usuario.findFirst({
        where: {
            email: email
        }
    });

    if(user){
        const updateuser = await prisma.usuario.update({
            where: {
                id: user.id
            },
            data: {
                verificado: true
            }
        });

        if(updateuser){
            return {message: "Usuario verificado", verificado: true};
        }else{
            return {message: "Error al verificar usuario", verificado: false};
        }
    }
}

const solicitarCambiorContrasenaUsuario = async (email,isresend = false) => {
    if(!isresend){
        const user = await prisma.usuario.findFirst({
            where: {
                email: email
            }
        });

        if(!user){
            return {message: "Usuario no encontrado. Verifique el correo e intente de nuevo", verificado: false};
        }

        const cambioContrasena = await prisma.cambiarcontrasena.findFirst({
            where: {
                idusuario: user.id,
                vigente: true,
                idestatus: 1
            }
        });

        if(cambioContrasena){
            return {message: "Códiga ya había sido enviado y está vigente. Verifique su correo e introdúzcalo a continuación", verificado: true};
        }
    }
    
    const {data,error} = await supabaseAnon.auth.resetPasswordForEmail(email);
    if(error){
        console.error('Error en la verificación del correo:', error);
        return { verificado: false, message: error.code };
    }
    if(data){
        console.log(data);
        const user = await prisma.usuario.findFirst({
            where: {
                email: email
            }
        });
        if(user){
            await prisma.cambiarcontrasena.create({
                data: {
                    idusuario: user.id,
                    idestatus: 1,
                    fechaexpiracioncodigo: new Date(new Date().setHours(new Date().getHours() + 6)),
                    vigente: true,
                }
            })
        }
        return {message: "Código Enviado", verificado: true};
    }
}

const cambiarContrasenaUsuario = async (contrasena,userid) => {
    const {data,error} = await supabaseAdmin.auth.admin.updateUserById(userid,{password: contrasena});
    if(error){
        console.error('Error en la verificación del correo:', error);
        return { verificado: false, message: error.code };
    }

    if(data){
        console.log(data);
        const user = await prisma.usuario.findFirst({
            where: {
                idauthusuario: data?.user.id
            }
        });

        console.log(user);
        if(user){
            const cambiarContrasena = await prisma.cambiarcontrasena.findFirst({
                where: {
                    idusuario: user.id,
                    vigente: true,
                    idestatus: 1
                }
            });

            if(cambiarContrasena){
                await prisma.cambiarcontrasena.update({
                    where: {
                        id: cambiarContrasena.id
                    },
                    data: {
                        vigente: false,
                        idestatus: 2,
                    }
                })
            }
        }
        return {message: "Contraseña Actualizada", verificado: true};
    }
}

const loginUsuario = async (email, contrasena) => {
    console.log('Login Usuario:', email, contrasena);
    const usuario = await prisma.usuario.findFirst({
        where: {
            email: email
        }
    });

    if(!usuario){
        return {message: "Usuario no encontrado", autenticado: false};
    }

    if(usuario.verificado){
        const {data,error} = await supabaseAnon.auth.signInWithPassword({
            email: email,
            password: contrasena
        });
        if(error){
            console.error('Error en la verificación del correo:', error);
            return { autenticado: false, message: error.message };
        }

        if(data){
            return {autenticado: true, message: "Usuario autenticado", token: data?.session.access_token};
        }
    }else{
        return {message: "Usuario no verificado", autenticado: false};
    }
}

const modificarUsuario = async (user_data) => {
    const user = await prisma.usuario.update({
        where: {
            email: user_data.email
        },
        data: {
            nombre: user_data.nombre,
            apellido: user_data.apellido,
            email: user_data.email,
            fechaNacimiento: new Date(user_data.fechaNacimiento),
            numeroTelefono: user_data.numeroTelefono,
            urlFotoPerfil: user_data.urlFotoPerfil,
            Verificado: false,
            codigoVerificacionUsuario: encryptService.generateVerificationCode(),
            IdTipoDocumento: user_data.IdTipoDocumento,
            numeroDocumento: user_data.numeroDocumento,
            idRol: user_data.idRol,
            idEstado: user_data.idEstado,        }
    });
    return user;
}

const cambiarRolUsuario = async (email, idRol) => {
    const user = await prisma.usuario.update({
        where: {
            email: email
        },
        data: {
            idRol: idRol
        }
    });
    return user;
}


module.exports = {
    crearUsuario,
    usuarioExistnente,
    verificarOTP,
    loginUsuario,
    modificarUsuario,
    cambiarRolUsuario,
    solicitarCambiorContrasenaUsuario,
    cambiarContrasenaUsuario,
    verificarUsuario,
    getUserById,
    getAllUser,
};