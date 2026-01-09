import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @desc    Verify JWT token and attach user to request
 */
const verifyUser = async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied: No Token Provided" 
            });
        }

        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied: Invalid Token" 
            });
        }

        // 3. Find User in DB (optional but recommended for security)
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // 4. Attach user and role to request object
        req.user = user;
        next(); // Move to the next middleware or controller

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ 
            success: false, 
            message: "Session expired or invalid token" 
        });
    }
};

/**
 * @desc    Role-based authorization middleware
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        // Check if the user's role is permitted
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access Denied: ${req.user.role} role is not authorized` 
            });
        }
        next();
    };
};

export { verifyUser, checkRole };