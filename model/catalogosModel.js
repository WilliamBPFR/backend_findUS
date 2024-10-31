const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

// Funciones para CRUD tipo de documento
const obtenerTipoDocumento = async () => {
    return await prisma.tipodocumento.findMany();
}

const crearTipoDocumento = async (tipo_documento) => {
    return await prisma.tipodocumento.create({data:{
        nombreTipoDocumento: tipo_documento.nombreTipoDocumento
    }});
}

const actualizarTipoDocumento = async (id, tipo_documento) => {
    return await prisma.tipodocumento.update({
        where: {
            id: id
        },
        data: {
            nombreTipoDocumento: tipo_documento.nombreTipoDocumento
        }
    });
}


//Funciones de CRUD para Roles
const obtenerRoles = async () => {
    return await prisma.rol.findMany();
}

const crearRol = async (rol) => {
    return await prisma.rol.create({data:{
        nombreRol: rol.nombreRol
    }});
}

const actualizarRol = async (id, rol) => {
    return await prisma.rol.update({
        where: {
            id: id
        },
        data: {
            nombreRol: rol.nombreRol
        }
    });
}


//Funciones de CRUD CategoriaMaterial
const obtenerCategoriaMaterial = async () => {
    return await prisma.categoriamaterial.findMany();
}

const crearCategoriaMaterial = async (categoriaMaterial) => {
    return await prisma.categoriamaterial.create({data:{
        nombreCategoriaMaterial: categoriaMaterial.nombreCategoriaMaterial
    }});
}

const actualizarCategoriaMaterial = async (id, categoriaMaterial) => {
    return await prisma.categoriamaterial.update({
        where: {
            id: id
        },
        data: {
            nombreCategoriaMaterial: categoriaMaterial.nombreCategoriaMaterial
        }
    });
}


//Funciones de CRUD para TipoFotoPublicacion
const obtenerTipoFotoPublicacion = async () => {
    return await prisma.tipofotopublicacion.findMany();
}

const crearTipoFotoPublicacion = async (tipoFotoPublicacion) => {
    return await prisma.tipofotopublicacion.create({data:{
        nombreTipoFotoPublicacion: tipoFotoPublicacion.nombreTipoFotoPublicacion
    }});
}

const actualizarTipoFotoPublicacion = async (id, tipoFotoPublicacion) => {
    return await prisma.tipofotopublicacion.update({
        where: {
            id: id
        },
        data: {
            nombreTipoFotoPublicacion: tipoFotoPublicacion.nombreTipoFotoPublicacion
        }
    });
}


//Funciones de CRUD para IdiomaAplicacion
const obtenerIdiomaAplicacion = async () => {
    return await prisma.idiomaaplicacion.findMany();
}

const crearIdiomaAplicacion = async (idiomaAplicacion) => {
    return await prisma.idiomaaplicacion.create({data:{
        nombreIdioma: idiomaAplicacion.nombreIdioma
    }});
}

const actualizarIdiomaAplicacion = async (id, idiomaAplicacion) => {
    return await prisma.idiomaaplicacion.update({
        where: {
            id: id
        },
        data: {
            nombreIdioma: idiomaAplicacion.nombreIdioma
        }
    });
}



//Funciones de CRUD para Estado
const obtenerEstado = async () => {
    return await prisma.estado.findMany();
}

const crearEstado = async (estado) => {
    return await prisma.estado.create({data:{
        nombreEstado: estado.nombreEstado,
        tipoEstado: estado.tipoEstado
    }});
}

const actualizarEstado = async (id, estado) => {
    return await prisma.estado.update({
        where: {
            id: id
        },
        data: {
            nombreEstado: estado.nombreEstado,
            tipoEstado: estado.tipoEstado
        }
    });
}


const getEstadosPublicaciones = async () => {
    return await prisma.estado.findMany({
        select: {
            id: true,
            nombreestado: true
        },
        where: {
            OR: [
                {
                    tipoestado: "General"
                },
                {
                    tipoestado: "Publicacion"
                }
            ]
        }
    });
}

const getEstadosGeneral = async () => {
    return await prisma.estado.findMany({
        select: {
            id: true,
            nombreestado: true
        },
        where: {
            tipoestado: "General"
        }
    });
}

module.exports = {
    obtenerTipoDocumento,
    crearTipoDocumento,
    actualizarTipoDocumento,
    obtenerRoles,
    crearRol,
    actualizarRol,
    obtenerCategoriaMaterial,
    crearCategoriaMaterial,
    actualizarCategoriaMaterial,
    obtenerTipoFotoPublicacion,
    crearTipoFotoPublicacion,
    actualizarTipoFotoPublicacion,
    obtenerIdiomaAplicacion,
    crearIdiomaAplicacion,
    actualizarIdiomaAplicacion,
    obtenerEstado,
    crearEstado,
    actualizarEstado,
    getEstadosPublicaciones,
    getEstadosGeneral
}