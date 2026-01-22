const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Role based access control (middleware factory)
const authorize = (...roles) => {
    return (req, res, next) => {
        // This is tricky because roles are workspace-specific in my model.
        // For simple project-level roles (if we assume a user is in a board context)
        // we might need to check the specific role in that workspace.

        // For now, let's just check if the user exists. 
        // We'll implement workspace-specific role checks inside controllers or specialized middleware.
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    };
};

module.exports = { protect, authorize };
