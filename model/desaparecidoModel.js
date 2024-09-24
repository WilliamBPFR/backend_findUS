const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { supabaseAnon} = require('../services/supabaseService');	

// Crear un nuevo desaparecido
const crearDesaparecido = async (desaparecido_data) => {
    const desaparecido = await prisma.publicacion.create({
        data: {
            idusuario: desaparecido_data.idusuario, // aparte
            nombredesaparecido: desaparecido_data.nombre_desaparecido,
            idtipodocumento: desaparecido_data.id_tipo_Documento,
            numerodocumentodesaparecido: desaparecido_data.documento_desaparecido,
            edad: desaparecido_data.edad, // aparte
            telefono: desaparecido_data.telefono,
            fechadesaparicion: new Date(desaparecido_data.fecha_desaparicion),
            descripcionpersonadesaparecido: desaparecido_data.descripcion_desaparecido,
            relacionusuariocondesaparecido: desaparecido_data.relacion_desaparecido,
            informacioncontacto: desaparecido_data.contacto,
            ubicaci_n_desaparicion_latitud: desaparecido_data.ubicacion_latitud,
            ubicaci_n_desaparicion_longitud: desaparecido_data.ubicacion_longitud,
            verificado: false,
            fechanacimiento: new Date(desaparecido_data.fecha_nacimiento),
            idestado: 1,
            fechacreacion: new Date(),
        }
    });
    return desaparecido;
}

// Verificar si el desaparecido ya existe
const desaparecidoExistente = async (idtipodocumento, numerodocumento) => {
    const desaparecido_existente = await prisma.publicacion.findFirst({
        where: {
            idtipodocumento: idtipodocumento,
            numerodocumento: numerodocumento,
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
