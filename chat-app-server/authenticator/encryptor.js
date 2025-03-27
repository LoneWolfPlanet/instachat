const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error saving user:', error.message);
        throw new Error('Could not save user');
    }
};

const validatePassword = async (inputPassword, storedHashedPassword) => {
    return await bcrypt.compare(inputPassword, storedHashedPassword);
};

module.exports = { encryptPassword,validatePassword };