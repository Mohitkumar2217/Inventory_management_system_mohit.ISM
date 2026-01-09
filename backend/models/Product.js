import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true }, // Internal ID
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 20 }, // For low stock alerts
    details: { type: String },
    img: { type: String, default: "📦" }, // Supports emoji or URL
    sku: { type: String },
    supplier: { type: String },
    weight: { type: String },
    dimensions: { type: String },
    color: { type: String }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);