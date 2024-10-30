const catalogosModel = require('../model/catalogosModel');


// Funciones para CRUD tipo de documento
const obtenerTipoDocumento = async (req, res) => {
    // #swagger.tags = ['Tipo de Documento']
    try {
        const tipo_documento = await catalogosModel.obtenerTipoDocumento();
        res.status(200).json(tipo_documento);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearTipoDocumento = async (req, res) => {
    /* #swagger.tags = ['Tipo de Documento']
       #swagger.description = 'Endpoint para crear un Tipo de Documento.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del recurso educativo.',
              required: true,
              schema: {
                    nombreTipoDocumento: 'Cédula de Identidad',
              }
         }
    */
    try {
        const tipo_documento = await catalogosModel.crearTipoDocumento(req.body);
        res.status(200).json(tipo_documento);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const actualizarTipoDocumento = async (req, res) => {
    /* #swagger.tags = ['Tipo de Documento']
         #swagger.description = 'Endpoint para actualizar un Tipo de Documento.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información del recurso educativo.',
                  required: true,
                  schema: {
                      nombreTipoDocumento: 'Cédula de Identidad',
                  }
            }
     */
    try {
        const tipo_documento = await catalogosModel.actualizarTipoDocumento(req.params.id, req.body);
        res.status(200).json(tipo_documento);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//Funciones de CRUD para Roles
const obtenerRoles = async (req, res) => {
    // #swagger.tags = ['Roles']
    try {
        const roles = await catalogosModel.obtenerRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearRol = async (req, res) => {
    /* #swagger.tags = ['Roles']
       #swagger.description = 'Endpoint para crear un Rol.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del rol.',
              required: true,
              schema: {
                    nombreRol: 'Administrador',
              }
         }
    */
    try {
        const rol = await catalogosModel.crearRol(req.body);
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const actualizarRol = async (req, res) => {
    /* #swagger.tags = ['Roles']
         #swagger.description = 'Endpoint para actualizar un Rol.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información del rol.',
                  required: true,
                  schema: {
                      nombreRol: 'Administrador',
                  }
            }
     */
    try {
        const rol = await catalogosModel.actualizarRol(req.params.id, req.body);
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//Funciones de CRUD CategoriaMaterial
const obtenerCategoriaMaterial = async (req, res) => {
    // #swagger.tags = ['Categoria Material']
    try {
        const categoriaMaterial = await catalogosModel.obtenerCategoriaMaterial();
        res.status(200).json(categoriaMaterial);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearCategoriaMaterial = async (req, res) => {
    /* #swagger.tags = ['Categoria Material']
       #swagger.description = 'Endpoint para crear una Categoria Material.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información de la categoria material.',
              required: true,
              schema: {
                    nombreCategoriaMaterial: 'Libros',
              }
         }
    */
    try {
        const categoriaMaterial = await catalogosModel.crearCategoriaMaterial(req.body);
        res.status(200).json(categoriaMaterial);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const actualizarCategoriaMaterial = async (req, res) => {
    /* #swagger.tags = ['Categoria Material']
         #swagger.description = 'Endpoint para actualizar una Categoria Material.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información de la categoria material.',
                  required: true,
                  schema: {
                      nombreCategoriaMaterial: 'Libros',
                  }
            }
     */
    try {
        const categoriaMaterial = await catalogosModel.actualizarCategoriaMaterial(req.params.id, req.body);
        res.status(200).json(categoriaMaterial);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//Funciones de CRUD para TipoFotoPublicacion
const obtenerTipoFotoPublicacion = async (req, res) => {
    // #swagger.tags = ['Tipo Foto Publicacion']
    try {
        const tipoFotoPublicacion = await catalogosModel.obtenerTipoFotoPublicacion();
        res.status(200).json(tipoFotoPublicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearTipoFotoPublicacion = async (req, res) => {
    /* #swagger.tags = ['Tipo Foto Publicacion']
       #swagger.description = 'Endpoint para crear un Tipo Foto Publicacion.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del tipo foto publicacion.',
              required: true,
              schema: {
                    nombreTipoFotoPublicacion: 'Portada',
              }
         }
    */
    try {
        const tipoFotoPublicacion = await catalogosModel.crearTipoFotoPublicacion(req.body);
        res.status(200).json(tipoFotoPublicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const actualizarTipoFotoPublicacion = async (req, res) => {
    /* #swagger.tags = ['Tipo Foto Publicacion']
         #swagger.description = 'Endpoint para actualizar un Tipo Foto Publicacion.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información del tipo foto publicacion.',
                  required: true,
                  schema: {
                      nombreTipoFotoPublicacion: 'Portada',
                  }
            }
     */
    try {
        const tipoFotoPublicacion = await catalogosModel.actualizarTipoFotoPublicacion(req.params.id, req.body);
        res.status(200).json(tipoFotoPublicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//Funciones de CRUD para IdiomaAplicacion
const obtenerIdiomaAplicacion = async (req, res) => {
    // #swagger.tags = ['Idioma Aplicacion']
    try {
        const idiomaAplicacion = await catalogosModel.obtenerIdiomaAplicacion();
        res.status(200).json(idiomaAplicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearIdiomaAplicacion = async (req, res) => {
    /* #swagger.tags = ['Idioma Aplicacion']
       #swagger.description = 'Endpoint para crear un Idioma Aplicacion.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del idioma aplicacion.',
              required: true,
              schema: {
                    nombreIdioma: 'Español',
              }
         }
    */
    try {
        const idiomaAplicacion = await catalogosModel.crearIdiomaAplicacion(req.body);
        res.status(200).json(idiomaAplicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const actualizarIdiomaAplicacion = async (req, res) => {
    /* #swagger.tags = ['Idioma Aplicacion']
         #swagger.description = 'Endpoint para actualizar un Idioma Aplicacion.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información del idioma aplicacion.',
                  required: true,
                  schema: {
                      nombreIdioma: 'Español',
                  }
            }
     */
    try {
        const idiomaAplicacion = await catalogosModel.actualizarIdiomaAplicacion(req.params.id, req.body);
        res.status(200).json(idiomaAplicacion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//Funciones de CRUD para Estado
const obtenerEstado = async (req, res) => {
    // #swagger.tags = ['Estado']
    try {
        const estado = await catalogosModel.obtenerEstado();
        res.status(200).json(estado);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const crearEstado = async (req, res) => {
    /* #swagger.tags = ['Estado']
       #swagger.description = 'Endpoint para crear un Estado.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del estado.',
              required: true,
              schema: {
                    nombreEstado: 'Activo',
                    tipoEstado: 'Activo'
              }
         }
    */
    try {
        const estado = await catalogosModel.crearEstado(req.body);
        res.status(200).json(estado);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


const actualizarEstado = async (req, res) => {
    /* #swagger.tags = ['Estado']
         #swagger.description = 'Endpoint para actualizar un Estado.'
         #swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Información del estado.',
                  required: true,
                  schema: {
                      nombreEstado: 'Activo',
                      tipoEstado: 'Activo'
                  }
            }
     */
    try {
        const estado = await catalogosModel.actualizarEstado(req.params.id, req.body);
        res.status(200).json(estado);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getEstadosPublicaciones = async (req, res) => {
    // #swagger.tags = ['Estado']
    try {
        const estados = await catalogosModel.getEstadosPublicaciones();
        res.status(200).json(estados);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
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
    getEstadosPublicaciones
}