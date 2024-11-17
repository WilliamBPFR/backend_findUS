const fotoPublicacionModel = require('../model/fotosPublicacionModel');

// Create FotoPublicacion
const createFotoPublicacion = async (req, res) => {
    /* #swagger.tags = ['FotoPublicacion']
       #swagger.description = 'Endpoint para crear una foto de publicación.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información de la foto de la publicación.',
              required: true,
              schema: {
                    idtipofotopublicacion: 1,
                    idpublicacion: 1,
                    base64Image: 'data:image/jpeg;base64,...',
                    base64File: 'data:application/pdf;base64,...',
                    fileName: 'imagen.jpg',
                    mimeType: 'image/jpeg',
                }
         }
    */
    try {
        const fotoPublicacion = await fotoPublicacionModel.crearFotoPublicacion(req.body);

        if (!fotoPublicacion.success) {
            return res.status(400).json({ message: "Error al crear la foto de la publicación" });
        }
        return res.status(200).json({ message: "Foto de publicación creada exitosamente", data: fotoPublicacion.data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateFotoPublicacionBO = async (req, res) => {
    /* #swagger.tags = ['FotoPublicacion']
       #swagger.description = 'Endpoint para actualizar una foto de publicación.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información de la foto de la publicación.',
              required: true,
              schema: {
                    idtipofotopublicacion: 1,
                    idpublicacion: 1,
                    base64Image: 'data:image/jpeg;base64,...',
                    base64File: 'data:application/pdf;base64,...',
                    fileName: 'imagen.jpg',
                    mimeType: 'image/jpeg',
                }
         }
    */
    try {
        const fotoPublicacion = await fotoPublicacionModel.updateFotoPublicacionBO(req.body);

        if (!fotoPublicacion.success) {
            return res.status(400).json({ message: "Error al crear la foto de la publicación" });
        }
        return res.status(200).json({ message: "Foto de publicación creada exitosamente", data: fotoPublicacion.data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateArchivoPoliciaPublicacionBO = async (req, res) => {
    /* #swagger.tags = ['FotoPublicacion']
       #swagger.description = 'Endpoint para actualizar un archivo de publicación.'
       #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Información del archivo de la publicación.',
              required: true,
              schema: {
                    idtipofotopublicacion: 2,
                    idpublicacion: 1,
                    base64Image: 'data:image/jpeg;base64,...',
                    base64File: 'data:application/pdf;base64,...',
                    fileName: 'imagen.jpg',
                    mimeType: 'image/jpeg',
                }
         }
    */
    try {
        const archivoPublicacion = await fotoPublicacionModel.updateArchivoPoliciaPublicacionBO(req.body);

        if (!archivoPublicacion.success) {
            return res.status(400).json({ message: "Error al crear la foto de la publicación" });
        }
        return res.status(200).json({ message: "Foto de publicación creada exitosamente", data: archivoPublicacion.data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createFotoPublicacion,
    updateFotoPublicacionBO,
    updateArchivoPoliciaPublicacionBO
};