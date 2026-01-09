import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    taxRate: { type: Number, default: 18 },
    slug: { type: String, unique: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    priority: { type: Number, default: 1 },
    metaTitle: { type: String },
    isPrivate: { type: Boolean, default: false },
    colorCode: { type: String, default: '#3b82f6' }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);