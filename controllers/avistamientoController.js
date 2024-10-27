const avistamientoModel = require('../model/avistamientoModel');

// Create post avistamiento
const crearAvistamiento = async (req, res) => {
    /* #swagger.tags = ['Avistamiento']
       #swagger.description = 'Endpoint para registrar un avistamiento.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del avistamiento.',
              required: true,
              schema: {
                  idusuario: 1,
                  idpublicacion: 1,
                  ubicacion_desaparicion_latitud: "10.333",
                  ubicacion_desaparicion_longitud: "11.333",
                  fechahora: 1/1/2021,
                  detalles: "KLKKKKK",
              }
         }

    */
    try {
        const avistamiento = await avistamientoModel.crearAvistamiento(req.body,34);
        if(!avistamiento){
            return res.status(400).json({ message: "Error al crear el avistamiento"});
        }
        return res.status(200).json({ message: "Avistamiento creado exitosamente", idAvistamiento: avistamiento.id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const crearFotoAvistamiento = async (req, res) => {
    /* #swagger.tags = ['Avistamiento']
       #swagger.description = 'Endpoint para registrar una foto de avistamiento.'
    */
    try {
        const fotoAvistamiento = await avistamientoModel.crearFotoAvistamiento(req.body);
        if(!fotoAvistamiento.success){
            return res.status(400).json({ message: "Error al crear la foto del avistamiento"});
        }
        return res.status(200).json({ message: "Foto del avistamiento creada exitosamente"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Get avistamiento by id
const getAvistamiento = async (req, res) => {
    // #swagger.tags = ['Avistamiento']
    try {
        const avistamiento = await avistamientoModel.getAvistamientoById(req.params.id);
        res.status(200).json(avistamiento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all avistamientos
const getAllAvistamientos = async (req, res) => {
    // #swagger.tags = ['Avistamiento']
    try {
        const avistamientos = await avistamientoModel.getAllAvistamientos();
        res.status(200).json(avistamientos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update avistamiento by id
const updateAvistamiento = async (req, res) => {
    // #swagger.tags = ['Avistamiento']
    try {
        await avistamientoModel.updateAvistamiento(req.params.id, req.body);
        res.status(200).json({ message: "Avistamiento actualizado exitosamente"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete avistamiento by id
const deleteAvistamiento = async (req, res) => {
    // #swagger.tags = ['Avistamiento']
    try {
        await avistamientoModel.deleteAvistamiento(req.params.id);
        res.status(200).json({ message: "Avistamiento eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    crearAvistamiento,
    getAvistamiento,
    getAllAvistamientos,
    updateAvistamiento,
    deleteAvistamiento,
    crearFotoAvistamiento,
};