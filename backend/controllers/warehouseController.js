import { sendCredentialsEmail } from "../utils/mailer.js"; 
import Warehouse from "../models/Warehouse.js";
import Category from "../models/Category.js";
import Products from "../models/Product.js";
import Staff from "../models/User.js"; // This is imported as Staff
import Supplier from "../models/Supplier.js";

// FETCH LEDGER DATA 
export const getStockList = async (req, res) => {
    try {
        const warehouse = await Warehouse.find().sort({ createdAt: -1 });
        const product = await Products.find().sort({ createdAt: -1 });
        const users = await Staff.find().sort({ createdAt: -1 });

        // CALCULATION LOGIC 
        const totalWarehouses = warehouse.length;
        const totalQuantity = warehouse.reduce((sum, w) => sum + (Number(w.quantity) || 0), 0);
        
        // Match statusWarehouse strings from your frontend enums
        const inStockCount = warehouse.filter(w => w.statusWarehouse === "active").length;
        const outOfStockCount = warehouse.filter(w => w.statusWarehouse === "inactive").length;

        // 1. Availability Rate: (Active / Total) * 100
        const availabilityRate = totalWarehouses > 0 ? ((inStockCount / totalWarehouses) * 100).toFixed(1) : 0;
        
        // 2. Active Zones: Count unique zones from the array
        const activeZonesCount = [...new Set(
            warehouse.flatMap(s => s.zone || []).map(z => typeof z === 'object' ? z.name : z)
        )].length;

        res.status(200).json({ 
            success: true, 
            stocks: warehouse,
            product,
            users,
            summary: {
                totalWarehouses,
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

// SYNC STOCK & UPGRADE ADMIN 
export const syncStockRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Auto-update status logic
        if (Number(data.quantity) <= 0) data.status = "Out of Stock";

        let warehouseRecord;

        if (id) {
            // UPDATE EXISTING
            warehouseRecord = await Warehouse.findByIdAndUpdate(id, data, { new: true });
        } else {
            // CREATE NEW
            warehouseRecord = new Warehouse(data);
            await warehouseRecord.save();
        }

        // ROLE UPGRADE & NOTIFICATION LOGIC
        if (data.admin) {
            // FIX: Changed "User" to "Staff" to match your import at top of file
            const adminUser = await Staff.findByIdAndUpdate(
                data.admin,
                { role: "warehouse admin" },
                { new: true }
            );

            if (adminUser) { 
                // SEND EMAIL (Non-blocking)
                sendCredentialsEmail(adminUser, warehouseRecord.name).catch(err => 
                    console.error("Email dispatch failed:", err)
                );
            }
        }

        const statusLabel = id ? "Synchronized" : "Logged";
        res.status(id ? 200 : 201).json({ 
            success: true, 
            message: `Warehouse Record ${statusLabel} and Admin Notified`, 
            stock: warehouseRecord 
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE RECORD 
export const deleteStock = async (req, res) => {
    try {
        await Warehouse.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Record purged from ledger" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};