const desaparecidoModel = require('../model/desaparecidoModel');
const ubicacionService = require('../services/ubicacion');

// Create post desaparecido
const createDesaparecido = async (req, res) => {
    /* #swagger.tags = ['Desaparecido']
       #swagger.description = 'Endpoint para registrar un desaparecido.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del desaparecido.',
              required: true,
              schema: {
                    idusuario: 1,
                    nombredesaparecido: 'Juan Perez',
                    idtipodocumento: 1,
                    numerodocumentodesaparecido: '1234567890',
                    edad: 30,
                    telefono: '1234567890',
                    fechadesaparicion: '2021-01-01',
                    descripcionpersonadesaparecido: 'Persona desaparecida',
                    relacionusuariocondesaparecido: 'Padre',
                    informacioncontacto: '1234567890',
                    ubicaci_n_desaparicion_latitud: 0.0,
                    ubicaci_n_desaparicion_longitud: 0.0,
                    fechanacimiento: '1990-01-01',
                    fechacreacion: '2021-01-01',
                    idestado: 1,
                }
         }

    */
    try {
        const desaparecido = await desaparecidoModel.crearDesaparecido(req.body,req.user.id_user);
            if(!desaparecido.success){
                return res.status(400).json({ message: "Error al crear la publicación"});
                
            }
            return res.status(200).json({ message: "Desaparecido creado exitosamente", idpublicacion: desaparecido.id});

    } catch (error) { 
        return res.status(500).json({ message: error.message });

    }
    //     const existe = await desaparecidoModel.desaparecidoExistente(req.body.id_tipo_documento, req.body.documento_desaparecido, req.body.nombre_desaparecido);
    //     if(existe.existe){
    //         return res.status(400).json({ message: "" });
            
    //     }
    //     else{
    //         const desaparecido = await desaparecidoModel.crearDesaparecido(req.body);
    //         if(!desaparecido.success){
    //             return res.status(400).json({ message: "Error al crear la publicación"});
                
    //         }
    //         return res.status(200).json({ message: "Desaparecido creado exitosamente" });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: error.message });
        
    // }
}

// Get desaparecido by id
const getDesaparecido = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    try {
        const desaparecido = await desaparecidoModel.getDesaparecidoById(req.params.id);
        res.status(200).json(desaparecido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all desaparecidos
const getAllDesaparecidos = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    try {
        const desaparecidos = await desaparecidoModel.getAllDesaparecidos();
        res.status(200).json(desaparecidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update desaparecido by id
const updateDesaparecido = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    try {
        await desaparecidoModel.updateDesaparecido(req.params.id, req.body);
        res.status(200).json({ message: "Desaparecido actualizado exitosamente"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete desaparecido by id
const deleteDesaparecido = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    try {
        await desaparecidoModel.deleteDesaparecido(req.params.id);
        res.status(200).json({ message: "Desaparecido eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDesaparecidosActivosScrollGrande = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    console.log("entro a getDesaparecidosActivosScrollGrande");
    const page = parseInt(req.params.page, 10) || 1; // Si no hay página, usa 1 por defecto
    const limit = parseInt(req.params.limit, 10) || 10; // Si no hay limit, usa 10 por defecto
    try {
        const desaparecidos = await desaparecidoModel.getDesaparecidosActivosScrollGrande(page,limit);
        res.status(200).json(desaparecidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getDesaparecidosActivosScrollHorizontal = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    console.log("entro a getDesaparecidosActivosScrollHorizontal");
    try {
        const desaparecidos = await desaparecidoModel.getDesaparecidosActivosScrollHorizontal();
        res.status(200).json(desaparecidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getInfoDesaparecidoByID = async (req, res) => {
    // #swagger.tags = ['Desaparecido']
    try {
        const desaparecido = await desaparecidoModel.getInfoDesaparecidoByID(req.params.id);
        res.status(200).json(desaparecido);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const pruebaLocalidad = async (req, res) => {
    /*#swagger.tags = ['Desaparecido']
    #swagger.description = 'Endpoint para obtener la localidad de un desaparecido.'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Latitud y longitud del desaparecido.',
        required: true,
        schema: {
            latitud: -34.603722,
            longitud: -58.381592
        }
    }
    */
    
    try {
        const ubicacion = await ubicacionService.getLocalidadUbicacion(req.body.latitud,req.body.longitud);
        res.status(200).json(ubicacion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createDesaparecido,
    getDesaparecido,
    getAllDesaparecidos,
    updateDesaparecido,
    deleteDesaparecido,
    getDesaparecidosActivosScrollGrande,
    getDesaparecidosActivosScrollHorizontal,
    getInfoDesaparecidoByID,
    pruebaLocalidad
};
