const { PrismaClient,  } = require('@prisma/client');
const { uploadPhoto, uploadFile } = require('../services/uploadFilesMaterial');


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
        
            const { signedUrl, success, error } = await uploadPhoto(
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


const actualizarRecursoEducativo = async (id, recurso_data) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: id
        },
        data: {
            idusuario: recurso_data.idUsuario,
            idcategoriamaterial: recurso_data.idCategoriaMaterial,
            nombre: recurso_data.nombre,
            descripcion: recurso_data.descripcion,
            idestado: 1,
            urlmaterial: recurso_data.urlMaterial,
        }
    })
    return recurso;
}

const desactivarRecursoEducativo = async (id) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: id
        },
        data: {
            idEstado: 2
        }
    })
    return recurso;
}

const activarRecursoEducativo = async (id) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: id
        },
        data: {
            idEstado: 1
        }
    })
    return recurso;
}

module.exports = {
    obtenerRecursosEducativos,
    obtenerRecursoEducativo,
    crearRecursoEducativo,
    actualizarRecursoEducativo,
    desactivarRecursoEducativo,
    activarRecursoEducativo,
    subirArchivo,
    obtenerRecursosEducativosActivos
}
