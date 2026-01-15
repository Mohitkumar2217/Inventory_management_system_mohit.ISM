import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Red / XL"
  sku: { type: String, required: true, unique: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
    // --- EXISTING FIELDS ---
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 20 },
    details: { type: String },
    images: {
        type: [String], // Array of URLs
        validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
        required: true,
        default: "📦"
    },
    sku: { type: String },
    supplier: { type: String, required: true },
    weight: { type: String },
    dimensions: { type: String },
    color: { type: String },

    // --- dynamic VARIANTS ---
    variants: [VariantSchema],
    
    // --- NEW LOGISTICS & WAREHOUSING ---
    warehouse: { type: String, required: true },      // e.g., "Aisle 4, Shelf B"
    barcode: {
        type: String,
        unique: true, // Prevents duplicate barcodes
        sparse: true  // Allows multiple products to have NO barcode without error
    }, // EAN/UPC for scanning
    unit: { type: String, default: "pcs" },   // pcs, kg, box, liters
    isTaxable: { type: Boolean, default: true },
    taxPercentage: { type: Number, default: 18 },

    // --- FINANCIAL METRICS ---
    currency: { type: String, default: "INR" },
    discountPrice: { type: Number },          // Sale price if active
    margin: { type: Number },                 // Can be auto-calculated (Price - Cost)

    // --- STATUS & VISIBILITY ---
    status: {
        type: String,
        enum: ["Active", "Inactive", "Draft", "Discontinued"],
        default: "Active"
    },
    isFeatured: { type: Boolean, default: false },
    availability: {
        type: String,
        enum: ["In Stock", "Out of Stock", "Pre-order"],
        default: "In Stock"
    },

    // --- PRODUCT VARIANTS & TYPES ---
    material: { type: String },               // e.g., "Stainless Steel", "Cotton"
    warranty: { type: String },               // e.g., "1 Year Manufacturer"
    condition: {
        type: String,
        enum: ["New", "Refurbished", "Used"],
        default: "New"
    },

    // --- SHELF LIFE & BATCHING ---
    expiryDate: { type: Date },               // Critical for food/meds
    manufacturingDate: { type: Date },
    batchNumber: { type: String },

    // --- SEO & ONLINE DISCOVERY ---
    slug: { type: String, lowercase: true },  // for URL: /product/nebula-x1
    tags: [{ type: String }],                 // ["gadget", "wireless", "premium"]
    metaTitle: { type: String },
    metaDescription: { type: String },

    // --- PERFORMANCE TRACKING ---
    rating: { type: Number, default: 0 },     // 1 to 5 stars
    reviewCount: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 }   // Tracks popularity

}, { timestamps: true });

// // Pre-save hook to calculate Margin automatically 
// productSchema.pre('save', function(next) { // Make sure 'next' is here
//     if (this.price && this.cost) {
//         this.margin = this.price - this.cost;
//     }
//     next(); // Make sure this is called
// });

function arrayLimit(val) {
    return val.length <= 4;
}

export default mongoose.model("Product", productSchema);