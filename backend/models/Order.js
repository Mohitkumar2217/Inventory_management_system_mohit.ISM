import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Red / XL"
  sku: { type: String, required: true, unique: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
});

const orderSchema = new mongoose.Schema({
    // SECTION 1: IDENTIFICATION
    poNumber: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    refId: { type: String, trim: true },
    priority: { 
        type: String, 
        enum: ["standard", "urgent", "critical"], 
        default: "standard" 
    },

    // SECTION 2: VENDOR & PRODUCT
    vendorName: { type: String, required: true },
    vendorEmail: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true 
    },
    itemName: { type: String, required: true },
    sku: { type: String, required: true },
    category: { type: String, default: "Electronics" },
    variants: [VariantSchema],

    // SECTION 3: LOGISTICS & WAREHOUSING
    warehouse: { type: String, required: true, default: "Main Hub - New Delhi" },
    zone: { type: String, required: true, default: "zone-A" },
    whContact: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    expectedDate: { type: Date, required: true },

    // SECTION 4: FINANCIALS (Detailed)
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0 },
    shippingCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    paymentTerms: { type: String, default: "Due on Receipt" },
    
    // Total calculation (Optional: can also be calculated on the fly)
    totalOrderValue: { type: Number },

    // SECTION 5: INVENTORY & SYSTEM STATUS
    minStock: { type: Number, default: 0 }, // Reorder point target
    status: { 
        type: String, 
        enum: ["Draft", "Pending", "In Transit", "Completed", "Cancelled"], 
        default: "Pending" 
    },
    stockUpdated: { type: Boolean, default: false },
    notes: { type: String, maxlength: 500 }
}, { 
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Middleware to calculate totalOrderValue before saving
// orderSchema.pre('save', function(next) {
//     const subtotal = this.quantity * this.unitPrice;
//     const tax = (subtotal * this.taxRate) / 100;
//     this.totalOrderValue = subtotal + tax + this.shippingCharges - this.discount;
//     next();
// });

export default mongoose.model("Order", orderSchema);