import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    itemName: { type: String, required: true },
    category: { type: String, default: "Electronics" },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    warehouse: { type: String, default: "Main Warehouse" },
    expectedDate: { type: Date },
    paymentTerms: { type: String, default: "Due on Receipt" },
    status: { 
        type: String, 
        enum: ["Completed", "Pending", "Cancelled"], 
        default: "Pending" 
    },
    stockUpdated: { type: Boolean, default: false },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);