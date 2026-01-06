import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiLayers, FiClock, FiCheckCircle, FiPackage, FiActivity, FiDollarSign, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import AnalysisModal from '../Charts/AnalysisModalChart';

const SummaryCard = ({ items, userName = "Mohit" }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    // --- FEATURE: Real-time clock for "System Management" feel ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Updated with Fulfillment, Logistics, and Financial Insights
    const summaryData = [
        // --- Core Inventory ---
        { label: "Total Items", value: items.totalProducts || "563", stats: '12 Low Stock', trend: '+5%', isWarning: true, color: "bg-blue-600", bg: "bg-blue-50", icon: "📦" },
        { label: "Inventory Value", value: `₹${items.totalRevenue || "1.2M"}`, stats: '40% Capacity', trend: '+12%', color: "bg-emerald-600", bg: "bg-emerald-50", icon: "🏢" },

        // --- Logistics & Fulfillment --- 
        { label: "Order Accuracy", value: "98.4%", stats: 'Low Returns', trend: '+1.2%', color: "bg-cyan-500", bg: "bg-cyan-50", icon: <FiCheckCircle /> },
        { label: "Backorder Vol.", value: "14 Items", stats: 'Critical Stock', trend: '+2', isWarning: true, color: "bg-rose-500", bg: "bg-rose-50", icon: <FiPackage /> },

        // --- Financial & Valuation --- 
        { label: "Inv. Turnover", value: "8.4x", stats: 'Healthy Flow', trend: '+0.5x', color: "bg-purple-600", bg: "bg-purple-50", icon: <FiActivity /> },

        // --- NEW WAREHOUSE & STORAGE METRICS ---
        { label: "Storage Utilization", value: "78%", stats: 'Near Capacity', trend: '+4%', isWarning: true, color: "bg-indigo-600", bg: "bg-indigo-50", icon: <FiLayers /> },

        { label: "Suppliers", value: "367", stats: '4 Active Today', trend: '0%', color: "bg-purple-600", bg: "bg-purple-50", icon: "🚚" },
        { label: "Net Sales", value: "₹5,353", stats: '70% of Daily Goal', trend: '+18%', color: "bg-pink-600", bg: "bg-pink-50", icon: "💰" },
    ];

    const notices = [
        { id: 1, text: "System maintenance scheduled for Sunday at 2:00 AM.", type: "urgent" },
        { id: 2, text: "You've reached 90% of your monthly sales goal! 🚀", type: "promo" },
    ];

    const openAnalysis = (item) => {
        setSelectedCard(item);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-[#F9FAFB] p-6">
            <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Left Column - REMAINED UNCHANGED */}
                <div className="w-full lg:max-w-xs space-y-6">
                    <div className="px-2">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                            {/* FEATURE: Live System Time */}
                            <p className="text-[10px] font-mono font-bold text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">Hi {userName} 👋</h2>
                    </div>

                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div key={notice.id} className={`p-4 rounded-[1.5rem] border shadow-sm transition-all hover:shadow-md ${notice.type === 'urgent' ? 'bg-white border-rose-100 text-rose-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-100'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg ${notice.type === 'urgent' ? 'bg-rose-50' : 'bg-white/20'}`}>
                                        {notice.type === 'urgent' ? <FiAlertCircle size={16} /> : '📢'}
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">{notice.text}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-white rounded-[2rem] p-6 text-slate-900 relative overflow-hidden group border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="relative z-10">
                                <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full mb-3 inline-block">AI INSIGHT</span>
                                <h4 className="text-sm font-black mb-1">Restock Alert</h4>
                                <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">Demand for <span className="text-blue-600 font-bold">Sugar</span> is increasing.</p>
                                <button className="w-full bg-slate-900 text-white text-[11px] font-black py-3 rounded-xl hover:bg-blue-600 transition-all">Order Now</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Cards Grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {summaryData.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => openAnalysis(item)}
                            className="cursor-pointer bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative border-b-4"
                            style={{ borderColor: 'transparent', borderBottomColor: item.isWarning ? '#f97316' : '#e2e8f0' }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    <span className="flex items-center justify-center">{item.icon}</span>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${item.isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {item.isNegative ? <FiTrendingDown /> : <FiTrendingUp />} {item.trend}
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 mt-1 transition-opacity">View Details</span>
                                </div>
                            </div>
                            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{item.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                                <span className={`text-[11px] font-bold ${item.isWarning ? 'text-orange-500' : 'text-slate-500'}`}>{item.stats}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-4">
                                <div className={`${item.color} h-1 transition-all duration-1000`} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedCard}
            />
        </div>
    );
};

export default SummaryCard;