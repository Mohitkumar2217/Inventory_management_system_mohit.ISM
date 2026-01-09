import express from "express";
import { getProducts, syncProduct, deleteProduct } from "../controllers/productController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All staff can view inventory
router.get("/", verifyUser, getProducts);
router.post("/", verifyUser, checkRole(['admin', 'manager']), syncProduct);
router.put("/:id", verifyUser, checkRole(['admin', 'manager']), syncProduct);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteProduct);

export default router;