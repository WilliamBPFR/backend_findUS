const { PrismaClient,  } = require('@prisma/client')
const encryptService = require('../services/encryptService');
const {supabaseAnon,supabaseAdmin} = require('../services/supabaseService');
const { uploadFile } = require('../services/uploadFiles');
const e = require('express');
const resendService = require('../services/resendService');
const reportesServices = require('../services/reportesServices');


const prisma = new PrismaClient()

const crearUsuario = async (user_data) => {
    // Registrar al usuario con Supabase Auth
    const { data, error } = await supabaseAnon.auth.signUp({
        email: user_data.email,
        password: user_data.contrasena,
        options: {
            emailRedirectTo: "https://findus-online.com/usuario_verificado"
        }
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

const verificar_usuario_link_bo = async (id) => {
    const user = await prisma.usuario.findFirst({
        where: {
            id: id
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

    const {data,error} = await supabaseAnon.auth.resetPasswordForEmail(email,{redirectTo: "https://findus-online.com/nuevaContrasena"});
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
        return {message: "Correo o Contraseña incorrecta. Revise e intente de nuevo", autenticado: false};
    }

    if(usuario.verificado){
        const {data,error} = await supabaseAnon.auth.signInWithPassword({
            email: email,
            password: contrasena
        });
        if(error){
            console.error('Error en la verificación del correo:', error);
            console.log(error.message);
            return { autenticado: false, message: "Correo o Contraseña incorrecta. Revise e intente de nuevo" };
        }

        if(data){
            return {autenticado: true, message: "Usuario autenticado", token: data?.session.access_token};
        }
    }else{
        return {message: "Usuario no verificado. Verifique su usuario antes de continuar.", autenticado: false, id: usuario.id};
    }
}

const loginUsuarioBackOffice = async (email, contrasena) => {
    console.log('Login Usuario:', email, contrasena);
    const usuario = await prisma.usuario.findFirst({
        where: {
            email: email
        },
        include:{
            rol: true
        }
    });

    if(!usuario){
        return {message: "Correo o Contraseña incorrecta. Revise e intente de nuevo", autenticado: false};
    }

    if(usuario.verificado){
        if (usuario.idrol == 1) {
            return {message: "Usuario no tiene los permisos necesarios para acceder a la aplicación. Contacte con un administrador para la concesión de los permisos.", autenticado: false};
        }
        const {data,error} = await supabaseAnon.auth.signInWithPassword({
            email: email,
            password: contrasena
        });
        if(error){
            console.error('Error en la verificación del correo:', error);
            return { autenticado: false, message: error.message };
        }

        if(data){
            return {autenticado: true, message: "Usuario logueado correctamente.", token: data?.session.access_token, id_usuario: usuario.id, id_rol: usuario.idrol, nombre_rol: usuario.rol.nombrerol};
        }
    }else{
        return {message: "Usuario no verificado. Verifique sus correos y verifícalo.", autenticado: false};
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
            idrol: idRol
        },
        include: {
            rol: true
        }
    });

    const rol = await prisma.rol.findFirst({
        where: {
            id: idRol
        }
    });

    resendService.correo_cambio_roles(user.email, `${user.nombre} ${user.apellido}`,rol.nombrerol);

    return user;
}

const modificarAdminAUsuario = async (id, user_data) => {
    const estado_user_antiguo = await prisma.usuario.findFirst({
        where: {
            id: id
        },
        select: {
            idestado: true
        }
    });

    const user = await prisma.usuario.update({
        where: {
            id: id
        },
        data: {
            idrol: user_data.rol,
            idestado: user_data.estado
        },
        include: {
            rol: true,
        }
    });

    if (estado_user_antiguo.idestado != user_data.estado) {
        if (user_data.estado == 1) {
            resendService.correo_activación_usuario(user.email, `${user.nombre} ${user.apellido}`);
        }else if (user_data.estado == 2) {
            resendService.correo_desactivación_usuario(user.email, `${user.nombre} ${user.apellido}`);
        }
    }else{
        resendService.correo_cambio_roles(user.email, `${user.nombre} ${user.apellido}`,user.rol.nombrerol);
    }
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

    const totalPublicacionesCerradas = await prisma.publicacion.count({
        where: {
            idusuario: userId,
            OR: [
                { idestado: 4 },
                { idestado: 5 }
            ]
        }
    });

    return {
        totalPublicacionesHechas,
        totalPublicacionesActivas,
        totalPublicacionesInactivas,
        totalAvistamientosPublicados,
        totalComentariosHechos,
        totalPublicacionesCerradas
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
    
    const total_reportes_resueltos = await prisma.publicacion.count({
        where: {
            idestado: 4
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
        total_usuarios_activos,
        total_reportes_resueltos
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

const getPublicacionesFiltroMovil = async (page, limit,nombre) => {

    const publicaciones = await prisma.publicacion.findMany({
        where: {
            OR: [
                { nombredesaparecido: { contains: nombre, mode: 'insensitive' } },
                { descripcionpersonadesaparecido: { contains: nombre, mode: 'insensitive' } }
            ],
            idestado: 1
        },
        select: {
            nombredesaparecido: true,
            id: true,
            fechadesaparicion: true,
            fechacreacion: true,
            fotospublicacion:{
                select:{
                    urlarchivo: true
                },
                where: {
                    idtipofotopublicacion: 1
                }
            }
        },
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
            fechacreacion: 'desc'
        }
    },);

    return publicaciones;
}

const crear_reporte_backoffice = async () => {
    // Usuarios
    const total_usuario = await prisma.usuario.count();
    const total_usuarios_activos = await prisma.usuario.count({
        where: {
            idestado: 1
        }
    });
    const total_usuarios_inactivos = await prisma.usuario.count({
        where: {
            idestado: 2
        }
    });
    const total_usuarios_por_rol = await prisma.rol.findMany({
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

    const usuario_data = [
        { Tipo: 'Total', Cantidad: total_usuario },
        { Tipo: 'Activos', Cantidad: total_usuarios_activos },
        { Tipo: 'Inactivos', Cantidad: total_usuarios_inactivos },
        ...total_usuarios_por_rol.map(rol => ({
            Tipo: `Usuarios como ${rol.nombrerol}`,
            Cantidad: rol._count.usuario
        }))
    ]

    // Publicaciones
    const total_publicaciones = await prisma.publicacion.count();
    const total_publicaciones_activas = await prisma.publicacion.count({
        where: {
            idestado: 1
        }
    });
    const total_publicaciones_inactivas = await prisma.publicacion.count({
        where: {
            idestado: 2
        }
    });
    const total_publicaciones_cerradas_totales = await prisma.publicacion.count({
        where: {
            OR: [
                { idestado: 4 },
                { idestado: 5 }
            ]
        }
    });
    const total_publicaciones_cerradas_resueltas = await prisma.publicacion.count({
        where: {
            idestado: 4,
        }
    });
    const total_publicaciones_cerradas_no_resueltas = await prisma.publicacion.count({
        where: {
            idestado: 5
        }
    });
    const total_comentarios_en_publicaciones = await prisma.comentario.count();

    const publicaciones_data = [
        { Tipo: 'Total', Cantidad: total_publicaciones },
        { Tipo: 'Activas', Cantidad: total_publicaciones_activas },
        { Tipo: 'Inactivas', Cantidad: total_publicaciones_inactivas },
        { Tipo: 'Cerradas', Cantidad: total_publicaciones_cerradas_totales },
        { Tipo: 'Cerradas Resueltas', Cantidad: total_publicaciones_cerradas_resueltas },
        { Tipo: 'Cerradas No Resueltas', Cantidad: total_publicaciones_cerradas_no_resueltas },
        { Tipo: 'Total de Comentarios en Publicaciones', Cantidad: total_comentarios_en_publicaciones }
    ];

    // Avistamientos
    const total_avistamientos = await prisma.avistamiento.count();
    const avistamientos_en_publicaciones_cerradas_resueltas = await prisma.avistamiento.count({
        where: {
            publicacion: {
                idestado: 4
            }
        }
    });
    const avistamientos_en_publicaciones_cerradas_no_resueltas = await prisma.avistamiento.count({
        where: {
            publicacion: {
                idestado: 5
            }
        }
    });

    const avistamientos_data = [
        { Tipo: 'Total', Cantidad: total_avistamientos },
        { Tipo: 'Avisatamientos en publicaciones cerradas resueltas', Cantidad: avistamientos_en_publicaciones_cerradas_resueltas },
        { Tipo: 'Avistamientos en publicaciones cerradas no resueltas', Cantidad: avistamientos_en_publicaciones_cerradas_no_resueltas }
    ];

    // Material Educativo
    const total_material_educativo = await prisma.recursoeducativo.count();
    const total_material_educativo_activos = await prisma.recursoeducativo.count({
        where: {
            idestado: 1
        }
    });
    const total_material_educativo_inactivos = await prisma.recursoeducativo.count({
        where: {
            idestado: 2
        }
    });
    const total_material_educatico_por_categoria = await prisma.categoriamaterial.findMany({
        select: {
            id: true,
            nombrecategoriamaterial: true,
            _count: {
                select: {
                    recursoeducativo: true,
                }
            },
        }
    });

    const total_vistas_por_tipo_material_educativo = await prisma.recursoeducativo.groupBy({
        by: ['idcategoriamaterial'],
        _sum: {
            vistas: true,
        }
    });


    const material_educativo_data = [
        { Tipo: 'Total', Cantidad: total_material_educativo , Vistas: "N/A"},
        { Tipo: 'Activos', Cantidad: total_material_educativo_activos, Vistas: "N/A" },
        { Tipo: 'No Activos', Cantidad: total_material_educativo_inactivos, Vistas: "N/A" },
        ...total_material_educatico_por_categoria.map(categoria => ({
            Tipo: `Material Educativo - ${categoria.nombrecategoriamaterial}`,
            Cantidad: categoria._count.recursoeducativo,
            Vistas: total_vistas_por_tipo_material_educativo.find(vistas => vistas.idcategoriamaterial === categoria.id)?._sum.vistas === undefined ? 0 : parseInt(total_vistas_por_tipo_material_educativo.find(vistas => vistas.idcategoriamaterial === categoria.id)._sum.vistas)
        }))
    ];
    console.log('Material Educativo:', material_educativo_data);
    const filebase64 = await reportesServices.crear_reporte_excel(usuario_data,publicaciones_data,avistamientos_data,material_educativo_data); 
    return filebase64;
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
    guardarIDNotificacionUsuario,
    getPublicacionesFiltroMovil,
    loginUsuarioBackOffice,
    crear_reporte_backoffice,
    verificar_usuario_link_bo
};