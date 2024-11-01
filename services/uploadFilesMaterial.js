const { supabaseAnon } = require('../services/supabaseService');
const { decode } = require('base64-arraybuffer');

// Tiempo en segundos para 1 año (365 días)
const oneYearInSeconds = 365 * 24 * 60 * 60; // 31,536,000 segundos

// Servicio para subir fotos
const uploadPhoto = async (fileBase64, fileName, mimeType) => {
    try {
        const filePath = 'Material Educativo/' + new Date().getTime() + fileName

        // Convertir base64 a ArrayBuffer usando 'base64-arraybuffer'
        const fileData = decode(fileBase64);

        // Subir la imagen al bucket
        const { data, error } = await supabaseAnon
            .storage
            .from('assets')
            .upload(filePath, fileData, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.log('Error subiendo la imagen al bucket:', error);
            return { success: false, error };
        }
        else{
            console.log('Imagen subida al bucket:', data);
        }

        // Generar la URL firmada válida por 1 año
        const { data: signedUrlData, error: signedUrlError } = await supabaseAnon
            .storage
            .from('assets')
            .createSignedUrl(filePath, oneYearInSeconds);

        if (signedUrlError) {
            console.log('Error generando URL firmada:', signedUrlError);
            return { success: false, error: signedUrlError };
        }
        else{
            console.log('URL firmada generada:', signedUrlData);
        }

        // Devolver la URL firmada
        const signedUrl = signedUrlData.signedUrl;
        return { signedUrl, success: true };
    } catch (error) {
        console.error('Error al subir la foto:', error.message);
        return { success: false, message: error.message };
    }
};

// Servicio para subir archivos
const uploadFile = async (fileBase64, fileName, mimeType) => {
    try {
        const filePath = 'Material Educativo/' + new Date().getTime() + fileName ;

        // Convertir base64 a ArrayBuffer
        const fileData = decode(fileBase64);

        // Subir el archivo al bucket
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
        else{
            console.log('Archivo subido al bucket:', data);
        }

        // Generar la URL firmada válida por 1 año
        const { data: signedUrlData, error: signedUrlError } = await supabaseAnon
            .storage
            .from('assets')
            .createSignedUrl(filePath, oneYearInSeconds);

        if (signedUrlError) {
            return { success: false, error: signedUrlError };
        }
        else{
            console.log('URL firmada generada:', signedUrlData);
        }

        // Devolver la URL firmada
        const signedUrl = signedUrlData.signedUrl;
        return { signedUrl, success: true };
    } catch (error) {
        console.error('Error al subir el archivo:', error.message);
        return { success: false, message: error.message };
    }
};

module.exports = {
    uploadPhoto,
    uploadFile,
};
