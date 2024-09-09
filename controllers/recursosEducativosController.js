const recursosEducativosModel = require('../model/recursosEducativosModel');

const obtenerRecursosEducativos = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const recursos = await recursosEducativosModel.obtenerRecursosEducativos();
        res.status(200).json(recursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const obtenerRecursoEducativo = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const recurso = await recursosEducativosModel.obtenerRecursoEducativo(req.params.id);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const crearRecursoEducativo = async (req, res) => {
    /* #swagger.tags = ['Recursos Educativos']
       #swagger.description = 'Endpoint para crear un recurso educativo.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del recurso educativo.',
              required: true,
              schema: {
                 idUsuario: 1,
                 idCategoriaMaterial: 1,
                 nombre: 'Recurso 1',
                 descripcion: 'Descripción del recurso 1',
                 urlMaterial: 'https://www.ejemplo.com/recurso1.pdf',
              }
         }

    */
    try {
        const recurso = await recursosEducativosModel.crearRecursoEducativo(req.body);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const actualizarRecursoEducativo = async (req, res) => {
    /* #swagger.tags = ['Recursos Educativos']
       #swagger.description = 'Endpoint para actualizar un recurso educativo.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del recurso educativo.',
              required: true,
              schema: {
                 idUsuario: 1,
                 idCategoriaMaterial: 1,
                 nombre: 'Recurso 1',
                 descripcion: 'Descripción del recurso 1',
                 urlMaterial: 'https://www.ejemplo.com/recurso1.pdf',
              }
         }

    */
    try {
        const recurso = await recursosEducativosModel.actualizarRecursoEducativo(req.params.id, req.body);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const desactivarRecursoEducativo = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const recurso = await recursosEducativosModel.eliminarRecursoEducativo(req.params.id);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const activarRecursoEducativo = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const recurso = await recursosEducativosModel.activarRecursoEducativo(req.params.id);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    obtenerRecursosEducativos,
    obtenerRecursoEducativo,
    crearRecursoEducativo,
    actualizarRecursoEducativo,
    desactivarRecursoEducativo,
    activarRecursoEducativo
}