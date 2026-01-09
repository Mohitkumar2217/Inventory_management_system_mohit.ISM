import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from 'nodemailer';

// --- PART 1: SEND RESET EMAIL ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    // Generate a temporary token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '15m' }
    );

    // Create Transporter with robust Gmail settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS  // Your 16-character App Password from .env
      }
    });

    // Link points to your FRONTEND URL (Vite default is 5173)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"InventoryMS Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; background-color: #ffffff;">
          <h2 style="color: #1e293b; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #64748b; line-height: 1.6;">We received a request to reset your InventoryMS account password. Click the button below to set a new one. This link is valid for 15 minutes.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; pt-20px; margin-top: 20px;">If you didn't request this, you can safely ignore this email. No changes will be made to your account.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Reset link sent! Check your inbox." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server could not send email. Verify App Password." });
  }
};

// --- PART 2: UPDATE PASSWORD IN DB ---
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Hash new password with 12 salt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password updated successfully!" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ success: false, message: "Link is invalid or has expired." });
  }
};

// --- PART 3: LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}`,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// --- PART 4: REGISTER ---
export const Register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: "Email already exists" });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, address, role: role || 'staff' });
    await newUser.save();

    return res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};