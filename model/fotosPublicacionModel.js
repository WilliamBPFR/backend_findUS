const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadPhoto, uploadFile } = require('../services/uploadFiles');

const crearFotoPublicacion = async (foto_data) => {
    try {
        let urlarchivo = null;

        // Si el usuario ha proporcionado una imagen, sube la imagen
        if (foto_data.base64Image) {
            const { url, success, error } = await uploadPhoto(
                foto_data.base64Image,
                foto_data.fileName,
                foto_data.mimeType
            );
            if (!success) {
                throw new Error(`Error subiendo la imagen: ${error.message}`);
            }
            urlarchivo = url; // Guardamos la URL de la imagen
        }

        // Si el usuario ha proporcionado un archivo, sube el archivo
        if (foto_data.base64File) {
            const { url, success, error } = await uploadFile(
                foto_data.base64File,
                foto_data.fileName,
                foto_data.mimeType
            );
            if (!success) {
                throw new Error(`Error subiendo el archivo: ${error.message}`);
            }
            urlarchivo = url; // Guardamos la URL del archivo
        }

        // Creando el registro en la tabla fotospublicacion
        const nuevaFotoPublicacion = await prisma.fotospublicacion.create({
            data: {
                urlarchivo, // Usamos la URL generada
                idtipofotopublicacion: foto_data.idtipofotopublicacion || null,
                idpublicacion: foto_data.idpublicacion || null,
                fechacreacion: new Date(),
            },
        });

        return {
            success: true,
            data: nuevaFotoPublicacion,
        };
    } catch (error) {
        console.error('Error creando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports = {
    crearFotoPublicacion,
};
