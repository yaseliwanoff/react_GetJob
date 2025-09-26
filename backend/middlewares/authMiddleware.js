// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require("../models/User");

// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// Protect routes - JWT authentication
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, no token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database using Supabase
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    message: 'Not authorized, user not found'
                });
            }

            req.user = user;
            next();

        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            message: 'Server error in authentication'
        });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, no user'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize,
    generateToken
};
