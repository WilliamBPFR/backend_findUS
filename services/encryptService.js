const bcrypt = require('bcrypt');

// Función para encriptar la contraseña
const hashPassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

// Función para verificar la contraseña
const verifyPassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};

function generateVerificationCode(number_of_digits) {
    return Math.floor((Math.pow(10,number_of_digits-1)) + Math.random() * (9*(Math.pow(10,number_of_digits-1)))).toString();
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateVerificationCode
};