const desaparecidoModel = require('../model/desaparecidoModel');

// Create post desaparecido
const createDesaparecido = async (req, res) => {
    /* #swagger.tags = ['Desaparecido']
       #swagger.description = 'Endpoint para registrar un desaparecido.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del desaparecido.',
              required: true,
              schema: {
                 idUsuario: 1,
                 nombre: 'Juan',
                 idTipoDocumento: 1,
                 numeroDocumento: '1234567890',
                 edad: 20,
                 telefonoContacto: '1234567890',
                 fechaDesaparicion: '2021-01-01',
                 descripcionDesaparecido: 'Desapareció en la noche',
                 relacionDesaparecido: 'Hermano',
                 informacionContacto: 'Llamar a este número',
                 ubicacionDesaparicion: 'Bogotá',
                 verificado: true,
                 fechaNacimiento: '2000-01-01',
                 lugarDesaparicion: 'Bogotá',
                 idEstado: 1,
                 fechaCreacion: '2021-01-01',
              }
         }

    */
    try {
        const existe = await desaparecidoModel.desaparecidoExistente(numeroDocumento);
        if(existe.existe){
            return res.status(400).json({ message: existe.message });
        }
        else{
            await desaparecidoModel.crearDesaparecido(req.body);
            return res.status(200).json({ message: "Desaparecido creado exitosamente"});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
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

module.exports = {
    createDesaparecido,
    getDesaparecido,
    getAllDesaparecidos,
    updateDesaparecido,
    deleteDesaparecido
};
