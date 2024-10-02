const {supabaseAnon} = require('../services/supabaseService');


const uploadPhoto = async (file) => {
    try {
        const filePath = 'Fotos desaparecidos/' + file.name;
        const {data, error} = await supabaseAnon
            .storage
            .from('assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return { success: false, error };
        }

        // obtener la URL de la imagen subida
        const {url, error: urlError} = supabaseAnon.storage
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
}

const uploadfile = async (file) => {
    try {
        const filePath = 'Reportes policía/' + file.name;
        const {data, error} = await supabaseAnon
            .storage
            .from('assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return { success: false, error };
        }

        // obtener la URL de la documento subida
        const {url, error: urlError} = supabaseAnon.storage
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
}

module.exports = { uploadPhoto, uploadfile };