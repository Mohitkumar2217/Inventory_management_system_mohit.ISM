import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    // --- 1. BASIC DETAILS ---
    name: { type: String, required: true, trim: true },
    photo: { type: String }, // URL to image
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended', 'Assigned'],
        default: 'Active'
    },
    idCard: { type: String }, // URL/Path to ID card image

    // --- 2. GOODS PROVIDING DETAILS ---
    itemsDetails: [{
        itemName: String,
        category: String,
        unitPrice: Number,
        brand: String,
        Mop: Number,
        itemid: String,
        itemDescription: String
    }], 
    suppliesQuantity: { type: Number, default: 0 }, // SKUs Supplied
    hierarchy: { type: String, default: "Level 1" },
    details: { type: String }, 
    isCurrentlyActiveForDelivery: { type: Boolean, default: true },
    itemLimit: { type: Number, default: 0 }, // numbers of item(limit)

    // --- 3. STATUS & COMPLIANCE DETAILS ---
    verification: {
        type: String,
        enum: ['Verified', 'Pending', 'Rejected'],
        default: 'Pending'
    },
    documents: {
        licence: { type: String }, // URL to file
        contract: { type: String }, // URL to file
        idProof: { type: String },   // URL to file
        addressProof: { type: String } // URL to file
    },

    // --- 4. CONNECTED WAREHOUSE ---
    connectedWarehouses: [{
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        warehouseName: String,
        itemCategorySupplied: { type: String },
        itemCountSupplied: { type: Number, default: 0 }
    }],

    // --- 5. ACCOUNT DETAILS ---
    bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        bankBranch: { type: String },
        bankPassbookProof: { type: String } // URL to image/pdf
    },

    // --- 6. PERFORMANCE ---
    performance: {
        daysActive: { type: Number, default: 0 }, // numbers of days actively working
        deliveryPercentage: { type: Number, default: 100 },
        goodsQualityStatus: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor'],
            default: 'Good'
        },
        deliveryAccuracy: { type: Number, default: 100 }, // how accurate delivery
        staffFeedback: [{
            rating: Number,
            comment: String,
            date: { type: Date, default: Date.now }
        }],
        totalOrdersCompleted: { type: Number, default: 0 }
    },

    // --- 7. HISTORY ---
    history: {
        lastDelivery: {
            status: { type: String, enum: ['active', 'completed', 'cancelled', 'pending'] },
            date: Date,
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
        },
        paymentHistory: [{
            amount: Number,
            date: Date,
            transactionId: String,
            status: String
        }]
    },

    // --- 8. DESCRIPTION & RANKING ---
    description: {
        ranking: { type: Number, default: 0 },
        additionalNotes: { type: String }
    }

}, { timestamps: true });

// Virtual for calculating average rating from feedback
supplierSchema.virtual('averageFeedback').get(function () {
    if (this.performance.staffFeedback.length === 0) return 0;
    const sum = this.performance.staffFeedback.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / this.performance.staffFeedback.length;
});

export default mongoose.model("Supplier", supplierSchema);