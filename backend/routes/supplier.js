// backend/routes/supplierRoutes.js
import express from 'express';
import multer from 'multer'; 
import { getSuppliers, addSupplier, deleteSupplier } from "../controllers/supplierController.js";
import { verifyUser, checkRole } from "../middleware/authMiddleware.js"; 

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Define the file fields once
const supplierFiles = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idCard', maxCount: 1 },
  { name: 'documents.licence', maxCount: 1 },
  { name: 'documents.contract', maxCount: 1 },
  { name: 'documents.idProof', maxCount: 1 },
  { name: 'documents.addressProof', maxCount: 1 },
  { name: 'bankDetails.bankPassbookProof', maxCount: 1 }
]);

// --- ROUTES ---

// 1. Get List (Protected)
router.get("/", verifyUser, getSuppliers);

// 2. Create New (Protected + Files)
router.post("/", verifyUser, checkRole(['admin', 'manager']), supplierFiles, addSupplier);

// 3. Update Existing (Protected + Files)
router.put("/:id", verifyUser, checkRole(['admin', 'manager']), supplierFiles, addSupplier);

// 4. Delete (Admin Only)
router.delete("/:id", verifyUser, checkRole(['admin']), deleteSupplier);

export default router;