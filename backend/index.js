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

const allowedOrigins = [
    "https://inventory-management-system-mohit-i-three.vercel.app",
    "http://localhost:5173", 
    "http://localhost:5174"   
];

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // 2. Check if origin is in our explicit list
        const isAllowed = allowedOrigins.indexOf(origin) !== -1;

        // 3. Check if it's a Vercel preview/deployment URL using Regex
        const isVercelPreview = /\.vercel\.app$/.test(origin);

        if (isAllowed || isVercelPreview) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin); // Helpful for debugging
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log('Sever is running on http://localhost:4000');
});