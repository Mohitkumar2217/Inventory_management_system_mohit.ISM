import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock'], 
        default: 'In Stock' 
    },
    zone: { type: String, required: true },  
    details: { type: String },  
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);