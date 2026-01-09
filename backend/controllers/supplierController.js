import Supplier from "../models/Supplier.js";

// Fetch all suppliers
export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching supplier network" });
    }
};

// Add or Update supplier
export const addSupplier = async (req, res) => {
    try {
        const { id } = req.params; // For updates
        if (id) {
            const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ success: true, message: "Partner Profile Synchronized", supplier: updated });
        }
        
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json({ success: true, message: "Partner Registered Successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already registered in network" });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a supplier
export const deleteSupplier = async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Partner removed from registry" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Protocol failed" });
    }
};