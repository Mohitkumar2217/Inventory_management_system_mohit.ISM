import express from "express";
import { getSuppliers, addSupplier, deleteSupplier } from "../controllers/supplierController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get list and summary
router.get("/", verifyUser, getSuppliers);

// Protected Management Routes
router.post("/", verifyUser, checkRole(['admin', 'manager']), addSupplier);
router.put("/:id", verifyUser, checkRole(['admin', 'manager']), addSupplier);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteSupplier);

export default router;