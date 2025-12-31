import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './db/connection.js';
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express(); 


app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 4000, () => { 
    connectDB();
    console.log('Sever is running on http://localhost:4000');
});