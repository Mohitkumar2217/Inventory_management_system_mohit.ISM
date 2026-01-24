import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
})
const inventorySchema = new mongoose.Schema({
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    productName: { type: String, required: true },
    sku: { type: String, unique: true }, // Stock Keeping Unit

    // Status Logic
    quantity: { type: Number, default: 0 },
    reservedForShop: { type: Number, default: 0 }, // "Items out for shop section"
    damagedQuantity: { type: Number, default: 0 }, // "Items defect/damage type"

    // Finance
    unitCost: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },

    // Dates
    expiryDate: { type: Date },
    lastRestocked: { type: Date, default: Date.now }
});

inventorySchema.virtual('totalValue').get(function () {
    return this.quantity * this.unitCost;
});

const orderSchema = new mongoose.Schema({
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    orderType: { type: String, enum: ['inbound', 'outbound'], required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
        quantity: Number
    }],
    orderStatus: {
        type: String,
        enum: ['placed', 'processing', 'completed', 'returned'],
        default: 'placed'
    },
    finance: {
        totalRevenue: { type: Number },
        tax: { type: Number }
    }
}, { timestamps: true });


const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    zone: [zoneSchema],
    details: { type: String },
    address: {
        zone: { type: String, required: true }, // e.g., "North Sector"
        city: { type: String, required: true },
        state: { type: String },
        pin: { type: Number, required: true },
    },
    warehouseId: { type: String, required: true, unique: true },

    // Category from your list
    storageType: {
        type: String,
        enum: ['liquid', 'solid', 'air'],
        required: true
    },

    // Limits and Hierarchy
    capacity: { type: Number, required: true }, // Max units/volume
    hierarchyLevel: { type: Number, default: 1 }, // 1 for Hub, 2 for Regional, etc.

    // Workers Details
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    labourCount: { type: Number, default: 0 },

    statusWarehouse: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    order: [orderSchema],
    inventory: [inventorySchema],
    ranking: { type: Number, default: 0 } // "Ranking more" from your list
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);