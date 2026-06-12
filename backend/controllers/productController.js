import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Warehouse from "../models/Warehouse.js"; 
import Supplier from "../models/Supplier.js";
import Order from "../models/Order.js";

// GET ANALYTICS TRENDS  
export const getProductTrends = async (req, res) => {
    try {
        const { type } = req.query;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let groupCalculation;

        // Optimized Select Logic based on UI selection
        switch (type) {
            case "Inventory Value":
                groupCalculation = { $multiply: ["$price", "$stock"] };
                break;
            case "Profit Margin": // Added new trend for the cost field
                groupCalculation = { $subtract: ["$price", "$cost"] };
                break;
            case "Available Units":
                groupCalculation = "$stock";
                break;
            case "Low Stock Alerts":
                groupCalculation = { $cond: [{ $lt: ["$stock", "$minStock"] }, 1, 0] };
                break;
            case "Total Products":
                groupCalculation = 1;
                break;
            default:
                groupCalculation = 1;
                break;
        }

        const trends = await Product.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    val: { $sum: groupCalculation }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        // Fill in missing days with 0 to prevent "broken" charts
        const chartData = dayNames.map((name, index) => {
            const dayData = trends.find(t => t._id === index + 1);
            return { name, val: dayData ? dayData.val : 0 };
        });

        res.status(200).json({ success: true, chartData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Trend analysis failed" });
    }
};

// GET ALL PRODUCTS & MODULE ANALYTICS (CORRECTED)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        const suppliers = await Supplier.find();
        const categories = await Category.find({ status: "Active" });
        const warehouses = await Warehouse.find();

        // 1. Flatten all zones from all warehouses and extract names
        const allZoneNames = warehouses.flatMap(w => 
            (w.zone || []).map(z => typeof z === 'object' ? z.name : z)
        );

        // 2. Create a unique list of zone names
        const uniqueZones = [...new Set(allZoneNames)];

        // Calculate advanced metrics
        const summary = {
            totalProducts: products.length,
            totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
            lowStockCount: products.filter(p => p.stock < (p.minStock || 20)).length,
            categoriesCount: categories.length,
            totalInventoryValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
            activeZones: uniqueZones.length // Using unique count
        };

        // Notices logic
        const notices = [];
        if (summary.lowStockCount > 0) {
            notices.push({ id: 1, text: `${summary.lowStockCount} items reaching critical low levels.`, type: "urgent" });
        }

        const pendingCount = await Order.countDocuments({ status: "Pending" });
        if (pendingCount > 0) {
            notices.push({ id: 2, text: `Deployment Queue: ${pendingCount} pending orders.`, type: "standard" });
        }

        if (notices.length === 0) {
            notices.push({ id: 3, text: "All logistics modules operational.", type: "standard" });
        } 

        res.status(200).json({
            success: true,
            products,
            summary,
            availableCategories: categories.map(c => c.name),
            availableWarehouses: warehouses.map(w => w.warehouseName),
            availableZones: uniqueZones, // Returns unique string names
            availableSuppliers: [...new Set(suppliers.map(p => p.name))],
            notices,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error syncing inventory modules" });
    }
};
// UPDATED SYNC PRODUCT (Handling Dynamic Variants) 
export const syncProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        // --- NEW LOGIC: AUTO-CALCULATE DATA FROM VARIANTS ---
        if (productData.variants && productData.variants.length > 0) {
            // Sum up total stock from all variants
            productData.stock = productData.variants.reduce(
                (acc, curr) => acc + Number(curr.stock || 0), 
                0
            );
            
            // Default global price to the first variant if main price is not set
            if (!productData.price) {
                productData.price = productData.variants[0].price;
            }
        }

        if (id) {
            const updatedProduct = await Product.findByIdAndUpdate(
                id, 
                productData, 
                { new: true, runValidators: true }
            );
            return res.status(200).json({
                success: true,
                message: "Product Registry Synchronized (Variants Updated)",
                product: updatedProduct
            });
        }

        // Logic to prevent duplicate code identifiers
        const existing = await Product.findOne({ code: productData.code });
        if (existing) return res.status(400).json({ 
            success: false, 
            message: "Product Identifier code already in use." 
        });

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({ 
            success: true, 
            message: "New Asset & Variants Successfully Registered" 
        });

    } catch (error) {
        // Special handling for MongoDB SKU unique constraint inside variants
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Identifier error: SKU or Code already exists." 
            });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};


// DELETE PRODUCT 
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Asset removed from registry" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};