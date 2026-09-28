import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from 'nodemailer';
import crypto from "node:crypto";
import RefreshToken from "../models/RefreshToken.js";

const refreshLifetimeMs = 7 * 24 * 60 * 60 * 1000;

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const createAccessToken = user => jwt.sign(
  { sub: user._id.toString(), type: "access" },
  getAccessSecret(),
  { expiresIn: "15m" }
);

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth",
  maxAge: refreshLifetimeMs
});

const readRefreshCookie = req => {
  const cookie = req.headers.cookie?.split(";").map(value => value.trim())
    .find(value => value.startsWith("ims_refresh="));
  return cookie ? cookie.slice("ims_refresh=".length) : null;
};

export const requireAuthClientHeader = (req, res, next) => {
  if (req.get("X-IMS-Client") !== "web") {
    return res.status(403).json({ success: false, message: "Request origin could not be verified." });
  }
  next();
};

const hashToken = token => crypto.createHash("sha256").update(token).digest("hex");

const createRefreshToken = async user => {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + refreshLifetimeMs);
  const token = jwt.sign(
    { sub: user._id.toString(), jti, type: "refresh" },
    getRefreshSecret(),
    { expiresIn: "7d" }
  );

  await RefreshToken.create({
    userId: user._id,
    jti,
    tokenHash: hashToken(token),
    expiresAt
  });
  return token;
};

const publicUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  assignedWarehouse: user.assignedWarehouse?.toString() || null
});

// SEND RESET EMAIL
export const forgotPassword = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Password reset secret is not configured." });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    // Generate a temporary token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user._id, type: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create Transporter with robust Gmail settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });
 
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

// UPDATE PASSWORD IN DB
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Password reset secret is not configured." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "password-reset" || !password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password reset link or password is invalid." });
    }

    // Hash new password with 12 salt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });
    await RefreshToken.deleteMany({ userId: user._id });

    res.status(200).json({ success: true, message: "Password updated successfully!" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ success: false, message: "Link is invalid or has expired." });
  }
};

// LOGIN 
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

    if (!getAccessSecret() || !getRefreshSecret()) {
      return res.status(500).json({ success: false, message: "Authentication secrets are not configured." });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    res.cookie("ims_refresh", refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}`,
      accessToken,
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// REGISTER 
export const Register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: "Email already exists" });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, address, role: 'staff' });
    await newUser.save();

    return res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("REGISTRATION ERROR DETAILS:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message // testing in postman
    });
  }
};

export const refreshSession = async (req, res) => {
  if (!getAccessSecret() || !getRefreshSecret()) {
    return res.status(500).json({ success: false, message: "Authentication secrets are not configured." });
  }

  const oldToken = readRefreshCookie(req);
  if (!oldToken) {
    return res.status(401).json({ success: false, message: "Refresh token is missing." });
  }

  let decoded;
  try {
    decoded = jwt.verify(oldToken, getRefreshSecret());
  } catch {
    res.clearCookie("ims_refresh", getRefreshCookieOptions());
    return res.status(401).json({ success: false, message: "Refresh session is invalid or expired." });
  }

  if (decoded.type !== "refresh" || !decoded.sub || !decoded.jti) {
    res.clearCookie("ims_refresh", getRefreshCookieOptions());
    return res.status(401).json({ success: false, message: "Refresh token is invalid." });
  }

  try {
    const session = await RefreshToken.findOne({
      userId: decoded.sub,
      jti: decoded.jti,
      tokenHash: hashToken(oldToken),
      expiresAt: { $gt: new Date() }
    });
    if (!session) {
      res.clearCookie("ims_refresh", getRefreshCookieOptions());
      return res.status(401).json({ success: false, message: "Refresh session has expired or was revoked." });
    }

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      await session.deleteOne();
      res.clearCookie("ims_refresh", getRefreshCookieOptions());
      return res.status(401).json({ success: false, message: "Account no longer exists." });
    }

    const refreshToken = await createRefreshToken(user);
    await session.deleteOne();
    const accessToken = createAccessToken(user);
    res.cookie("ims_refresh", refreshToken, getRefreshCookieOptions());
    return res.status(200).json({ success: true, accessToken, user: publicUser(user) });
  } catch {
    return res.status(500).json({ success: false, message: "Could not refresh the session." });
  }
};

export const logout = async (req, res) => {
  const refreshToken = readRefreshCookie(req);
  try {
    if (refreshToken) {
      await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
    }
  } catch {
    res.clearCookie("ims_refresh", getRefreshCookieOptions());
    return res.status(503).json({ success: false, message: "Session cookie cleared, but server-side revocation failed." });
  }
  res.clearCookie("ims_refresh", getRefreshCookieOptions());
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};