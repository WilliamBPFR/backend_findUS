const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadPhoto, uploadFile } = require('../services/uploadFiles');


//Araay con todos los tipos de fotos
const tiposFotos = ["jpg","jpeg","png"]
const crearFotoPublicacion = async (foto_data) => {
    
    try {
        // const extensionFile = foto_data.fileName.split('.')[1];
        // Si el usuario ha proporcionado una imagen, sube la imagen
        if (foto_data.base64Image) {
            const { signedUrl, success, error } = await uploadPhoto(
                foto_data.base64Image,
                foto_data.fileName,
                foto_data.mimeType
            );
            if (!success) {
                throw new Error(`Error subiendo la imagen: ${error.message}`);
            }

            // Creando el registro en la tabla fotospublicacion con la URL de la imagen
            const nuevaFotoPublicacion = await prisma.fotospublicacion.create({
                data: {
                    urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                    idtipofotopublicacion: 1,
                    idpublicacion: foto_data.idpublicacion || null,
                    fechacreacion: new Date(),
                },
            });

            console.log('Foto subida:', nuevaFotoPublicacion);
        }

        // Si el usuario ha proporcionado un archivo, sube el archivo
        if (foto_data.base64File) {
            
            const { signedUrl, success, error } = await uploadFile(
                foto_data.base64File,
                foto_data.fileName,
                foto_data.mimeType,
                "Reportes policia"
            );
            if (!success) {
                throw new Error(`Error subiendo el archivo: ${error.message}`);
            }

            // Creando el registro en la tabla fotospublicacion con la URL del archivo
            const nuevaFotoPublicacion = await prisma.fotospublicacion.create({
                data: {
                    urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                    idtipofotopublicacion: 2,
                    idpublicacion: foto_data.idpublicacion || null,
                    fechacreacion: new Date(),
                },
            });

            console.log('Archivo subido:', nuevaFotoPublicacion);
        }

        return {
            success: true,
            message: 'Foto y/o archivo subido(s) correctamente.',
        };
    } catch (error) {
        console.error('Error creando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


const   updateFotoPublicacionBO = async (foto_data) => {
    console.log('foto_data:', foto_data);
    try{
        const { signedUrl, success, error } = await uploadFile(
            foto_data.base64Image,
            foto_data.fileName,
            foto_data.mimeType,
            "Fotos desaparecidos"
        );

        if (!success) {
            throw new Error(`Error subiendo el archivo: ${error.message}`);
        }

        // Actualizando el registro en la tabla fotospublicacion con la URL del archivo
        const fotoPublicacion = await prisma.fotospublicacion.update({
            where: {
                id: foto_data.id,
            },
            data: {
                urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                fechacreacion: new Date(),
            },
        });

        console.log('Foto actualizada:', fotoPublicacion);
        return {
            success: true,
            message: 'Foto actualizada correctamente.',
        };
    }
    catch (error) {
        console.error('Error actualizando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

const updateArchivoPoliciaPublicacionBO = async (foto_data) => {
    try{
        const { signedUrl, success, error } = await uploadFile(
            foto_data.base64File,
            foto_data.fileName,
            foto_data.mimeType,
            "Reportes policia"
        );

        if (!success) {
            throw new Error(`Error subiendo el archivo: ${error.message}`);
        }

        // Actualizando el registro en la tabla fotospublicacion con la URL del archivo
        const fotoPublicacion = await prisma.fotospublicacion.update({
            where: {
                id: foto_data.id,
            },
            data: {
                urlarchivo: signedUrl, // Usamos la URL generada (firmada)
                fechacreacion: new Date(),
            },
        });

        console.log('Archivo actualizado:', fotoPublicacion);
        return {
            success: true,
            message: 'Archivo actualizado correctamente.',
        };
    }
    catch (error) {
        console.error('Error actualizando foto publicacion:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}
module.exports = {
    crearFotoPublicacion,
    updateFotoPublicacionBO,
    updateArchivoPoliciaPublicacionBO
};
