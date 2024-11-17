const { supabaseAnon } = require('../services/supabaseService');

// Servicio para guardar tokens de notificaciones
const saveNotificationToken = async (userId, token) => {
    const { data, error } = await supabaseAnon
        .from('notification_tokens')
        .upsert({ user_id: userId, token: token });
    
    if (error) {
        console.error('Error saving notification token:', error.message);
        return false;
    }
    
    return true;
}

