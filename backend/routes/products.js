import express from "express";
import authMiddleware from '../middleware/authMiddleware.js'
import { addProduct, getProducts, updateProducts, deleteProducts } from '../controllers/products.js';
const router = express.Router();

router.post('/add', addProduct);
router.get('/', getProducts);
router.put('/:id', updateProducts);
router.delete('/:id', deleteProducts);

export default router;