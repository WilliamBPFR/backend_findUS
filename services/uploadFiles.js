const {supabaseAnon} = require('../services/supabaseService');
import { decode } from 'base64-arraybuffer';

const uploadPhoto = async (fileBase64, fileName, mimeType) => {
    try {
        const filePath = 'Fotos desaparecidos/' + fileName;

        // Convertir base64 a ArrayBuffer usando 'base64-arraybuffer'
        const fileData = decode(fileBase64);

        const { data, error } = await supabaseAnon
            .storage
            .from('assets')
            .upload(filePath, fileData, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return { success: false, error };
        }

        // Obtener la URL de la imagen subida
        const { url, error: urlError } = supabaseAnon
            .storage
            .from('assets')
            .getPublicUrl(filePath);

        if (urlError) {
            return { success: false, error: urlError };
        }
        return { url, success: true };
    } catch (error) {
        console.error('Error al subir la foto:', error.message);
        return { success: false, message: error.message };
    }
};

const uploadFile = async (fileBase64, fileName, mimeType) => {
    try {
        const filePath = 'Reportes policía/' + fileName;

        // Convertir base64 a ArrayBuffer
        const fileData = decode(fileBase64);

        const { data, error } = await supabaseAnon
            .storage
            .from('assets')
            .upload(filePath, fileData, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return { success: false, error };
        }

        // Obtener la URL del archivo subido
        const { url, error: urlError } = supabaseAnon
            .storage
            .from('assets')
            .getPublicUrl(filePath);

        if (urlError) {
            return { success: false, error: urlError };
        }
        return { url, success: true };
    } catch (error) {
        console.error('Error al subir el reporte de policía:', error.message);
        return { success: false, message: error.message };
    }
};

module.exports = {
    uploadPhoto,
    uploadFile,
};