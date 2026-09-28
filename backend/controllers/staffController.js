import User from "../models/User.js";
import bcrypt from "bcrypt";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Warehouse from "../models/Warehouse.js";

const personalSettingsFields = [
    "name", "phone", "address", "img", "works", "gender", "language",
    "secondaryEmail", "businessName", "currency", "timezone",
    "emailNotifications", "lowStockAlerts", "pushNotifications"
];

export const updateMySettings = async (req, res) => {
    try {
        const updateData = Object.fromEntries(
            personalSettingsFields
                .filter(field => Object.hasOwn(req.body, field))
                .map(field => [field, req.body[field]])
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Settings saved", member: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const changeOwnPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Enter your current password and a new password of at least 8 characters" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const passwordMatches = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatches) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await User.updateOne({ _id: req.user._id }, { $set: { password: passwordHash } });

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const exportInventoryData = async (req, res) => {
    try {
        const [products, categories, suppliers, orders, warehouses] = await Promise.all([
            Product.find().lean(),
            Category.find().lean(),
            Supplier.find().lean(),
            Order.find().lean(),
            Warehouse.find().lean()
        ]);

        res.status(200).json({
            exportedAt: new Date().toISOString(),
            exportedBy: req.user.email,
            data: { products, categories, suppliers, orders, warehouses }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not export inventory data" });
    }
};
 
export const getMyProfile = async (req, res) => {
    try {
        // req.user._id is attached by the verifyUser/protect middleware
        const user = await User.findById(req.user._id).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            member: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
 
export const updateOwnProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, address, img, works, password, gender } = req.body;

        // Create update object with only allowed fields
        let updateData = { name, phone, address, img, works, gender };

        // Handle password hashing if the user is changing their password
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(12);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Your profile has been updated successfully",
            member: updatedUser
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin View: Add or Update Staff member
export const syncStaffProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, employeeId, email, role, status, 
            works, password, phone, department, address, gender 
        } = req.body;

        // Normalize enums
        const normalizedRole = role?.toLowerCase() || 'staff';
        const normalizedStatus = status?.toLowerCase() || 'active';
        if (!['staff', 'manager'].includes(normalizedRole)) {
            return res.status(400).json({ success: false, message: "Use warehouse assignment to create a warehouse admin; the master admin is provisioned from the backend." });
        }

        if (id) {
            // UPDATE Logic
            const existingUser = await User.findById(id);
            if (!existingUser) return res.status(404).json({ success: false, message: "Staff member not found" });
            if (existingUser.role === "admin") {
                return res.status(403).json({ success: false, message: "The master admin can only be managed through backend provisioning" });
            }
            if (existingUser.role === "warehouse") {
                return res.status(403).json({ success: false, message: "Unassign this user from their warehouse before changing their account" });
            }
            let updateData = { 
                name, 
                employeeId, // Explicitly mapped
                email, 
                phone, 
                role: normalizedRole, 
                status: normalizedStatus, 
                works, 
                department, 
                address,
                gender // Explicitly mapped
            };

            if (password && password.trim() !== "") {
                const salt = await bcrypt.genSalt(12);
                updateData.password = await bcrypt.hash(password, salt);
            }

            // Using the 'User' model imported at the top
            const updatedUser = await User.findByIdAndUpdate(
                id, 
                { $set: updateData }, 
                { new: true, runValidators: true }
            ).select("-password");
            
            return res.status(200).json({ 
                success: true, 
                message: "Staff profile synchronized", 
                member: updatedUser 
            });
        }

        // CREATE Logic
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: "Email already registered" });
        
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password || "Default@123", salt);

        const newStaff = new User({
            name, 
            employeeId, // Explicitly mapped
            email, 
            phone, 
            password: hashedPassword,
            role: normalizedRole, 
            status: normalizedStatus, 
            department, 
            address, 
            works,
            gender // Explicitly mapped
        });

        await newStaff.save();
        res.status(201).json({ success: true, message: "Staff registered successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Fetch Staff Directory 
export const getStaffList = async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 });

        const totalStaff = staff.length;
        const activeStaff = staff.filter(s => s.status?.toLowerCase() === "active").length;
        const inactiveStaff = staff.filter(s => s.status?.toLowerCase() === "inactive").length;
        const managers = staff.filter(s => s.role === "manager").length;

        const productivityBase = totalStaff > 0 
            ? ((activeStaff / totalStaff) * 100).toFixed(1) 
            : 0;

        res.status(200).json({
            success: true,
            staff, 
            summary: {
                totalStaff,
                activeStaff,
                inactiveStaff,
                managers,
                productivity: `${productivityBase}%`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching staff directory" });
    }
};


export const deleteStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "Staff member not found" });
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "The master admin cannot be deleted from the staff portal" });
        }
        if (user.assignedWarehouse) {
            return res.status(409).json({ success: false, message: "Unassign this user from their warehouse before deleting the account" });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: "Member removed from directory" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};