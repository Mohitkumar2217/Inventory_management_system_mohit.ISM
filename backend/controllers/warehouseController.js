import { sendCredentialsEmail } from "../utils/mailer.js"; 
import Warehouse from "../models/Warehouse.js";
import Products from "../models/Product.js";
import Staff from "../models/User.js"; // This is imported as Staff
import Supplier from "../models/Supplier.js";

// FETCH LEDGER DATA 
export const getStockList = async (req, res) => {
    try {
        const isWarehouseAdmin = req.user.role === "warehouse";
        if (isWarehouseAdmin && !req.user.assignedWarehouse) {
            return res.status(403).json({ success: false, message: "No warehouse is assigned to this account" });
        }

        const warehouseFilter = isWarehouseAdmin ? { _id: req.user.assignedWarehouse } : {};
        const warehouse = await Warehouse.find(warehouseFilter).sort({ createdAt: -1 });
        const safeWarehouseList = isWarehouseAdmin
            ? warehouse.map((record) => {
                const safeRecord = record.toObject();
                delete safeRecord.admin;
                delete safeRecord.staff;
                return safeRecord;
            })
            : warehouse;
        const [product, users] = req.user.role === "admin"
            ? await Promise.all([
                Products.find().sort({ createdAt: -1 }),
                Staff.find({ role: { $ne: "admin" } }).select("name email role status assignedWarehouse").sort({ createdAt: -1 })
            ])
            : [[], []];

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
            stocks: safeWarehouseList,
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
        const data = { ...req.body };

        if (req.user.role === "warehouse") {
            if (!id || id !== req.user.assignedWarehouse?.toString()) {
                return res.status(403).json({ success: false, message: "You can only update your assigned warehouse" });
            }

            const editableFields = [
                "name", "quantity", "status", "zone", "details", "address", "storageType",
                "capacity", "hierarchyLevel", "statusWarehouse", "order", "inventory", "ranking", "labourCount"
            ];
            const update = Object.fromEntries(editableFields
                .filter((field) => Object.hasOwn(data, field))
                .map((field) => [field, data[field]]));
            const assignedWarehouse = await Warehouse.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true, runValidators: true }
            );
            if (!assignedWarehouse) {
                return res.status(404).json({ success: false, message: "Assigned warehouse not found" });
            }
            const safeRecord = assignedWarehouse.toObject();
            delete safeRecord.admin;
            delete safeRecord.staff;
            return res.status(200).json({ success: true, message: "Assigned warehouse updated", stock: safeRecord });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only the master admin can manage warehouse assignments" });
        }

        const previousWarehouse = id ? await Warehouse.findById(id) : null;
        if (id && !previousWarehouse) {
            return res.status(404).json({ success: false, message: "Warehouse not found" });
        }

        let nextAdmin = null;
        const requestedAdminId = Object.hasOwn(data, "admin") ? data.admin : previousWarehouse?.admin;
        if (requestedAdminId) {
            nextAdmin = await Staff.findById(requestedAdminId);
            if (!nextAdmin || nextAdmin.role === "admin") {
                return res.status(400).json({ success: false, message: "Select an existing non-admin user as warehouse admin" });
            }
            if (nextAdmin.assignedWarehouse && nextAdmin.assignedWarehouse.toString() !== id) {
                return res.status(409).json({ success: false, message: "This user is already assigned to another warehouse" });
            }
        }

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

        const previousAdminId = previousWarehouse?.admin?.toString();
        const nextAdminId = nextAdmin?._id.toString();
        if (previousAdminId && previousAdminId !== nextAdminId) {
            await Staff.updateOne(
                { _id: previousAdminId, role: "warehouse", assignedWarehouse: warehouseRecord._id },
                { $set: { role: "staff" }, $unset: { assignedWarehouse: 1 } }
            );
        }
        if (nextAdmin && nextAdminId !== previousAdminId) {
            await Staff.findByIdAndUpdate(nextAdmin._id, {
                $set: { role: "warehouse", assignedWarehouse: warehouseRecord._id }
            });
            sendCredentialsEmail(nextAdmin, warehouseRecord.name).catch(err =>
                console.error("Email dispatch failed:", err)
            );
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
        const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (warehouse?.admin) {
            await Staff.updateOne(
                { _id: warehouse.admin, role: "warehouse", assignedWarehouse: warehouse._id },
                { $set: { role: "staff" }, $unset: { assignedWarehouse: 1 } }
            );
        }
        res.status(200).json({ success: true, message: "Record purged from ledger" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete operation failed" });
    }
};