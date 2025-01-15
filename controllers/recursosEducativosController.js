const recursosEducativosModel = require('../model/recursosEducativosModel');


const obtenerRecursosEducativosActivos = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        console.log("ENTRE A OBTENER LOS RECURSOS EDUCATIVOS")
        const recursos = await recursosEducativosModel.obtenerRecursosEducativosActivos(req.params.page, req.params.limit);
        res.status(200).json(recursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMaterialEducativoTableBO = async (req,res) => {
    /* #swagger.tags = ['Recursos Educativos']
         #swagger.description = 'Endpoint para obtener los Recursos Educativos en formato de tabla.'
         #swagger.parameters['obj'] = {
                    in: 'path',
                    description: 'Número de página y cantidad de registros por página.',
                    required: true,
                    schema: {
                         page: 1,
                         limit: 10
                  }
            }
    */
    try{
        const filtros = req.query;
        console.log("filtros",filtros);
        const recursosEducativos = await recursosEducativosModel.getMaterialEducativoTableBO(req.params.page,req.params.limit, filtros);
        res.status(200).json(recursosEducativos);
    }catch(error){
        console.error('Error al obtener los Recursos Educativos:', error);
        res.status(500).json({ message: error.message });
    }
}


const getMaterialEducativoByID = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const materialEducativo = await recursosEducativosModel.getMaterialEducativoByID(req.params.id);
        res.status(200).json(materialEducativo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}










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
        const { idUsuario, idCategoriaMaterial, nombre, descripcion, fileName, fileMimetype, filebase64, urlmaterial } = req.body;
        let urlMaterial = null;
        if (filebase64) {
            const subirMaterial = await recursosEducativosModel.subirArchivo({base64Image:filebase64, fileName:fileName, mimeType:fileMimetype});
            if (!subirMaterial.success) {
                throw new Error(`Error subiendo el archivo: ${subirMaterial.message}`);
            }
            urlMaterial = subirMaterial.urlMaterial;
        } else{
            urlMaterial = urlmaterial;
        }
        const recurso = await recursosEducativosModel.crearRecursoEducativo({idUsuario, idCategoriaMaterial, nombre, descripcion, urlMaterial});
        res.status(200).json(recurso);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const editarRecursoEducativo = async (req, res) => {
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
        const recurso = await recursosEducativosModel.editarRecursoEducativo(req.params.id, req.body);
        res.status(200).json(recurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const desactivarRecursoEducativo = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        const recurso = await recursosEducativosModel.desactivarRecursoEducativo(req.params.id);
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

const anadir_vista_a_material = async (req, res) => {
    // #swagger.tags = ['Recursos Educativos']
    try {
        await recursosEducativosModel.anadir_vista_a_material(req.params.id);
        res.status(200).json({mensaje: 'Vista añadida correctamente'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    obtenerRecursosEducativos,
    obtenerRecursoEducativo,
    crearRecursoEducativo,


    editarRecursoEducativo,
    desactivarRecursoEducativo,
    activarRecursoEducativo,


    obtenerRecursosEducativosActivos,
    getMaterialEducativoTableBO,
    getMaterialEducativoByID,
    anadir_vista_a_material
}