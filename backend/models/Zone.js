import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // e.g., "Zone A-1"
  },
  slug: {
    type: String,
    required: true,
    unique: true, // e.g., "zone-a-1"
    lowercase: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  type: {
    type: String,
    enum: ['General', 'Cold Storage', 'Hazardous', 'High-Value', 'Loading Dock'],
    default: 'General'
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'meters' }
  },
  capacity: {
    maxWeight: Number, // Total weight limit for the zone
    maxVolume: Number, // Total cubic space
    currentOccupancy: { type: Number, default: 0 } // Percentage or unit count
  },
  status: {
    type: String,
    enum: ['Active', 'Full', 'Maintenance', 'Inactive'],
    default: 'Active'
  },
  metadata: {
    temperatureRequired: Number,
    isSecurityMonitored: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Indexing for faster lookups within a specific warehouse
zoneSchema.index({ warehouse: 1, name: 1 }, { unique: true });
export default mongoose.model('Zone', zoneSchema);