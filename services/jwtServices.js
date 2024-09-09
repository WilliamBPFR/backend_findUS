const jwt = require('jsonwebtoken');

function generateToken(payload, device, remember = false) {
    if(device === 'mobile') {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
    else{
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: remember ? '1h' : '24h' });
    }
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function destroyToken(token) {
    return jwt.destroy(token);
}



module.exports = {
    generateToken,
    verifyToken,
    destroyToken
};