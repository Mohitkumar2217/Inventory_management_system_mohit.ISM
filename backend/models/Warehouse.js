import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },  
})
const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock'], 
        default: 'In Stock' 
    },
    zone: [zoneSchema],  
    details: { type: String },  
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);