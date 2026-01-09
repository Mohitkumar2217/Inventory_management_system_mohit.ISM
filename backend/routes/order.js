import express from "express";
import { getOrders, syncOrder, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getOrders);
router.post("/", verifyUser, syncOrder);
router.put("/:id", verifyUser, syncOrder);
router.patch("/status/:id", verifyUser, updateOrderStatus);
router.delete("/:id", verifyUser, deleteOrder);

export default router;