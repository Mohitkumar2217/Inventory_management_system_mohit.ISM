// Import all models 
import Category from './models/Category.js';
import Supplier from './models/Supplier.js';
import Warehouse from './models/Warehouse.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from "./models/User.js";
import connectDB from './db/connection.js';

dotenv.config();

// const register = async () => {
//     try {
//         connectDB();
//         const hashPasswaord = await bcrypt.hash('admin', 10);
//         const newUser = new User({
//             name: "admin",
//             email: "admin@mohit.com",
//             password: hashPasswaord,
//             address: "admin address",
//             role:'admin'
//         }) 
//         await newUser.save();
//         console.log("Admin user created successfully");
//     }
//     catch (error) {
//         console.log("Creation error:", error.message);
//     }
// }

// register();


const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Supplier.deleteMany({});
        await Warehouse.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        const passwordHash = await bcrypt.hash("Staff@123", 12);

        // 1. SEED STAFF (15 Users)
        const staff = Array.from({ length: 15 }).map((_, i) => ({
            name: `Employee ${i + 1}`,
            email: `staff${i + 1}@inventory.com`,
            password: passwordHash,
            role: i < 2 ? 'admin' : i < 5 ? 'manager' : 'staff',
            status: i % 5 === 0 ? 'Inactive' : 'Active',
            works: `Managing logistics and inventory in Sector ${String.fromCharCode(65 + (i % 4))}.`,
        }));
        await User.insertMany(staff);

        // 2. SEED CATEGORIES (15 Categories)
        const categoriesData = [
            'Electronics', 'Beauty', 'Grocery', 'Furniture', 'Kitchen',
            'Tools', 'Automotive', 'Clothing', 'Toys', 'Health',
            'Stationery', 'Sports', 'Jewelry', 'Pet Supplies', 'Books'
        ];

        const categories = categoriesData.map((cat, i) => ({
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-'), // Generates 'electronics', 'pet-supplies', etc.
            code: `CAT-${100 + i}`,
            description: `Premium range of ${cat} inventory assets.`,
            status: 'Active'
        }));

        await Category.insertMany(categories);

        // 3. SEED SUPPLIERS (15 Suppliers)
        const suppliers = Array.from({ length: 15 }).map((_, i) => ({
            name: `Vendor ${i + 1} Global`,
            email: `contact@vendor${i + 1}.com`,
            address: `${100 + i} Industrial Area, New Delhi, India`,
            verification: i % 4 === 0 ? 'Pending' : 'Verified',
            status: 'Active',
            suppliesQuantity: Math.floor(Math.random() * 500) + 100,
            hierarchy: i % 3 === 0 ? 'Level 1' : 'Level 2',
            details: "Reliable partner for bulk supply and fast logistics."
        }));
        const savedSuppliers = await Supplier.insertMany(suppliers);

        // 4. SEED WAREHOUSE (15 Zones)
        const warehouseZones = Array.from({ length: 15 }).map((_, i) => ({
            product: `Storage Batch ${i + 1}`,
            quantity: Math.floor(Math.random() * 200),
            zone: `Zone ${String.fromCharCode(65 + (i % 5))}-${i + 1}`,
            status: i % 6 === 0 ? 'Out of Stock' : 'In Stock',
            details: "Temperature controlled storage. High security area."
        }));
        const updatedData = warehouseZones.map(item => ({
            ...item,
            warehouseName: item.warehouseName || "Default Warehouse",
            capacity: item.capacity || 500
        }));
        await Warehouse.insertMany(updatedData);

        // 5. SEED PRODUCTS (15 Products)
        const productNames = ["Smart Watch", "Organic Serum", "Coffee Arabica", "Wireless Mouse", "Yoga Mat", "LED Desk Lamp", "Bluetooth Speaker", "Face Wash", "Running Shoes", "Dark Chocolate", "Power Bank", "Water Bottle", "Hand Sanitizer", "Electric Kettle", "Laptop Stand"];
        const products = productNames.map((name, i) => ({
            name,
            code: `PRD-00${i + 1}`,
            category: categories[i % categories.length].name,
            brand: ["Apple", "Lakme", "Nescafe", "Logitech", "FitLife", "IKEA", "JBL", "Sony"][i % 8],
            price: (i + 1) * 250,
            cost: (i + 1) * 100,
            stock: Math.floor(Math.random() * 100) + 5,
            minStock: 20,
            img: ["⌚", "🧪", "🫘", "🖱️", "🧘", "💡", "🔊", "🧼", "👟", "🍫", "🔋", "🍼", "🧴", "🫖", "💻"][i],
            details: `High-quality ${name} with enterprise grade warranty.`
        }));
        await Product.insertMany(products);

        // 6. SEED ORDERS (15 Orders)
        const orders = Array.from({ length: 15 }).map((_, i) => ({
            vendorName: suppliers[i % 15].name,
            itemName: productNames[i % 15],
            category: categories[i % 15].name,
            quantity: Math.floor(Math.random() * 10) + 1,
            unitPrice: (i + 1) * 200,
            status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Cancelled",
            notes: "Urgent procurement protocol initiated."
        }));
        await Order.insertMany(orders);

        console.log("Database successfully seeded with 15 records per collection!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();