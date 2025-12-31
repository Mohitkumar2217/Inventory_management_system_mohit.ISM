import React, { useState } from "react";
import {
    FaExclamationTriangle, FaFilter, FaImage, FaPlus,
    FaLaptop, FaTshirt, FaHome, FaRunning, FaAppleAlt
} from "react-icons/fa";

// --- 15 FAKE ITEMS DATA ---
const fakeInventory = [
    { id: 1, name: "MacBook Pro M3", category: { name: "Electronics" }, stock: 2, imageURL: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" },
    { id: 2, name: "Cotton Crew Tee", category: { name: "Apparel" }, stock: 5, imageURL: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop" },
    { id: 3, name: "Smart Coffee Maker", category: { name: "Home" }, stock: 3, imageURL: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&h=200&fit=crop" },
    { id: 4, name: "Yoga Mat Pro", category: { name: "Fitness" }, stock: 12, imageURL: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=200&h=200&fit=crop" },
    { id: 5, name: "Organic Honey", category: { name: "Grocery" }, stock: 8, imageURL: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop" },
    { id: 6, name: "Sony WH-1000XM5", category: { name: "Electronics" }, stock: 1, imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
    { id: 7, name: "Denim Jacket", category: { name: "Apparel" }, stock: 4, imageURL: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=200&h=200&fit=crop" },
    { id: 8, name: "LED Floor Lamp", category: { name: "Home" }, stock: 6, imageURL: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop" },
    { id: 9, name: "Adjustable Dumbbells", category: { name: "Fitness" }, stock: 15, imageURL: "https://images.unsplash.com/photo-1583454110551-21f2fa20e32c?w=200&h=200&fit=crop" },
    { id: 10, name: "Cold Brew Pack", category: { name: "Grocery" }, stock: 20, imageURL: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=200&h=200&fit=crop" },
    { id: 11, name: "iPad Air", category: { name: "Electronics" }, stock: 2, imageURL: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop" },
    { id: 12, name: "Running Shoes", category: { name: "Apparel" }, stock: 7, imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
    { id: 13, name: "Ceramic Vase", category: { name: "Home" }, stock: 9, imageURL: "https://images.unsplash.com/photo-1580910051074-3eb6948865c5?w=200&h=200&fit=crop" },
    { id: 14, name: "Resistance Bands", category: { name: "Fitness" }, stock: 3, imageURL: "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?w=200&h=200&fit=crop" },
    { id: 15, name: "Protein Bars", category: { name: "Grocery" }, stock: 25, imageURL: "https://images.unsplash.com/photo-1622484211148-19747c34823e?w=200&h=200&fit=crop" },
];

const LowStockCard = () => {
    const [items] = useState(fakeInventory);
    const [openFilter, setOpenFilter] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [maxStock, setMaxStock] = useState(10); // Defaulting to 10 for "Low Stock"

    const filteredItems = items.filter(item => {
        const categoryMatch = categoryFilter ? item.category?.name === categoryFilter : true;
        const stockMatch = maxStock ? item.stock <= Number(maxStock) : true;
        return categoryMatch && stockMatch;
    });

    // Helper to get Icon based on category
    const getCategoryIcon = (cat) => {
        switch (cat) {
            case "Electronics": return <FaLaptop className="text-blue-500" />;
            case "Apparel": return <FaTshirt className="text-purple-500" />;
            case "Home": return <FaHome className="text-green-500" />;
            case "Fitness": return <FaRunning className="text-red-500" />;
            case "Grocery": return <FaAppleAlt className="text-orange-500" />;
            default: return <FaImage className="text-slate-300" />;
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 flex flex-col h-[500px] relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />

            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200">
                        <FaExclamationTriangle className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">Low Stock</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Action Required</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative">
                    <span className="text-[10px] font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full uppercase tracking-wider">
                        {filteredItems.length} Wornings
                    </span>
                    <button
                        onClick={() => setOpenFilter(!openFilter)}
                        className={`p-2.5 rounded-xl border transition-all ${openFilter ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <FaFilter size={14} />
                    </button>

                    {/* Filter Dropdown */}
                    {openFilter && (
                        <div className="absolute right-0 top-12 bg-white shadow-2xl border border-slate-100 rounded-2xl p-4 w-60 z-50 animate-in fade-in zoom-in duration-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Filter Alerts</h4>
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">Category</label>
                            <select
                                className="w-full bg-slate-50 border-none px-3 py-2 rounded-xl text-sm mb-4 focus:ring-2 focus:ring-orange-200 outline-none"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {[...new Set(items.map(i => i.category?.name))].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase">Threshold: {maxStock}</label>
                            <input
                                type="range" min="1" max="30"
                                className="w-full accent-orange-500"
                                value={maxStock}
                                onChange={(e) => setMaxStock(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content List Section */}
            <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
                {filteredItems.length > 0 ? (
                    <div className="space-y-3">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white border border-slate-50 hover:border-orange-200 hover:shadow-sm transition-all rounded-2xl p-3 group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Image Container */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={item.imageURL}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
                                        />
                                        <div className="absolute -top-1 -left-1 bg-white rounded-full p-1 shadow-sm border border-slate-50">
                                            {getCategoryIcon(item.category.name)}
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${item.stock <= 3 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                                                }`}>
                                                {item.stock} LEFT
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Action Button */}
                                <button className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all bg-slate-900 text-white p-2.5 rounded-xl shadow-lg">
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-4xl">✨</div>
                        <p className="font-bold text-slate-600">Inventory is Healthy!</p>
                        <p className="text-xs">No items currently meet your alert threshold.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LowStockCard;