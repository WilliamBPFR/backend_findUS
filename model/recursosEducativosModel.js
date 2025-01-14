const { PrismaClient,  } = require('@prisma/client');
const { uploadFile } = require('../services/uploadFiles.js');


const prisma = new PrismaClient()


const obtenerRecursosEducativosActivos = async (page=1,limit=10) => {
    const recursos = await prisma.recursoeducativo.findMany({
        where: {
            idestado: 1
        },
        include: {
            categoriamaterial: true,
        },
        orderBy: {
            fechacreacion: 'desc'
        },
        skip: (parseInt(page)-1)*parseInt(limit),
        take: parseInt(limit)
    });
    return recursos;
}

const getMaterialEducativoByID = async (id) => {
    const materialEducativo = await prisma.recursoeducativo.findFirst({
        where:{
            id: parseInt(id)
        },
        include:{
            categoriamaterial:true,
            estado:true,
            usuario:{
                select:{
                    id:true,
                    nombre:true,
                    apellido:true
                }
            }
        }
    });
    return materialEducativo;
}

const getMaterialEducativoTableBO = async (page,limit, filtros) => {
    const materialEducativo = await prisma.recursoeducativo.findMany({
        select:{
            id:true,
            nombre:true,
            fechacreacion:true,
            estado:{
                select:{
                    id:true,
                    nombreestado:true
                }
            },
            categoriamaterial:{
                select:{
                    id:true,
                    nombrecategoriamaterial:true
                }
            }
        },
        where:{
            nombre: filtros?.nombreMaterial ? { contains: filtros?.nombreMaterial, mode: 'insensitive' } : undefined,
            estado: filtros?.estatus ? { id: parseInt(filtros?.estatus) } : undefined,
            categoriamaterial: filtros?.tipoMaterial ? { id: parseInt(filtros?.tipoMaterial) } : undefined,
        },
        orderBy: {
            fechacreacion: 'desc'
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
    });

    const recursosCant = await prisma.recursoeducativo.count({
        where:{
            nombre: filtros?.nombreMaterial ? { contains: filtros?.nombreMaterial, mode: 'insensitive' } : undefined,
            estado: filtros?.estatus ? { id: parseInt(filtros?.estatus) } : undefined,
            idcategoriamaterial: filtros?.tipoMaterialEducativo ? { id: parseInt(filtros?.tipoMaterialEducativo) } : undefined,
        }
    });

    return {materialesEducativos: materialEducativo, totalMateriales: recursosCant};
}







const obtenerRecursosEducativos = async () => {
    const recursos = await prisma.recursoEducativo.findMany();
    return recursos;
}

const obtenerRecursoEducativo = async (id) => {
    const recurso = await prisma.recursoEducativo.findFirst({
        where: {
            id: id
        }
    });
    return recurso;
}

const crearRecursoEducativo = async (recurso_data) => {
    const recurso = await prisma.recursoeducativo.create({data:
        {
            idusuario: recurso_data.idUsuario,
            idcategoriamaterial: recurso_data.idCategoriaMaterial,
            nombre: recurso_data.nombre,
            descripcion: recurso_data.descripcion,
            idestado: 1,
            urlmaterial: recurso_data.urlMaterial,
            fechacreacion: new Date(),
        }
    })
    return recurso;
}


const subirArchivo = async (foto_data) => {
    try {
        // Si el usuario ha proporcionado una imagen, sube la imagen
        
            const { signedUrl, success, error } = await uploadFile(
                foto_data.base64Image,
                foto_data.fileName,
                foto_data.mimeType
            );
            if (!success) {
                throw new Error(`Error subiendo la imagen: ${error.message}`);
            }

        return {
            success: true,
            message: 'Foto y/o archivo subido(s) correctamente.',
            urlMaterial: signedUrl,
        };
    } catch (error) {
        console.error('Error creando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


const editarRecursoEducativo = async (id, recurso_data) => {
    if (recurso_data.imageData){
        const subirMaterial = await subirArchivo(recurso_data.imageData);
        if (!subirMaterial.success) {
            throw new Error(`Error subiendo el archivo: ${subirMaterial.message}`);
        }
        recurso_data.urlmaterial = subirMaterial.urlMaterial;
    }

    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            idcategoriamaterial: parseInt(recurso_data.idCategoriaMaterial),
            nombre: recurso_data.nombre,
            descripcion: recurso_data.descripcion,
            urlmaterial: recurso_data.urlmaterial,
            fecha_modificacion: new Date(),
        }
    })
    return recurso;
}

const desactivarRecursoEducativo = async (id) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            idestado: 2
        }
    })
    return recurso;
}

const activarRecursoEducativo = async (id) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            idestado: 1
        }
    })
    return recurso;
}

const anadir_vista_a_material = async (id) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            vistas: {
                increment: 1
            }
        }
    }
)
    return recurso;
}

module.exports = {
    obtenerRecursosEducativos,
    obtenerRecursoEducativo,
    crearRecursoEducativo,


    editarRecursoEducativo,
    desactivarRecursoEducativo,
    activarRecursoEducativo,



    subirArchivo,
    obtenerRecursosEducativosActivos,
    getMaterialEducativoTableBO,
    getMaterialEducativoByID,

    anadir_vista_a_material
}
