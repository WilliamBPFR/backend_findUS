const { supabaseAnon } = require('../services/supabaseService');
const { decode } = require('base64-arraybuffer');

// Tiempo en segundos para 1 año (365 días)
const oneYearInSeconds = 365 * 24 * 60 * 60; // 31,536,000 segundos

// Mapa de caracteres a reemplazar
const replaceMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'ñ': 'n', 'Ñ': 'N',
    // Puedes agregar más caracteres según sea necesario
};

// Función para sanear el nombre del archivo
const sanitizeFileName = (fileName) => {
    // Reemplaza caracteres acentuados
    let sanitized = fileName.replace(/[áéíóúÁÉÍÓÚñÑ]/g, (match) => replaceMap[match]);
    // Reemplaza caracteres no permitidos
    sanitized = sanitized.replace(/[\/\\\?*\:<>"|]/g, "_"); // Reemplaza caracteres no permitidos

    // Reemplaza espacios con _
    sanitized = sanitized.replace(/ /g, "_");
    return sanitized;
};

// Servicio para subir fotos
const uploadPhoto = async (fileBase64, fileName, mimeType,carpeta) => {
    try {
        // Sanear el nombre del archivo
        fileName = sanitizeFileName(fileName);
        const filePath = 'Fotos desaparecidos/' + fileName

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
const uploadFile = async (fileBase64, fileName, mimeType,carpeta) => {
    try {
        let filename = sanitizeFileName(fileName);

        const filePath = `${carpeta}/` + new Date().getTime() + filename ;
        // Sanear el nombre del archivo
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
            console.log('Error subiendo el archivo al bucket:', error);
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
        console.error('Error al subir el reporte de policía:', error.message);
        return { success: false, message: error.message };
    }
};

module.exports = {
    uploadPhoto,
    uploadFile,
};
