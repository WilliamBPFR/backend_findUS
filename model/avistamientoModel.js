const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

const crearAvistamiento = async (avistamiento_data) => {
    const avistamiento = await prisma.avistamiento.create({
        data: {
            idUsuario: avistamiento_data.idUsuario,
            idPublicacion: avistamiento_data.idPublicacion,
            ubicacion: avistamiento_data.ubicacion,
            fechaHora: new Date(avistamiento_data.fechaAvistamiento),
            detalles: avistamiento_data.detalles,
            Verificado: avistamiento_data.Verificado,
            IdEstatus: avistamiento_data.IdEstatus,
            fechaCreacion: new Date(avistamiento_data.fechaCreacion),
            fotosavistamiento: avistamiento_data.fotosavistamiento,

        }
    });
    return avistamiento;
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
};