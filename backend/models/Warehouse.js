import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    product: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock'], 
        default: 'In Stock' 
    },
    zone: { type: String, required: true }, // e.g., Zone A-1
    details: { type: String }, // Handling instructions
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);