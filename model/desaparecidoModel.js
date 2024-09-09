const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo desaparecido
const crearDesaparecido = async (desaparecido_data) => {
    const desaparecido = await prisma.publicacion.create({
        data: {
            idUsuario: desaparecido_data.idUsuario,
            nombreDesaparecido: desaparecido_data.nombreDesaparecido,
            idTipoDocumento: desaparecido_data.idTipoDocumento,
            numeroDocumento: desaparecido_data.numeroDocumento,
            edad: desaparecido_data.edad,
            telefono: desaparecido_data.telefono,
            fechaDesaparicion: new Date(desaparecido_data.fechaDesaparicion),
            descripcionDesaparecido: desaparecido_data.descripcionDesaparecido,
            relacionDesaparecido: desaparecido_data.relacionDesaparecido,
            informacionContacto: desaparecido_data.informacionContacto,
            ubicacionDesaparicion: desaparecido_data.ubicacionDesaparicion,
            verificado: desaparecido_data.verificado,
            fechaNacimiento: new Date(desaparecido_data.fechaNacimiento),
            lugarDesaparicion: desaparecido_data.lugarDesaparicion,
            idEstado: desaparecido_data.idEstado,
            fechaCreacion: new Date(desaparecido_data.fechaCreacion),
        }
    });
    return desaparecido;
}

// Verificar si el desaparecido ya existe
const desaparecidoExistente = async (nombre, fechaNacimiento) => {
    const desaparecido_existente = await prisma.publicacion.findFirst({
        where: {
            nombre: nombre,
            fechaNacimiento: new Date(fechaNacimiento),
        }
    });

    if (desaparecido_existente == null) {
        return { message: "", existe: false };
    } else {
        return { message: `El desaparecido ${nombre} con fecha de nacimiento ${fechaNacimiento} ya existe`, existe: true };
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

// Actualizar un desaparecido por ID
const updateDesaparecido = async (id, data) => {
    return await prisma.publicacion.update({
        where: {
            id: parseInt(id),
        },
        data: data,
    });
}

// Eliminar un desaparecido por ID
const deleteDesaparecido = async (id) => {
    return await prisma.publicacion.delete({
        where: {
            id: parseInt(id),
        }
    });
}

// Exportar funciones
module.exports = {
    crearDesaparecido,
    desaparecidoExistente,
    getDesaparecidoById,
    getAllDesaparecidos,
    updateDesaparecido,
    deleteDesaparecido
};
