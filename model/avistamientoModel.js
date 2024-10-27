const {PrismaClient} = require('@prisma/client')
const { uploadFile } = require('../services/uploadFiles');
const { getLocalidadUbicacion } = require('../services/ubicacion');

const prisma = new PrismaClient()

const crearAvistamiento = async (avistamiento_data,id_usuario) => {
    const localidadAvistamiento = await getLocalidadUbicacion(avistamiento_data.ubicacion_latitud, avistamiento_data.ubicacion_longitud);
    const avistamiento = await prisma.avistamiento.create({
        data: {
            idusuario: id_usuario,
            idpublicacion: parseInt(avistamiento_data.idPublicacion),
            ubicacion_desaparicion_latitud: avistamiento_data.ubicacion_latitud,
            ubicacion_desaparicion_longitud: avistamiento_data.ubicacion_longitud,
            fechahora: new Date(avistamiento_data.fecha_avistamiento),
            detalles: avistamiento_data.detalles,
            localidad_avistamiento: localidadAvistamiento,
            verificado: false,
            idestatus: 1,
            fechacreacion: new Date(),

        }
    });
    return avistamiento;
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
                idavistamiento: foto_data.idavistamiento || null,
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

module.exports = {
    crearAvistamiento,
    avistamientoExistente,
    getAvistamientoById,
    getAllAvistamientos,
    updateAvistamiento,
    deleteAvistamiento,
    crearFotoAvistamiento
};