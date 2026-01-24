import mongoose from "mongoose";

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

const categorySchema = new mongoose.Schema({ 
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    slug: { type: String, unique: true },
    brand: {brandSchema},

    // --- LOGISTICS & STORAGE RULES --- 
    storageType: { 
        type: String, 
        enum: ['liquid', 'solid', 'air'], 
        required: true,
        default: 'solid'
    },
    
    // Handling rules for the warehouse
    requiresCooling: { type: Boolean, default: false },
    isFragile: { type: Boolean, default: false },
    hazardLevel: { type: String, enum: ['None', 'Low', 'High'], default: 'None' },

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

// Auto-generate slug from name before saving
// categorySchema.pre('save', function(next) {
//     if (this.isModified('name')) {
//         this.slug = this.name.toLowerCase().split(' ').join('-');
//     }
//     next();
// });

export default mongoose.model("Category", categorySchema);