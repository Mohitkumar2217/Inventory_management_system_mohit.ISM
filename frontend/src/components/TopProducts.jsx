import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowUpRight, FiCheckCircle, FiAlertTriangle, 
    FiX, FiSearch, FiFilter, FiMoreHorizontal, FiPackage 
} from 'react-icons/fi';
import MasterList from './Lists/MasterList.jsx';

const TopProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const products = [
        { name: "Serum Bottle", count: "489", status: "In Stock", bg: "bg-blue-50", text: "text-blue-600", img: "🧴", growth: "+12%" },
        { name: "Organic Cream", count: "468", status: "Low Stock", statusType: "warning", bg: "bg-orange-50", text: "text-orange-600", img: "🧪", growth: "+8%" },
        { name: "Bath Soap", count: "789", status: "In Stock", bg: "bg-emerald-50", text: "text-emerald-600", img: "🧼", growth: "+24%" },
        { name: "Rain Umbrella", count: "657", status: "In Stock", bg: "bg-purple-50", text: "text-purple-600", img: "⛱️", growth: "+15%" },
    ];

    const duplicatedProducts = [...products, ...products, ...products];

    const BestItems = [
        { name: "Coffee Beans", sell: "45,897", earned: "₹45.89 M", color: "bg-orange-50", img: "🫘", rank: 1 },
        { name: "Bottle Cup Set", sell: "44,359", earned: "₹45.50 M", color: "bg-pink-50", img: "🥤", rank: 2 },
        { name: "Organic Cream", sell: "38,210", earned: "₹32.15 M", color: "bg-emerald-50", img: "🧪", rank: 3 }
    ];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 mb-6 p-2 bg-[#f9fafb]">
            <MasterList isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Left Slider Card */}
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-4 overflow-hidden relative shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Trending Inventory</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">High Velocity Goods</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest">
                        View Master List
                    </button>
                </div>

                <div className="relative w-full overflow-hidden">
                    {/* Soft White Fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent" />

                    <motion.div className="flex gap-6 w-max" animate={{ x: [0, "-33.33%"] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" }}}>
                        {duplicatedProducts.map((item, idx) => (
                            <div key={idx} className="w-[260px] flex-shrink-0 border border-slate-100 rounded-[2rem] p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                                <div className={`${item.bg} w-full aspect-video rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-105 transition-transform duration-500`}>
                                    {item.img}
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-black text-slate-800 text-sm truncate">{item.name}</h3>
                                    <span className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg border ${item.statusType === 'warning' ? 'bg-white border-orange-200 text-orange-600' : 'bg-white border-blue-200 text-blue-600'}`}>
                                        {item.statusType === 'warning' ? <FiAlertTriangle /> : <FiCheckCircle />}
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Stock</span>
                                        <span className="text-slate-900 text-sm font-black">{item.count} <span className="text-[10px] text-slate-400">Units</span></span>
                                    </div>
                                    <div className="flex items-center text-emerald-600 font-black text-[10px] bg-emerald-50 px-2 py-1 rounded-lg">
                                        <FiArrowUpRight className="mr-0.5" /> {item.growth}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Right Leaderboard Card */}
            <div className="xl:col-span-2 space-y-4">
                <h2 className="text-lg font-black text-slate-900 px-2 tracking-tight">Best Performers</h2>
                {BestItems.map((item, idx) => (
                    <div key={idx} className="group bg-white border border-slate-200 rounded-[2rem] p-5 flex items-center gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-slate-900 text-[10px] font-black px-3 py-1 text-white rounded-br-[1rem]">#0{item.rank}</div>
                        <div className={`${item.color} w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform duration-300`}>{item.img}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-slate-800 truncate text-sm mb-2">{item.name}</h3>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase">
                                <span className="text-slate-400">Net Earned</span>
                                <span className="text-blue-600">{item.earned}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-slate-900 rounded-full" style={{ width: `${100 - (idx * 15)}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopProducts;