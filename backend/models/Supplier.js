import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    verification: { type: String, enum: ['Verified', 'Pending'], default: 'Verified' },
    warehouses: { type: Number, default: 1 },
    suppliesQuantity: { type: Number, default: 0 }, // SKUs Supplied
    hierarchy: { type: String, default: "Level 1" },
    details: { type: String },
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);