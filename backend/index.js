import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './db/connection.js';
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import supplierRoutes from "./routes/supplier.js";
import staffRoutes from "./routes/staff.js";
// import productRoutes from "./routes/product.js"; 
// import orderRoutes from "./routes/order.js";

dotenv.config();
const app = express();


app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/staffs", staffRoutes);
// app.use("/api/products", productRoutes); 
// app.use("/api/orders", orderRoutes);

connectDB();
app.listen(process.env.PORT || 4000, () => {
    console.log('Sever is running on http://localhost:4000');
});