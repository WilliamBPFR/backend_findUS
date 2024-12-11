const { PrismaClient,  } = require('@prisma/client')
const encryptService = require('../services/encryptService');
const {supabaseAnon,supabaseAdmin} = require('../services/supabaseService');
const { uploadFile } = require('../services/uploadFiles');
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
            id: parseInt(id)
        },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            fechanacimiento: true,
            numerotelefono: true,
            urlfotoperfil: true,
            verificado: true,
            codigoverificacionusuario: true,
            idtipodocumento: true,
            numerodocumento: true,
            rol: true,
            estado: true,
            fechacreacion: true
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


        if(cambioContrasena && cambioContrasena.fechaexpiracioncodigo > new Date()){
            return {message: "Códiga ya había sido enviado y está vigente. Verifique su correo e introdúzcalo a continuación", verificado: true};
        }

        if(cambioContrasena && cambioContrasena.fechaexpiracioncodigo < new Date()){
            await prisma.cambiarcontrasena.update({
                where: {
                    id: cambioContrasena.id
                },
                data: {
                    vigente: false,
                    idestatus: 2,
                    idEstado: 3
                }
            })
        }
        
    }

    const {data,error} = await supabaseAnon.auth.resetPasswordForEmail(email,{redirectTo: "http://localhost:3000/nuevaContrasena"});
    if(error){
        console.error('Error en la verificación del correo:', error);
        return { verificado: false, message: error.code };
    }
    if(data && !isresend){
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
                    fechaexpiracioncodigo: new Date(new Date().setHours(new Date().getHours() + 1)),
                    vigente: true,
                }
            })
        }
        return {message: "Código Enviado", verificado: true};
    }else if(data && isresend){
        return {message: "Código Reenviado", verificado: true};
    }
}

const cambiarContrasenaUsuario = async (contrasena,userid) => {
    const {data,error} = await supabaseAdmin.auth.admin.updateUserById(userid,{password: contrasena});
    if(error){
        console.error('Error en el cambio de contrasena:', error);
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
        return {message: "Usuario no verificado", autenticado: false, id: usuario.id};
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

const modificarAdminAUsuario = async (id, user_data) => {
    const user = await prisma.usuario.update({
        where: {
            id: id
        },
        data: {
            idrol: user_data.rol,
            idestado: user_data.estado
        }
    });
    return user;
}

const getUserInfoForAsyncStorage = async (id) => {
    const user = await prisma.usuario.findFirst({
        where: {
            id: id
        }
    });
    return {
        nombreUsuario: user.nombre + " " + user.apellido,
        urlFotoPerfil: user.urlfotoperfil,
        idRol: user.idrol
    };
}

const prueba_refresh_token = async (token) => {
    console.log('Prueba Refresh Token:', token);
    const {data,error} = await supabaseAnon.auth.refreshSession({refresh_token: token});
    if(error){
        console.error('Error en la verificación del correo:', error);
        return { autenticado: false, message: error.message };
    }

    if(data){
        return {autenticado: true, message: "Usuario autenticado", token: data};
    }
}

const getUsuarioTableBO = async (page, limit, filtros) => {
    // Construir el array de condiciones, excluyendo cualquier condición que sea `undefined`
    const condiciones = [
        filtros?.nombreCompleto ? {
            OR: [
                { nombre: { contains: filtros.nombreCompleto, mode: 'insensitive' } },
                { apellido: { contains: filtros.nombreCompleto, mode: 'insensitive' } }
            ]
        } : null,
        filtros?.rol ? { rol: { id: parseInt(filtros.rol) } } : null,
        filtros?.estatus ? { estado: { id: parseInt(filtros.estatus) } } : null
    ].filter(condicion => condicion !== null); // Filtra valores `null`

    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            estado: true,
            fechacreacion: true,
            verificado: true
        },
        where: {
            AND: condiciones
        },
        orderBy: {
            fechacreacion: 'desc'
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
    });

    const usuariosCount = await prisma.usuario.count({
        where:{
            nombre: filtros?.nombre ? { contains: filtros.nombre, mode: 'insensitive' } : undefined,
            rol: filtros?.rol? { id: parseInt(filtros?.rol) } : undefined,
        }
    });
    return {usuarios, usuariosCount};
}

const getProfileInfo = async (userId) => {
    return prisma.usuario.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            tipodocumento: true,
            numerodocumento: true,
            numerotelefono: true,
            rol: true,
            fechanacimiento: true,
            urlfotoperfil: true,
            estado: true,
            fechacreacion: true
        }
    });
}

const getEstadisticasPublicaciones = async (userId) => {
    const totalPublicacionesHechas = await prisma.publicacion.count({
        where: {
            idusuario: userId
        }
    });

    const totalPublicacionesActivas = await prisma.publicacion.count({
        where: {
            idusuario: userId,
            idestado: 1
        }
    });

    const totalPublicacionesInactivas = await prisma.publicacion.count({
        where: {
            idusuario: userId,
            idestado: 2
        }
    });

    const totalAvistamientosPublicados = await prisma.avistamiento.count({
        where: {
            idusuario: userId
        }
    });

    const totalComentariosHechos = await prisma.comentario.count({
        where: {
            idusuario: userId
        }
    });

    return {
        totalPublicacionesHechas,
        totalPublicacionesActivas,
        totalPublicacionesInactivas,
        totalAvistamientosPublicados,
        totalComentariosHechos
    };
}

const obtenerInfoEditarUsuario = async (id) => {
    const user = await prisma.usuario.findFirst({
        where: {
            id: id
        },
        select: {
            nombre: true,
            apellido: true,
            fechanacimiento: true,
            numerotelefono: true,
            idtipodocumento: true,
            numerodocumento: true,
        }
    });
    return user;
}

const editarUsuario = async (id, user_data) => {

    const usuario_existente_document = await prisma.usuario.findFirst({
        where: {
            numerodocumento: user_data.numero_documento
        }
    })

    if(usuario_existente_document && usuario_existente_document.id != id){
        return {message: `El documento: ${user_data.numero_documento} está en uso`, existe: true, success: false};
    }

    const user = await prisma.usuario.update({
        where: {
            id: id
        },
        data: {
            nombre: user_data.nombres,
            apellido: user_data.apellidos,
            fechanacimiento: new Date(user_data.fechaNacimiento),
            numerotelefono: user_data.numeroTelefono,
            idtipodocumento: user_data.IdTipoDocumento,
            numerodocumento: user_data.numero_documento,
        }
    });

    console.log("MI LOCO USUARIOOOOOO: ",user);
    return {success: true, existe: false, message: "Usuario actualizado con éxito"};
}

const cambiarImagenPerfil = async (id, imageData) => {
    const { signedUrl, success, error } = await uploadFile(
        imageData.base64File,
        imageData.fileName,
        imageData.mimeType,
        "Fotos de perfil"
    );

    if (!success) {
        throw new Error(`Error subiendo el archivo: ${error.message}`);
    }

    const user = await prisma.usuario.update({
        where: {
            id: id
        },
        data: {
            urlfotoperfil: signedUrl
        }
    });

    return { success: true, message: "Imagen de perfil actualizada con éxito", urlFotoPerfil: signedUrl };
}

const informacionesHomeBO = async () => {

    const today = new Date();

    // Calcula el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const dayOfWeek = today.getDay();

    // Encuentra el último lunes ajustando la fecha actual hacia atrás
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Ajusta al lunes más cercano

    // Resetea la hora para obtener el inicio del lunes (00:00:00)
    startOfWeek.setHours(0, 0, 0, 0);



    const publicaciones_activas = await prisma.publicacion.count({
        where: {
            idestado: 1
        }
    });

    // Publicaones hehcas de en la semana actual
    const publicaciones_semana = await prisma.publicacion.count({
        where: {
            fechacreacion: {
                gte: startOfWeek,
                lte: today
            }
        }
    });

    // Avistamientos hechos en la semana actual
    const avistamientos_semana = await prisma.avistamiento.count({
        where: {
            fechacreacion: {
                gte: startOfWeek,
                lte: today
            }
        }
    });

    const total_usuarios_activos = await prisma.usuario.count({
        where: {
            idestado: 1
        }
    });



    //Informaciones de la Semana Pasada
    const informacion_semana_pasada = await prisma.reporte.findFirst({
        where: {
           activo: true,
        }
    });

    const informaciones_semana_actual = {
        publicaciones_activas,
        publicaciones_semana,
        avistamientos_semana,
        total_usuarios_activos
    };

    const cantidad_total_usuarios = await prisma.usuario.count();

    const cantidad_usuarios_por_rol = await prisma.rol.findMany({
        select: {
            id: true,
            nombrerol: true,
            _count: {
                select: {
                    usuario: true
                }
            }
        }
    });

    const infornacion_grafico_usuarios = {
        cantidad_total_usuarios,
        cantidad_usuarios_por_rol
    };

    const cantidad_total_materiales_educativos = await prisma.recursoeducativo.count();

    const cantidad_materiales_educativos_por_tipo = await prisma.categoriamaterial.findMany({
        select: {
            id: true,
            nombrecategoriamaterial: true,
            _count: {
                select: {
                    recursoeducativo: true
                }
            }
        }
    });

    const informacion_grafico_materiales_educativos = {
        cantidad_total_materiales_educativos,
        cantidad_materiales_educativos_por_tipo
    };

    return {informaciones_semana_actual, informacion_semana_pasada, infornacion_grafico_usuarios, informacion_grafico_materiales_educativos};

}

const guardarUbicacionRTUsuario = async (id, ubicacion) => {
    const usuario_ubicacion = await prisma.ubicacion_usuario.findFirst({
        where: {
            idusuario: id
        }
    });

    if(usuario_ubicacion){
        await prisma.ubicacion_usuario.update({
            where: {
                id: usuario_ubicacion.id
            },
            data: {
                ubicacion_latitud: ubicacion.latitud.toString(),
                ubicacion_longitud: ubicacion.longitud.toString(),
                fechahoraactualizacion: new Date()
            }
        });
    }else{
        await prisma.ubicacion_usuario.create({
            data: {
                usuario: {
                    connect: {
                        id: id
                    }
                },
                ubicacion_latitud: ubicacion.latitud.toString(),
                ubicacion_longitud: ubicacion.longitud.toString()
            }
        });
    }

    return {success: true, message: "Ubicación actualizada con éxito"};
}

const guardarIDNotificacionUsuario = async (id, idNotificacion) => {
    const usuario = await prisma.usuario.update({
        where: {
            id: id
        },
        data: {
            id_notificacion_expo: idNotificacion
        }
    });

    return {success: true, message: "ID de notificación actualizado con éxito"};
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
    getUserInfoForAsyncStorage,
    prueba_refresh_token,
    getUsuarioTableBO,
    modificarAdminAUsuario,
    getProfileInfo,
    getEstadisticasPublicaciones,
    obtenerInfoEditarUsuario,
    editarUsuario,
    cambiarImagenPerfil,
    informacionesHomeBO,
    guardarUbicacionRTUsuario,
    guardarIDNotificacionUsuario
};