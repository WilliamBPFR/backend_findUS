const {PrismaClient} = require('@prisma/client')
const { uploadFile } = require('../services/uploadFiles');
const { getLocalidadUbicacion } = require('../services/ubicacion');
const locationService = require('../services/locationService');

const prisma = new PrismaClient()

const crearAvistamiento = async (avistamiento_data,id_usuario) => {
    const localidadAvistamiento = await getLocalidadUbicacion(avistamiento_data?.ubicacion_latitud, avistamiento_data?.ubicacion_longitud);
    console.log("PASE LA LOCALIDAD");
    const avistamiento = await prisma.avistamiento.create({
        data: {
            idusuario: id_usuario,
            idpublicacion: parseInt(avistamiento_data?.idPublicacion),
            ubicacion_desaparicion_latitud: avistamiento_data?.ubicacion_latitud,
            ubicacion_desaparicion_longitud: avistamiento_data?.ubicacion_longitud,
            fechahora: new Date(avistamiento_data?.fecha_avistamiento),
            detalles: avistamiento_data?.detalles,
            localidad_avistamiento: localidadAvistamiento,
            verificado: false,
            idestatus: 1,
            fechacreacion: new Date(),

        },
        include:{
            publicacion: true
        }
    });
    await enviarNotificacionUsuariosCercanos(avistamiento_data?.ubicacion_latitud,avistamiento_data?.ubicacion_longitud,avistamiento.publicacion.nombredesaparecido,avistamiento.idpublicacion);
    
    return avistamiento;
}

const getAvistamientoPublicacion = async (idPublicacion) => {
    return await prisma.avistamiento.findMany({
        include: {
            fotosavistamiento:{
                select: {
                    urlarchivo: true,
                }
            },
            usuario:{
                select:{
                    nombre: true,
                    apellido: true,
                    urlfotoperfil: true
                }
            }, estado: true
        },
        where: {
            idpublicacion: parseInt(idPublicacion),
        },
        orderBy:{
            id: 'desc'
        }
    });
}

const crearFotoAvistamiento = async (foto_data) => {
    try{
        const { signedUrl, success, error } = await uploadFile(
            foto_data.base64File,
            foto_data.fileName,
            foto_data.mimeType,
            "Fotos Avistamientos"
        );
        if (!success) {
            throw new Error(`Error subiendo la imagen: ${error.message}`);
        }

        // Creando el registro en la tabla fotospublicacion con la URL de la imagen
        const nuevaFotoAvistamiento = await prisma.fotosavistamiento.create({
            data: {
                urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                idavistamiento: parseInt(foto_data.idavistamiento) || null,
                fechacreacion: new Date(),
            },
        });

        console.log('Foto subida:', nuevaFotoAvistamiento);
        return {
            success: true,
            message: 'Foto y/o archivo subido(s) correctamente.',
        };
        
    } catch (error) {
        console.error('Error creando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}



const editarFotoAvistamiento = async (foto_data) => {
    try{
        const { signedUrl, success, error } = await uploadFile(
            foto_data.base64File,
            foto_data.fileName,
            foto_data.mimeType,
            "Fotos Avistamientos"
        );
        if (!success) {
            throw new Error(`Error subiendo la imagen: ${error.message}`);
        }
        const foto = await prisma.fotosavistamiento.findFirst({
            select: {
                id: true,
            },
            where: {
                idavistamiento: parseInt(foto_data.idavistamiento),
            }
        });

        if (foto == null) {
            console.log('No se encontró la foto con el id proporcionado.');
            console.log('ID:', foto);
            return {
                success: false,
                message: 'No se encontró la foto con el id proporcionado.',
            };
        }
        // Creando el registro en la tabla fotospublicacion con la URL de la imagen
        const nuevaFotoAvistamiento = await prisma.fotosavistamiento.update({
            where: {
                id: parseInt(foto.id),
            },
            data: {
                urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                fecha_modificacion: new Date(),
            },
        });

        console.log('Foto subida:', nuevaFotoAvistamiento);
        return {
            success: true,
            message: 'Foto y/o archivo subido(s) correctamente.',
        };
        
    } catch (error) {
        console.error('Error creando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

const avistamientoExistente = async (idUsuario, idPublicacion) => {
    const avistamiento_existente = await prisma.avistamiento.findFirst({
        where: {
            idUsuario: idUsuario,
            idPublicacion: idPublicacion
        }
    });

    if (avistamiento_existente == null) {
        return {message: "", existe: false};
    } else {
        return {message: `El avistamiento del usuario ${idUsuario} con la publicacion ${idPublicacion} ya existe`, existe: true};
    }
}

const getAvistamientoById = async (id) => {
    return await prisma.avistamiento.findUnique({
        where: {
            id: parseInt(id),
        }
    });
}

const getAllAvistamientos = async () => {
    return await prisma.avistamiento.findMany();
}

const updateAvistamiento = async (id, data) => {
    return await prisma.avistamiento.update({
        where: {
            id: parseInt(id),
        },
        data: {
            idUsuario: data.idUsuario,
            idPublicacion: data.idPublicacion,
            ubicacion: data.ubicacion,
            fechaHora: new Date(data.fechaHora),
            detalles: data.detalles,
            Verificado: data.Verificado,
            IdEstatus: data.IdEstatus,
            fechaCreacion: new Date(data.fechaCreacion),
            fotosavistamiento: data.fotosavistamiento,
        }
    });
}

const deleteAvistamiento = async (id) => {
    return await prisma.avistamiento.delete({
        where: {
            id: parseInt(id),
        }
    });
}

const verificarAvistamiento = async (id) => {
    return await prisma.avistamiento.update({
        where: {
            id: parseInt(id),
        },
        data: {
            verificado: true,
        }
    });
}

const activarAvistamiento = async (id) => {
    return await prisma.avistamiento.update({
        where: {
            id: parseInt(id),
        },
        data: {
            idestatus: 1,
        }
    });
}

const desactivarAvistamiento = async (id) => {
    return await prisma.avistamiento.update({
        where: {
            id: parseInt(id),
        },
        data: {
            idestatus: 2,
        }
    });
}

const editarAvistamiento = async (id, data) => {
    return await prisma.avistamiento.update({
        where: {
            id: parseInt(id),
        },
        data: {
            fechahora: new Date(data.fecha_avistamiento),
            detalles: data.detalles,
            fecha_modificacion: new Date(),
            ubicacion_desaparicion_latitud: data.ubicacion_latitud,
            ubicacion_desaparicion_longitud: data.ubicacion_longitud,
        }
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
                title: 'Avistamiento de una Persona Desaparecida en tu área',
                body: `Se ha reportado el avistamiento de ${nombreDesaparecido} en tu área. Ve en tu entorno y ayuda a encontrarlo. Entra para ver detalles`,
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
            dispositivos_cercanos.push(dispositivo);
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


module.exports = {
    crearAvistamiento,
    avistamientoExistente,
    getAvistamientoById,
    getAllAvistamientos,
    updateAvistamiento,
    deleteAvistamiento,
    crearFotoAvistamiento,
    getAvistamientoPublicacion,
    verificarAvistamiento,
    activarAvistamiento,
    desactivarAvistamiento,
    editarAvistamiento,
    editarFotoAvistamiento
};