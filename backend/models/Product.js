import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name: { type: String},
    product_code: { type: String, required: true, unique:true},
    product_category: { type: String, required:true},
    product_brand: { type: String },
    product_warehouse_name: { type: String},
    product_warehouse_id: { type: String, required: true },
    product_description: { type: String },
    product_unit:{type: Number},
    product_weight:{type: Number},
    product_dimensions: { type: Number },
    product_ammount: { type: Number, default: 0 },
    product_created_at: { type: Date, default: Date.now },
    product_updated_at: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema);
export default Product;