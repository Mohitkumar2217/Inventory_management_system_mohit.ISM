import express from "express";
import { getOrders, syncOrder, updateOrderStatus, deleteOrder, getOrderTrends } from "../controllers/orderController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, checkRole(['admin', 'manager']), getOrders);
router.get("/analysis/trends", verifyUser, checkRole(['admin', 'manager']), getOrderTrends);
router.post("/", verifyUser, checkRole(['admin', 'manager']), syncOrder);
router.put("/:id", verifyUser, checkRole(['admin', 'manager']), syncOrder);
router.patch("/status/:id", verifyUser, checkRole(['admin', 'manager']), updateOrderStatus);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteOrder);

export default router;