const jwt = require('jsonwebtoken');

const secretKey = 'secretsecretsecretsecretsecretsecret';;
const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username 
    };

    const options = {
        expiresIn: '1h' 
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
};

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }
    try {
        const user = jwt.verify(token, secretKey);
        req.user = user; 
        next(); 
    } catch (error) {
        return res.status(403).send({ message: 'Invalid token.' });
    }
};

const verifyToken = (token) => {
    if (!token) {
        return false;
    }
    try {
        const user = jwt.verify(token, secretKey);
        return true; 
    } catch (error) {
        return false;
    }
};

module.exports = {generateToken ,authenticateToken ,verifyToken };