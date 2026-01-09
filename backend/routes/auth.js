import express from "express";
import { login, Register,forgotPassword, resetPassword } from "../controllers/authController.js"; 

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/register", Register);  
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password/:token', resetPassword);

export default authRoutes;