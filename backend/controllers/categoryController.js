import Category from "../models/Category.js";

// Fetch all categories for the list view
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ priority: 1 });
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Could not fetch categories" });
    }
};

// Create a new category from the form
export const addCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ success: true, message: "Category Registered Successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Category Code or Slug must be unique" });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted from registry" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Delete failed" });
    }
};