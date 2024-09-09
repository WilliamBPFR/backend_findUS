const express = require('express');
const { supabaseAnon } = require('../services/supabaseService');

const SUPABASE_JWT_SECRET = process.env.JWT_SECRET; 

// Middleware de autenticación
const authenticate = async (req, res, next) => {
    // Extraer el token del encabezado Authorization con el prefijo "Bearer"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or incorrect format' });
    }

    // Eliminar el prefijo "Bearer " para obtener solo el token
    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabaseAnon.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = data.user; // Agrega el usuario al objeto de solicitud
        next(); // Continua al siguiente middleware o ruta
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authenticate };
