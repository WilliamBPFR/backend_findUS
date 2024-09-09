const { PrismaClient,  } = require('@prisma/client')


const prisma = new PrismaClient()

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
            idUsuario: recurso_data.idUsuario,
            idCategoriaMaterial: recurso_data.idCategoriaMaterial,
            nombre: recurso_data.nombre,
            descripcion: recurso_data.descripcion,
            idEstado: 1,
            urlMaterial: recurso_data.urlMaterial,
            fechaCreacion: new Date(),
        }
    })
    return recurso;
}

const actualizarRecursoEducativo = async (id, recurso_data) => {
    const recurso = await prisma.recursoeducativo.update({
        where: {
            id: id
        },
        data: {
            idUsuario: recurso_data.idUsuario,
            idCategoriaMaterial: recurso_data.idCategoriaMaterial,
            nombre: recurso_data.nombre,
            descripcion: recurso_data.descripcion,
            idEstado: recurso_data.idEstado,
            urlMaterial: recurso_data.urlMaterial,
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
    activarRecursoEducativo
}
