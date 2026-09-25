import express from "express";
import { getStockList, syncStockRecord, deleteStock } from "../controllers/warehouseController.js";
import { verifyUser, checkRole, checkAssignedWarehouse } from "../middleware/authMiddleware.js";

const router = express.Router();

// View access for all authorized staff
router.get("/", verifyUser, checkRole(['admin', 'warehouse']), getStockList);

// Create/Update access for Admin, Manager, and Warehouse staff
router.post("/", verifyUser, checkRole(['admin']), syncStockRecord);
router.put("/:id", verifyUser, checkRole(['admin', 'warehouse']), (req, res, next) => {
	if (req.user.role === 'warehouse') return checkAssignedWarehouse(req, res, next);
	next();
}, syncStockRecord);

// Delete access restricted to Admin only
router.delete("/:id", verifyUser, checkRole(['admin']), deleteStock);

export default router;