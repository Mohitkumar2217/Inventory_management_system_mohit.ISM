import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({ 
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    slug: { type: String, unique: true },
    brand: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Brand",
    },

    // --- LOGISTICS & STORAGE RULES --- 
    storageType: { 
        type: String, 
        enum: ['liquid', 'solid', 'air', 'ceramic', 'semiconductor'], 
        required: true,
        default: 'solid'
    },
    
    // Handling rules for the warehouse
    requiresCooling: { type: Boolean, default: false },
    isFragile: { type: Boolean, default: false },
    hazardLevel: { type: String, enum: ['None', 'Low', 'High', 'Medium', 'Danger'], default: 'None' },

    // --- GLOBAL THRESHOLDS ---
    // Sets default safety levels for all products in this category
    defaultMinStock: { type: Number, default: 10 },
    defaultMaxStock: { type: Number, default: 500 },

    // --- FINANCIALS ---
    taxRate: { type: Number, default: 18 }, // Percentage
    hsnCode: { type: String }, // Harmonized System of Nomenclature for tax

    // --- UI & ORGANIZATION ---
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    priority: { type: Number, default: 1 }, // Sort order in dropdowns
    colorCode: { type: String, default: '#3b82f6' }, // For dashboard badges
    icon: { type: String, default: 'package' }, // Lucide icon name string
    
    // --- SEO & META ---
    metaTitle: { type: String },
    isPrivate: { type: Boolean, default: false }, // If true, only admins can assign
    
}, { timestamps: true });


export default mongoose.model("Category", categorySchema);