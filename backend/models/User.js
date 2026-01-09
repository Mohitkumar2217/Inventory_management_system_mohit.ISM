import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String, required: true, unique:true},
    password: { type: String, required:true},
    address: { type: String },
    role: { type: String, enum: ["admin", "manager", "staff", "warehouse", "accountant"], default: 'staff' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    productivity: { type: Number, default: 0 },
    works: { type: String },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;