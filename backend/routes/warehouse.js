import express from "express";
import { getStockList, syncStockRecord, deleteStock } from "../controllers/warehouseController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// View access for all authorized staff
router.get("/", verifyUser, getStockList);

// Create/Update access for Admin, Manager, and Warehouse staff
router.post("/", verifyUser, checkRole(['admin', 'manager', 'warehouse']), syncStockRecord);
router.put("/:id", verifyUser, checkRole(['admin', 'manager', 'warehouse']), syncStockRecord);

// Delete access restricted to Admin only
router.delete("/:id", verifyUser, checkRole(['admin']), deleteStock);

export default router;