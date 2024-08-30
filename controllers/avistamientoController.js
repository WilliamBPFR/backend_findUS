const avistamientoModel = require('../model/avistamientoModel');

// Create post avistamiento
const createAvistamiento = async (req, res) => {
    /* #swagger.tags = ['Avistamiento']
       #swagger.description = 'Endpoint para registrar un avistamiento.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del avistamiento.',
              required: true,
              schema: {
                 idUsuario: 1,
                 idPublicacion: 1,
                 ubicacion: 'Bogotá',
                 fechaAvistamiento: '2021-01-01',
                 detalles: 'Lo vi en la noche',
                 verificado: true,
                 IdEstatus: 1,
                 fechaCreacion: '2021-01-01',
                 fotosavistamiento: 'foto.jpg',
              }
         }

    */
    try {
        const existe = await avistamientoModel.avistamientoExistente(req.body.idUsuario, req.body.idPublicacion);
        if(existe.existe){
            return res.status(400).json({ message: existe.message });
        }
        else{
            await avistamientoModel.crearAvistamiento(req.body);
            return res.status(200).json({ message: "Avistamiento creado exitosamente"});
        }
    } catch (error) {
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
    createAvistamiento,
    getAvistamiento,
    getAllAvistamientos,
    updateAvistamiento,
    deleteAvistamiento,
};