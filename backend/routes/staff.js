import express from "express";
import { 
    getMyProfile, 
    updateOwnProfile, 
    getStaffList, 
    syncStaffProfile, 
    deleteStaff 
} from "../controllers/staffController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
 
// Order matters: Static paths must come before dynamic /:id
router.get("/profile", verifyUser, getMyProfile);
router.put("/update-profile", verifyUser, updateOwnProfile);
 
router.get("/", verifyUser, checkRole(['admin', 'manager']), getStaffList);
router.post("/", verifyUser, checkRole(['admin']), syncStaffProfile);
router.put("/:id", verifyUser, checkRole(['admin']), syncStaffProfile);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteStaff);

export default router;