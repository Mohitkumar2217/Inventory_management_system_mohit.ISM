import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Warehouse from "../models/Warehouse.js";

// --- GET ALL PRODUCTS & MODULE ANALYTICS ---
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        const categories = await Category.find({ status: "Active" });
        const warehouseRecords = await Warehouse.find();

        const summary = {
            totalProducts: products.length,
            totalStock: products.reduce((sum, p) => sum + p.stock, 0),
            lowStockCount: products.filter(p => p.stock < (p.minStock || 20)).length,
            categoriesCount: categories.length,
            totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            activeZones: [...new Set(warehouseRecords.map(w => w.zone))].length
        };

        res.status(200).json({ 
            success: true, 
            products, 
            summary,
            availableCategories: categories.map(c => c.name)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error syncing inventory modules" });
    }
};

// --- ADD OR UPDATE PRODUCT ---
export const syncProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        if (id) {
            // Update existing
            const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
            return res.status(200).json({ 
                success: true, 
                message: "Product Registry Updated", 
                product: updatedProduct 
            });
        }

        // Check if code exists
        const existing = await Product.findOne({ code: productData.code });
        if (existing) return res.status(400).json({ success: false, message: "Product Code already exists" });

        // Add new
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({ success: true, message: "New Product Successfully Registered" });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- DELETE PRODUCT ---
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product removed from ledger" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};