import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Warehouse from "../models/Warehouse.js"; 
import Order from "../models/Order.js";

export const getProductTrends = async (req, res) => {
    try {
        const { type } = req.query;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let groupCalculation;

        // --- SELECT LOGIC BASED ON CARD CLICKED ---
        switch (type) {
            case "Inventory Value":
                groupCalculation = { $multiply: ["$price", "$stock"] };
                break;
            case "Total Revenue":
                groupCalculation = { $multiply: ["$price", "$stock"] };
                break;
            case "Low Stock Alerts":
                groupCalculation = {
                    $cond: [{ $lt: ["$stock", "$minStock"] }, 1, 0]
                };
                break;
            case "Categories":
                groupCalculation = 1;
                break;
            case "Available Units":
                groupCalculation = "$stock";
                break;
            case "Low Stock Alerts":
                groupCalculation = {
                    $cond: [{ $lt: ["$stock", "$minStock"] }, 1, 0]
                };
                break;
            case "Total Products":
                groupCalculation = {
                    $cond: [{ $gt: ["$stock", 0] }, 1, 0]
                };
                break;
            default:
                groupCalculation = 1;
                break;
        }

        const trends = await Product.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    val: { $sum: groupCalculation }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Map data to ensure all days are represented even if 0
        const chartData = trends.map(item => ({
            name: dayNames[item._id - 1],
            val: item.val
        }));

        res.status(200).json({ success: true, chartData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Trend analysis failed" });
    }
};

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

        const notices = [];

        // 1. Check for Low Stock Alerts
        const lowStockItems = await Product.find({ 
            $expr: { $lt: ["$stock", "$minStock"] } 
        });

        if (lowStockItems.length > 0) {
            notices.push({
                id: 1,
                text: `${lowStockItems.length} items reaching low stock levels.`,
                type: "urgent"
            });
        }

        // 2. Check for Pending Orders
        const pendingCount = await Order.countDocuments({ status: "Pending" });
        if (pendingCount > 0) {
            notices.push({
                id: 2,
                text: `You have ${pendingCount} new orders to process.`,
                type: "standard"
            });
        }

        // 3. Fallback (If no alerts)
        if (notices.length === 0) {
            notices.push({
                id: 3,
                text: "All systems operational. No pending alerts.",
                type: "standard"
            });
        } 

        res.status(200).json({
            success: true,
            products,
            summary,
            availableCategories: categories.map(c => c.name),
            notices
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