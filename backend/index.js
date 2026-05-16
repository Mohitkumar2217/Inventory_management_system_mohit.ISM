import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './db/connection.js';
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import supplierRoutes from "./routes/supplier.js";
import staffRoutes from "./routes/staff.js";
import warehouseRoutes from "./routes/warehouse.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

dotenv.config();
connectDB();
const app = express();

// app.use(cors({origin: ["http://localhost:5173","http://localhost:5174"]})); // Adjust the origin as needed
app.use(cors({origin: "https://inventory-management-system-mohit-i.vercel.app"})); // Adjust the origin as needed

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log('Sever is running on https://localhost:4000');
});