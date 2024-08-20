// const userRepository = require('../repositories/userRepository');

const getUserById = async (id) => {
    // const user = await userRepository.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = {
    getUserById,
};