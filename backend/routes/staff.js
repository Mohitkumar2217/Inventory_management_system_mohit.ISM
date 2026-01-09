import express from "express";
import { getStaffList, syncStaffProfile, deleteStaff } from "../controllers/staffController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Matches: GET /api/staff
router.get("/", verifyUser, checkRole(['admin', 'manager']), getStaffList);

// Matches: POST /api/staff (Add)
router.post("/", verifyUser, checkRole(['admin']), syncStaffProfile);

// Matches: PUT /api/staff/:id (Update)
router.put("/:id", verifyUser, checkRole(['admin']), syncStaffProfile);

// Matches: DELETE /api/staff/:id
router.delete("/:id", verifyUser, checkRole(['admin']), deleteStaff);

export default router;