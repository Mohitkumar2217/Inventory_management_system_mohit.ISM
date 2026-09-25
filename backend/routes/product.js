import express from "express";
import { getProducts, syncProduct, deleteProduct,getProductTrends } from "../controllers/productController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All staff can view inventory
router.get("/", verifyUser, checkRole(['admin', 'manager', 'staff']), getProducts);
router.get("/analysis/trends", verifyUser, checkRole(['admin', 'manager', 'staff']), getProductTrends);
router.post("/", verifyUser, checkRole(['admin']), syncProduct);
router.put("/:id", verifyUser, checkRole(['admin']), syncProduct);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteProduct); 

export default router;