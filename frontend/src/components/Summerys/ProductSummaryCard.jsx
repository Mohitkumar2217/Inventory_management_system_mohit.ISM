import React, { useState, useEffect } from 'react';
import ProductAnalysisModal from '../Charts/ProductAnalysisModel.jsx';

const ProductSummaryCard = ({ items = {}, nameSum }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // --- FEATURE: Real-time clock for "System Management" feel ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isInventory = nameSum?.toLowerCase() === 'inventory';

    // --- FEATURE: Centralized Formatting Logic ---
    const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`;
    const getProgressWidth = (stats) => {
        const num = parseInt(stats);
        return isNaN(num) ? 0 : num;
    };

    const totalCount = items.totalProducts || 0;
    const totalRevenue = items.totalInventoryValue || 0;
    const stockVolume = items.totalStock || 0;
    const alertCount = items.lowStockCount || 0;
    const categoryCount = items.categoriesCount || 0;

    const summaryData = [
        { id: 'total', label: isInventory ? "Total Products" : "Total Orders", value: totalCount, stats: '85%', color: "bg-blue-600", bg: "bg-blue-50", icon: isInventory ? "📦" : "📥" },
        { id: 'stock', label: isInventory ? "Stock Volume" : "Total Stock", value: stockVolume, stats: '40%', color: "bg-emerald-600", bg: "bg-emerald-50", icon: isInventory ? "🏗️" : "🏢" },
        { id: 'alerts', label: isInventory ? "Low Stock Alerts" : "Completed Orders", value: alertCount, stats: isInventory ? `${totalCount > 0 ? ((alertCount / totalCount) * 100).toFixed(0) : 0}%` : '60%', color: isInventory ? "bg-rose-500" : "bg-cyan-500", bg: isInventory ? "bg-rose-50" : "bg-cyan-50", icon: isInventory ? "⚠️" : "🛒" },
        { id: 'cats', label: isInventory ? "Categories" : "Cancelled Orders", value: categoryCount, stats: '15%', color: "bg-amber-600", bg: "bg-amber-50", icon: isInventory ? "🗂️" : "🚫" },
        { id: 'units', label: isInventory ? "Available Units" : "Total Pending Orders", value: stockVolume, stats: '70%', color: "bg-purple-600", bg: "bg-purple-50", icon: isInventory ? "📦" : "⏳" },
        { id: 'revenue', label: isInventory ? "Inventory Value" : "Total Revenue", value: formatCurrency(totalRevenue), stats: '90%', color: "bg-pink-600", bg: "bg-pink-50", icon: "💰" },
    ];

    const notices = isInventory ? [
        { id: 1, text: `${alertCount} items reaching low stock.`, type: "urgent" },
        { id: 2, text: "Check new arrivals from vendors.", type: "promo" },
    ] : [
        { id: 1, text: "2 Orders placed for delivery.", type: "urgent" },
        { id: 2, text: "4 new orders ready for processing.", type: "promo" },
    ];

    const handleCardClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-[#F9FAFB] p-4 lg:p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row items-stretch gap-8">

                {/* Left Column: Title, Clock & Notices */}
                <div className="w-full lg:max-w-xs space-y-6">
                    <div className="px-2">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                            {/* FEATURE: Live System Time */}
                            <p className="text-[10px] font-mono font-bold text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mt-1">
                            {nameSum} <span className="text-blue-600">.</span>
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div key={notice.id} className={`p-4 rounded-[1.5rem] border shadow-sm transition-all hover:shadow-md ${notice.type === 'urgent' ? 'bg-white border-rose-100 text-rose-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-100'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg ${notice.type === 'urgent' ? 'bg-rose-50' : 'bg-white/20'}`}>
                                        {notice.type === 'urgent' ? '⚠️' : '📢'}
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">{notice.text}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-900 rounded-[1rem] p-5 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
                            <h4 className="text-xs font-black mb-1 uppercase tracking-wider text-cyan-400">Smart Insights</h4>
                            <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">AI is analyzing your trends.</p>
                            <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-white/10 active:scale-95">View Report</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stat Cards */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaryData.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item)}
                            role="button" // FEATURE: Accessibility
                            tabIndex={0}  // FEATURE: Keyboard Navigation
                            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(item)}
                            className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative cursor-pointer active:scale-95 border-b-4 h-48 flex flex-col justify-between"
                            style={{ borderBottomColor: (item.label.includes("Low") || item.label.includes("Cancelled")) ? '#f43f5e' : '#e2e8f0' }}
                        >
                            <div className="flex justify-between items-start">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <div className={`flex flex-col items-end`}>
                                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${item.label.includes("Cancelled") || item.label.includes("Low") ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {item.stats}
                                    </div>
                                    {/* FEATURE: Interaction hint */}
                                    <span className="text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 mt-1 transition-opacity">View Details</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                                {/* FEATURE: Empty State Check */}
                                <p className="text-2xl font-black text-slate-900 tracking-tight">
                                    {item.value || <span className="text-slate-200">No Data</span>}
                                </p>
                            </div>

                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`${item.color} h-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${getProgressWidth(item.stats)}%` }} // FEATURE: Dynamic progress parsing
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProductAnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                isInventory={isInventory}
            />
        </div>
    );
};

export default ProductSummaryCard;