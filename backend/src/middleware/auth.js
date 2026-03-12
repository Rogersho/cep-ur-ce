const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'system_admin' || req.user.role === 'cep_admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

const systemAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'system_admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as system admin' });
    }
};

module.exports = { protect, adminOnly, systemAdminOnly };
