import mongoose, { model } from "mongoose";

const brandSchema = new mongoose.Schema({
    // --- BRAND IDENTITY ---
    name: { 
        type: String, 
        required: [true, "Brand name is required"], 
        trim: true,
        unique: true 
    },
    code: { 
        type: String, 
        required: [true, "Brand code (SKU prefix) is required"], 
        unique: true, 
        uppercase: true,
        trim: true 
    },
    logo: { type: String }, // Base64 or URL for the UI
    description: { type: String },
    originCountry: { type: String, default: "India" },

    // --- LOGISTICS & PERFORMANCE ---
    // Average time in days for brand to restock the warehouse
    leadTimeDays: { type: Number, default: 7 }, 
    
    // Performance ranking (0.0 to 5.0) for this brand's product quality
    brandRating: { type: Number, default: 0, min: 0, max: 5 },
    
    // Links to your storage types: liquid, solid, air
    specialization: { 
        type: String, 
        enum: ['liquid', 'solid', 'air', 'general'], 
        default: 'general' 
    },

    // --- FINANCIALS & VENDOR INFO ---
    // Default tax rate for this brand's primary products
    defaultTaxRate: { type: Number, default: 18 },
    
    // Total investment value of all stock currently in warehouses for this brand
    totalStockValue: { type: Number, default: 0 },
    
    website: { type: String },
    supportContact: {
        email: { type: String },
        phone: { type: String }
    },

    // --- SYSTEM STATUS ---
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Blacklisted'], 
        default: 'Active' 
    },
    isPremium: { type: Boolean, default: false },

}, { timestamps: true });


export default model.Schema("Brand", brandSchema);