const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {supabaseAnon,supabaseAdmin} = require('../services/supabaseService');
const {getLocalidadUbicacion} = require('../services/ubicacion');

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
            }
        });
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

const getInfoDesaparecidoByID = async (id) => {
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
                    }
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
    deleteDesaparecido,
    getDesaparecidosActivosScrollGrande,
    getDesaparecidosActivosScrollHorizontal,
    getInfoDesaparecidoByID
};
