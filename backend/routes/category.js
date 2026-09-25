import express from "express";
import { getCategories, addCategory, deleteCategory } from "../controllers/categoryController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/categories
router.get("/", verifyUser, checkRole(['admin', 'manager', 'staff']), getCategories);

// POST /api/categories
router.post("/", verifyUser, checkRole(['admin']), addCategory);

// PUT /api/categories/:id for updates
router.put("/:id", verifyUser, checkRole(['admin']), addCategory);

// DELETE /api/categories/:id
router.delete("/:id", verifyUser, checkRole(['admin']), deleteCategory);

export default router;