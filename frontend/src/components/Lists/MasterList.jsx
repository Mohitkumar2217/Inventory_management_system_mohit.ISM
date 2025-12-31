import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiFilter, FiMoreHorizontal, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ALL_PRODUCTS_DATA = [
    { id: 1, name: "Serum Bottle", category: "Skincare", stock: 489, price: "1200", status: "In Stock" },
    { id: 2, name: "Organic Cream", category: "Beauty", stock: 45, price: "850", status: "Low Stock" },
    { id: 3, name: "Bath Soap", category: "Hygiene", stock: 789, price: "150", status: "In Stock" },
    { id: 4, name: "Rain Umbrella", category: "Accessories", stock: 657, price: "450", status: "In Stock" },
    { id: 5, name: "Coffee Beans", category: "Grocery", stock: 120, price: "600", status: "In Stock" },
    { id: 6, name: "Bottle Cup Set", category: "Kitchen", stock: 15, price: "1100", status: "Low Stock" },
    { id: 7, name: "Face Wash", category: "Skincare", stock: 0, price: "350", status: "Out of Stock" },
];

const MasterList = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All"); // All, In Stock, Low Stock

    // Logic for Filtering and Searching
    const filteredProducts = useMemo(() => {
        return ALL_PRODUCTS_DATA.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 product.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || product.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filterStatus]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                    
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Master Inventory</h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    Showing {filteredProducts.length} Products
                                </p>
                            </div>
                            <button onClick={onClose} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all text-slate-400">
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or category..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                                {["All", "In Stock", "Low Stock"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                            filterStatus === status 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                            {filteredProducts.length > 0 ? (
                                <table className="w-full text-left border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-4">
                                            <th className="pb-2 pl-6">Product Details</th>
                                            <th className="pb-2">Stock Level</th>
                                            <th className="pb-2">Price</th>
                                            <th className="pb-2 text-right pr-6">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="group shadow-sm hover:shadow-md transition-all">
                                                <td className="py-5 pl-6 bg-slate-50 rounded-l-[1.5rem] border-y border-l border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">📦</div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-900">{product.name}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{product.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 bg-slate-50 border-y border-slate-100">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            {product.stock < 50 ? <FiAlertCircle className="text-orange-500" /> : <FiCheckCircle className="text-blue-600" />}
                                                            <span className="text-xs font-black text-slate-700">{product.stock} Units</span>
                                                        </div>
                                                        <div className="w-24 bg-slate-200 h-1 rounded-full overflow-hidden">
                                                            <div className={`h-full ${product.stock < 50 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                                                                 style={{ width: `${Math.min((product.stock / 1000) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 bg-slate-50 border-y border-slate-100 text-sm font-black text-blue-600">
                                                    ₹{product.price}
                                                </td>
                                                <td className="py-5 pr-6 bg-slate-50 rounded-r-[1.5rem] border-y border-r border-slate-100 text-right">
                                                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black hover:bg-slate-900 hover:text-white transition-all">
                                                        MANAGE
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <FiSearch size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">No products found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MasterList;