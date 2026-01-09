import Warehouse from "../models/Warehouse.js";

export const getStockList = async (req, res) => {
    try {
        const stocks = await Warehouse.find().sort({ createdAt: -1 });

        // --- CALCULATION LOGIC ---
        const totalProducts = stocks.length;
        const totalQuantity = stocks.reduce((sum, s) => sum + s.quantity, 0);
        const inStockCount = stocks.filter(s => s.status === "In Stock").length;
        const outOfStockCount = stocks.filter(s => s.status === "Out of Stock").length;

        // 1. Availability Rate: (In Stock / Total SKUs) * 100
        const availabilityRate = totalProducts > 0 
            ? ((inStockCount / totalProducts) * 100).toFixed(1) 
            : 0;

        // 2. Active Zones: Count unique zones where quantity > 0
        const activeZonesCount = [...new Set(
            stocks.filter(s => s.quantity > 0).map(s => s.zone)
        )].length;

        res.status(200).json({ 
            success: true, 
            stocks,
            summary: {
                totalProducts,
                totalQuantity,
                inStockCount,
                outOfStockCount,
                availabilityRate: `${availabilityRate}%`,
                activeZonesCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching warehouse ledger" });
    }
};

// Add or Update Stock record
export const syncStockRecord = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Auto-update status based on quantity if not provided
        if (req.body.quantity <= 0) req.body.status = "Out of Stock";

        if (id) {
            const updated = await Warehouse.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ success: true, message: "Inventory Record Synchronized", stock: updated });
        }
        
        const newStock = new Warehouse(req.body);
        await newStock.save();
        res.status(201).json({ success: true, message: "New Stock Successfully Logged" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Stock record
export const deleteStock = async (req, res) => {
    try {
        await Warehouse.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Record purged from ledger" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};