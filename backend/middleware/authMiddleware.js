import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @desc    Verify JWT token and attach user to request
 */
const verifyUser = async (req, res, next) => {
    try {
        // Get token from header
        const [scheme, token] = (req.headers.authorization || "").split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied: No Token Provided" 
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
        
        if (decoded.type !== "access" || !decoded.sub) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied: Invalid Token" 
            });
        }

        // Find User in DB 
        const user = await User.findById(decoded.sub).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Attach user and role to request object
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

const checkAssignedWarehouse = (req, res, next) => {
    const assignedWarehouse = req.user.assignedWarehouse?.toString();
    if (req.user.role !== "warehouse" || !assignedWarehouse) {
        return res.status(403).json({ success: false, message: "No warehouse is assigned to this account" });
    }
    if (req.params.id && req.params.id !== assignedWarehouse) {
        return res.status(403).json({ success: false, message: "You can only access your assigned warehouse" });
    }
    next();
};

export { verifyUser, checkRole, checkAssignedWarehouse };