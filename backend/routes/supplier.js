import express from "express";
import { getSuppliers, addSupplier, deleteSupplier } from "../controllers/supplierController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Matches: GET /api/suppliers
router.get("/", verifyUser, getSuppliers);

// Matches: POST /api/suppliers (Add)
router.post("/", verifyUser, checkRole(['admin', 'manager']), addSupplier);

// Matches: PUT /api/suppliers/:id (Update)
router.put("/:id", verifyUser, checkRole(['admin', 'manager']), addSupplier);

// Matches: DELETE /api/suppliers/:id
router.delete("/:id", verifyUser, checkRole(['admin']), deleteSupplier);

export default router;