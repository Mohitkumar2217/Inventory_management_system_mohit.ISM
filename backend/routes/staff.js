import express from "express";
import { 
    getMyProfile, 
    updateOwnProfile, 
    updateMySettings,
    changeOwnPassword,
    exportInventoryData,
    getStaffList, 
    syncStaffProfile, 
    deleteStaff 
} from "../controllers/staffController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();
 
// Order matters: Static paths must come before dynamic /:id
router.get("/profile", verifyUser, getMyProfile);
router.put("/settings", verifyUser, updateMySettings);
router.put("/change-password", verifyUser, changeOwnPassword);
router.get("/export", verifyUser, checkRole(['admin']), exportInventoryData);
router.put("/update-profile", verifyUser, checkRole(['admin']), updateOwnProfile);
 
router.get("/", verifyUser, checkRole(['admin']), getStaffList);
router.post("/", verifyUser, checkRole(['admin']), syncStaffProfile);
router.put("/:id", verifyUser, checkRole(['admin']), syncStaffProfile);
router.delete("/:id", verifyUser, checkRole(['admin']), deleteStaff);

export default router;