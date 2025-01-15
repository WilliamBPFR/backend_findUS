const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {supabaseAnon,supabaseAdmin} = require('../services/supabaseService');
const {getLocalidadUbicacion} = require('../services/ubicacion');
const locationService = require('../services/locationService');
const resendService = require('../services/resendService');

// Crear un nuevo desaparecido
const crearDesaparecido = async (desaparecido_data,user_id) => {
    const localidad = await getLocalidadUbicacion(desaparecido_data.ubicacion_latitud,desaparecido_data.ubicacion_longitud);
    console.log(desaparecido_data)
    try{
        const desaparecido = await prisma.publicacion.create({
            data: {
                usuario: {
                    connect: { id: parseInt(user_id) } // Conectar con el usuario usando su ID
                },
                nombredesaparecido: desaparecido_data.nombre_desaparecido,
                tipodocumento: {
                    connect: { id: desaparecido_data.id_tipo_documento } // Conectar con el tipo de documento usando su ID
                },
                numerodocumentodesaparecido: desaparecido_data.documento_desaparecido,
                edad: desaparecido_data.edad, // Valor directo (no relación)
                telefono: desaparecido_data.telefono,
                fechadesaparicion: desaparecido_data.fecha_desaparicion,
                descripcionpersonadesaparecido: desaparecido_data.descripcion_desaparecido,
                relacionusuariocondesaparecido: desaparecido_data.relacion_desaparecido,
                informacioncontacto: desaparecido_data.contacto,
                ubicacion_desaparicion_latitud: desaparecido_data.ubicacion_latitud,
                ubicacion_desaparicion_longitud: desaparecido_data.ubicacion_longitud,
                localidad_desaparicion: localidad,
                verificado: false,
                fechanacimiento: desaparecido_data.fecha_nacimiento,
                estado: {
                    connect: { id: desaparecido_data.idestado || 1 } // Conectar con el estado usando su ID, 1 como valor por defecto
                },
                fechacreacion: new Date(), // Generar la fecha actual
            },
            include: {
                usuario: true
            }
        });

        await enviarNotificacionUsuariosCercanos(desaparecido_data.ubicacion_latitud,desaparecido_data.ubicacion_longitud,desaparecido_data.nombre_desaparecido);
        await resendService.correo_crear_publicacion(desaparecido.usuario.email,`${desaparecido.usuario.nombre} ${desaparecido.usuario.apellido}`,desaparecido.nombredesaparecido);
        return { success: true, id: desaparecido.id };
    } catch (error) {
        console.error('Error al crear el desaparecido:', error);
        return { success: false, error };
    }
};

// Verificar si el desaparecido ya existe
const desaparecidoExistente = async (idtipodocumento, numerodocumento, nombre) => {
    const desaparecido_existente = await prisma.publicacion.findFirst({
        where: {
            idtipodocumento: idtipodocumento,
            numerodocumentodesaparecido: numerodocumento,
        }
    });

    if (desaparecido_existente == null) {
        return { message: "", existe: false };
    } else {
        return { message: `El desaparecido ${nombre} con fecha de nacimiento ${numerodocumento} ya existe`, existe: true };
    }
}

// Obtener un desaparecido por ID
const getDesaparecidoById = async (id) => {
    return await prisma.publicacion.findUnique({
        where: {
            id: parseInt(id),
        }
    });
}

// Obtener todos los desaparecidos
const getAllDesaparecidos = async () => {
    return await prisma.publicacion.findMany();
}

// obtener todos los desparecidos de un usuario
const getDesaparecidosByUser = async (id) => {
    console.log("ID del usuario: ", id);
    try {
        return await prisma.publicacion.findMany({
            where: {
                idusuario: parseInt(id)
            },
            select:{
                id: true,
                nombredesaparecido: true,
                tipodocumento: {
                    select:{
                        id: true,
                        nombretipodocumento: true
                    }
                },
                numerodocumentodesaparecido: true,
                telefono: true,
                fechadesaparicion: true,
                descripcionpersonadesaparecido: true,
                relacionusuariocondesaparecido: true,
                informacioncontacto: true,
                ubicacion_desaparicion_latitud: true,
                ubicacion_desaparicion_longitud: true,
                fechanacimiento: true,
                estado: {
                    select:{
                        id: true,
                        nombreestado: true
                    }
                },
                verificado: true,
                fotospublicacion: {
                    select:{
                        urlarchivo: true,
                        idtipofotopublicacion: true
                    },
                    where:{
                        idtipofotopublicacion: 1
                    }
                }
            },
            orderBy:{
                fechacreacion: 'desc'
            }
        });
    } catch (error) {
        console.error('Error al obtener los desaparecidos del usuario:', error);
        return { success: false, error };
    }
}

const getCantidadDesaparecidosActivos = async () => {
    return await prisma.publicacion.count({
        where: {
            estado: {
                id: 1
            }
        }
    });
}

const getDesaparecidosActivosScrollGrande = async (page=1,limit=10) => {
    const cantPublicaciones = page == 1 ? await getCantidadDesaparecidosActivos() : 0;
    const publicacionesASaltarIniciales = (cantPublicaciones > 5 && page == 1) ? 5 : cantPublicaciones;
    const skip = page == 1 ? ((page - 1) * limit + publicacionesASaltarIniciales) : (page - 1) * limit; // Cálculo de los registros a omitir
    return await prisma.publicacion.findMany({
        where: {
            estado: {
                id: 1
            }
        },
        select:{
            id: true,
            fechacreacion: true,
            nombredesaparecido: true,
            descripcionpersonadesaparecido: true,
            fechadesaparicion: true,
            usuario: {
                select:{
                    nombre: true,
                    apellido: true,
                    urlfotoperfil: true
                }
            },
            fotospublicacion: {
                select:{
                    urlarchivo: true,
                    idtipofotopublicacion: true
                },
                where:{
                    idtipofotopublicacion: 1
                }
            }
        },
        orderBy:{
            fechacreacion: 'desc'
        },
        skip: skip,
        take: limit
    });


}

const getDesaparecidosActivosScrollHorizontal = async () => {
    const cantPublicaciones = await getCantidadDesaparecidosActivos();
    console.log("Cantidad de publicaciones activas: ");
    console.log(cantPublicaciones);
    const limite = cantPublicaciones > 5 ? 5 : cantPublicaciones;
    return await prisma.publicacion.findMany({
        where: {
            estado: {
                id: 1
            }
        },
        select:{
            id: true,
            nombredesaparecido: true,
            fechadesaparicion: true,
            fechanacimiento: true,
            numerodocumentodesaparecido: true,
            fotospublicacion: {
                select:{
                    urlarchivo: true,
                    idtipofotopublicacion: true
                },
                where:{
                    idtipofotopublicacion: 1
                }
            }
        },
        orderBy:{
            fechacreacion: 'desc'
        },
        take: limite
    });


}

const getInfoDesaparecidoByID_Movil = async (id) => {
    const publicacion = await prisma.publicacion.findUnique({
        where: {
            id: parseInt(id)
        },
        include:{
            tipodocumento: true,
            estado: true,
            fotospublicacion: {
                select:{
                    urlarchivo: true,
                    idtipofotopublicacion: true
                },
                where:{
                    idtipofotopublicacion: 1
                },
            },
            avistamiento:{
                where:{
                    estado: {
                        id: 1
                    }
                },
                include:{
                    fotosavistamiento: {
                        select:{
                            urlarchivo: true,
                        }
                    },
                    usuario:{
                        select:{
                            nombre: true,
                            apellido: true,
                            urlfotoperfil: true
                        }
                    },
                    estado: true
                },
                orderBy:{
                    id: 'desc'
                }
                    
            },
            comentario:{
                include:{
                    usuario:{
                        select:{
                            nombre: true,
                            apellido: true,
                            urlfotoperfil: true
                        }
                    }
                }
            }
        }
    });
    return publicacion;

}

const getInfoDesaparecidoByID_BO = async (id) => {
    const publicacion = await prisma.publicacion.findUnique({
        where: {
            id: parseInt(id)
        },
        include:{
            tipodocumento: true,
            estado: true,
            fotospublicacion: {
                select:{
                    urlarchivo: true,
                    idtipofotopublicacion: true
                },
                where:{
                    idtipofotopublicacion: 1
                },
            },
            avistamiento:{
                include:{
                    fotosavistamiento: {
                        select:{
                            urlarchivo: true,
                        }
                    },
                    usuario:{
                        select:{
                            nombre: true,
                            apellido: true,
                            urlfotoperfil: true
                        }
                    },
                    estado: true
                },
                orderBy:{
                    id: 'desc'
                }
                    
            },
            comentario:{
                include:{
                    usuario:{
                        select:{
                            nombre: true,
                            apellido: true,
                            urlfotoperfil: true
                        }
                    }
                }
            }
        }
    });
    return publicacion;

}



const crearComentarioPublicaciones = async (comentario,user_id) => {
    try{
        const comentarioCreado = await prisma.comentario.create({
            data:{
              fechacreacion: new Date(),
              idpublicacion: parseInt(comentario.idpublicacion),
              texto: comentario.texto,
              idusuario: parseInt(user_id)
            },
            include:{
                usuario:{
                    select:{
                        nombre: true,
                        apellido: true,
                        urlfotoperfil: true
                    }
                }
            }
        });
        return {success: true, comentario: comentarioCreado};
    }catch(error){
        console.error('Error al crear el comentario:', error);
        return {success: false, error};
    }
}

const getDesaparecidosTableBO = async (page,limit, filtros,servicios_emergencias) => {
    const condiciones = [
        filtros?.nombreDesaparecido ? {nombredesaparecido : { contains: filtros?.nombreDesaparecido, mode: 'insensitive' }} : null,
        filtros?.fechaDesde ? {fechadesaparicion : { gte: new Date(filtros?.fechaDesde) }} : null,
        filtros?.fechaHasta ? {fechadesaparicion : { lte: new Date(filtros?.fechaHasta) }} : null,
        filtros?.estatus ? {estado : { id: parseInt(filtros?.estatus) }} : null,
        servicios_emergencias ? {estado : { id: 1 }} : null
    ].filter(condicion => condicion !== null); // Filtra valores `null`


    const desaparecidos = await prisma.publicacion.findMany({
        select:{
            id: true,
            nombredesaparecido: true,
            fechadesaparicion: true,
            fechacreacion: true,
            verificado: true,
            estado: {
                select:{
                    id: true,
                    nombreestado: true
                }
            }
        },
        where:{
            AND: condiciones
        },
        orderBy: {
            fechacreacion: 'desc'
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
    });
    const estado = servicios_emergencias ? 1 : filtros?.estatus;
    const desaparecidosCount = await prisma.publicacion.count({
        where:{
            nombredesaparecido: filtros?.nombreDesaparecido ? { contains: filtros?.nombreDesaparecido, mode: 'insensitive' } : undefined,
            fechadesaparicion: {
                gte: filtros?.fechaDesde ? new Date(filtros?.fechaDesde) : undefined,
                lte: filtros?.fechaHasta ? new Date(filtros?.fechaHasta) : undefined,
            },
            estado: (filtros?.estatus || servicios_emergencias) ? { id: parseInt(estado) } : undefined,
            
        },
    });

    return {publicaciones: desaparecidos, totalPublicaciones: desaparecidosCount};

}


const obtenerInformacionEditarPublicacionBO = async (id) => {
    const publicacion = await prisma.publicacion.findUnique({
        where: {
            id: parseInt(id)
        },
        include:{
            tipodocumento: true,
            estado: true,
            fotospublicacion: {
                select:{
                    id: true,
                    urlarchivo: true,
                    idtipofotopublicacion: true
                },
            },
        }
    });
    return publicacion;
}

const updateDesaparecidoBO = async (id, desaparecido_data) => {
    const localidad = await getLocalidadUbicacion(desaparecido_data.ubicacion_latitud,desaparecido_data.ubicacion_longitud);
    try{
        const desaparecido =  await prisma.publicacion.update({
            where: {
                id: parseInt(id),
            },
            data: {
                nombredesaparecido: desaparecido_data.nombre_desaparecido,
                tipodocumento: {
                    connect: { id: desaparecido_data.id_tipo_documento } // Conectar con el tipo de documento usando su ID
                },
                numerodocumentodesaparecido: desaparecido_data.documento_desaparecido,
                edad: desaparecido_data.edad, // Valor directo (no relación)
                telefono: desaparecido_data.telefono,
                fechadesaparicion: desaparecido_data.fecha_desaparicion,
                descripcionpersonadesaparecido: desaparecido_data.descripcion_desaparecido,
                relacionusuariocondesaparecido: desaparecido_data.relacion_desaparecido,
                informacioncontacto: desaparecido_data.contacto,
                ubicacion_desaparicion_latitud: desaparecido_data.ubicacion_latitud,
                ubicacion_desaparicion_longitud: desaparecido_data.ubicacion_longitud,
                localidad_desaparicion: localidad,
                fechanacimiento: desaparecido_data.fecha_nacimiento,
                estado: {
                    connect: { id: desaparecido_data.idestado || 1 } // Conectar con el estado usando su ID, 1 como valor por defecto
                },
                fechaactualizacion: new Date(), // Generar la fecha actual
            },
        });
        return { success: true, id: desaparecido.id };
    }catch(error){
        console.error('Error al actualizar el desaparecido:', error);
        return { success: false, error };
    }
}





// Actualizar un desaparecido por ID
const updateDesaparecido = async (id, data) => {
    const localidad = await getLocalidadUbicacion(data.ubicacion_latitud,data.ubicacion_longitud)
    try{
        const desaparecido = await prisma.publicacion.update({
            where: {
                id: parseInt(id),
            },
            data: {
                nombredesaparecido: data.nombre_desaparecido,
                tipodocumento: {
                    connect: { id: data.id_tipo_documento } // Conectar con el tipo de documento usando su ID
                },
                numerodocumentodesaparecido: data.documento_desaparecido,
                edad: data.edad, // Valor directo (no relación)
                telefono: data.telefono,
                fechadesaparicion: data.fecha_desaparicion,
                descripcionpersonadesaparecido: data.descripcion_desaparecido,
                relacionusuariocondesaparecido: data.relacion_desaparecido,
                informacioncontacto: data.contacto,
                ubicacion_desaparicion_latitud: data.ubicacion_latitud,
                ubicacion_desaparicion_longitud: data.ubicacion_longitud,
                localidad_desaparicion: localidad,
                verificado: false,
                fechanacimiento: data.fecha_nacimiento,
                estado: {
                    connect: { id: data.idestado || 1 } // Conectar con el estado usando su ID, 1 como valor por defecto
                },
                fechaactualizacion: new Date(), // Generar la fecha actual
            },
        });
        return { success: true, id: desaparecido.id };
    } catch (error) {
        console.error('Error al actualizar el desaparecido:', error);
        return { success: false, error };
    }
}

// Eliminar un desaparecido por ID
const deleteDesaparecido = async (id) => {
    return await prisma.publicacion.delete({
        where: {
            id: parseInt(id),
        }
    });
}






const desactivarDesaparecido = async (id) => {
    const desaparecido = await prisma.publicacion.update({
        where: {
            id: parseInt(id),
        },
        data: {
            estado: {
                connect: { id: 2 } // Conectar con el estado usando su ID
            }
        },
        include:{
            usuario: true
        }
    });

    resendService.correo_desactivar_publicación(desaparecido.usuario.email,`${desaparecido.usuario.nombre} ${desaparecido.usuario.apellido}`,desaparecido.nombredesaparecido);
    return desaparecido;
}


const activarDesaparecido = async (id) => {
    const desaparecido =  await prisma.publicacion.update({
        where: {
            id: parseInt(id),
        },
        data: {
            estado: {
                connect: { id: 1 } // Conectar con el estado usando su ID
            }
        },
        include:{
            usuario: true
        }
    });

    resendService.correo_activar_publicación(desaparecido.usuario.email,`${desaparecido.usuario.nombre} ${desaparecido.usuario.apellido}`,desaparecido.nombredesaparecido);
    return desaparecido;
}

const CerrarDesaparecido = async (id, tipoCierre) => {
    const desaparecido = await prisma.publicacion.update({
        where: {
            id: parseInt(id),
        },
        data: {
            estado: {
                connect: { id: parseInt(tipoCierre) == 1 ? 4 : 5 } // Conectar con el estado usando su ID
            }
        },
        include:{
            usuario: true
        }
    });

    resendService.correo_cerrar_publicacion(desaparecido.usuario.email,`${desaparecido.usuario.nombre} ${desaparecido.usuario.apellido}`,desaparecido.nombredesaparecido);

    return desaparecido;
}

const verificarPublicacion = async (id) => {
    return await prisma.publicacion.update({
        where: {
            id: parseInt(id),
        },
        data: {
            verificado: true
        },
    });
}

const pruebaLocationService = async (latitude, longitude) => {

    const publicaciones = await prisma.publicacion.findMany();
    publicaciones.forEach(async (publicacion) => {
        const location = locationService.getLocationsWithinRadius(latitude, longitude, publicacion.ubicacion_desaparicion_latitud, publicacion.ubicacion_desaparicion_longitud);
        console.log(`Hay Radio 5KM: ${location}. Publicacion: ${publicacion.nombredesaparecido} - ${publicacion.id}`);
    });
}

const enviarNotificacionUsuariosCercanos = async (latitude, longitude, nombreDesaparecido, idpublicacion) => {
    const dispositivos_activos = await prisma.ubicacion_usuario.findMany({include:{usuario:true}});
    
    let dispositivos_cercanos = [];
    dispositivos_activos.forEach(async (dispositivo) => {
        const location = locationService.getLocationsWithinRadius(latitude, longitude, dispositivo.ubicacion_latitud, dispositivo.ubicacion_longitud);
        if (location) {
            const message = {
                to: dispositivo.usuario.id_notificacion_expo,
                sound: 'default',
                title: 'Persona Desaparecida en tu área',
                body: `Se ha reportado la desaparición de ${nombreDesaparecido} en tu área. Ayuda a encontrarlo.`,
                data: { idpublicacion: idpublicacion },
                image: {uri: 'https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/notification_icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbm90aWZpY2F0aW9uX2ljb24ucG5nIiwiaWF0IjoxNzM2ODgzMTA2LCJleHAiOjg2NTczNjc5NjcwNn0.ye-BOtmktivP4h_S0LUhKJEEMsjvknojGDF-gn9rc7U&t=2025-01-14T19%3A31%3A46.979Z'},
              };
              await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            console.log(`Hay Radio 5KM: ${location}. Dispositivo: ${dispositivo.id}`);
        }
    });

    if(dispositivos_cercanos.length == 0){
        console.log("No hay dispositivos cercanos");
    }
    else{
        console.log("Dispositivos cercanos: ");
        console.log(dispositivos_cercanos);
    }
    
}

// Exportar funciones
module.exports = {
    crearDesaparecido,
    desaparecidoExistente,
    getDesaparecidoById,
    getAllDesaparecidos,
    updateDesaparecido,
    deleteDesaparecido,
    getDesaparecidosActivosScrollGrande,
    getDesaparecidosActivosScrollHorizontal,
    getDesaparecidosByUser,
    getInfoDesaparecidoByID_Movil,
    getInfoDesaparecidoByID_BO,
    crearComentarioPublicaciones,
    getDesaparecidosTableBO,
    obtenerInformacionEditarPublicacionBO,
    updateDesaparecidoBO,
    desactivarDesaparecido,
    activarDesaparecido,
    verificarPublicacion,
    CerrarDesaparecido,
    pruebaLocationService,
};
