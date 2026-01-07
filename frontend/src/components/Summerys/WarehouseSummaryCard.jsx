import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Hash, CheckCircle, XCircle, BarChart3, TrendingUp } from 'lucide-react';

const WareHouseSummaryCard = ({ items = {}, nameSum }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // --- FEATURE: Real-time clock for "System Management" feel ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const summaryData = [
        { label: "Total SKUs", value: items.totalProducts, stats: 'Unique Items', color: "bg-blue-600", bg: "bg-blue-50", icon: <Package size={22} className="text-blue-600" /> },
        { label: "Stock Volume", value: items.totalQuantity.toLocaleString(), stats: 'Total Units', color: "bg-orange-600", bg: "bg-orange-50", icon: <Hash size={22} className="text-orange-600" /> },
        { label: "Ready Items", value: items.inStockCount, stats: 'In Stock', color: "bg-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={22} className="text-emerald-600" /> },
        { label: "Out of Stock", value: items.outOfStockCount, stats: 'Critical', color: "bg-rose-600", bg: "bg-rose-50", icon: <XCircle size={22} className="text-rose-600" />, isWarning: true },
        { label: "Space Utility", value: "72%", stats: 'Capacity', color: "bg-indigo-600", bg: "bg-indigo-50", icon: <BarChart3 size={22} className="text-indigo-600" /> },
        { label: "Stock Flow", value: "+8.4%", stats: 'Weekly', color: "bg-pink-600", bg: "bg-pink-50", icon: <TrendingUp size={22} className="text-pink-600" /> },
    ];

    const notices = [
        { id: 1, text: `${items.outOfStockCount} items require immediate restocking.`, type: "urgent" },
        { id: 2, text: "Warehouse Zone B cleaning scheduled for Saturday.", type: "promo" },
    ];

    return (
        <div className="bg-[#F9FAFB] p-4 lg:p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row items-stretch gap-8">
                {/* Left Column */}
                <div className="w-full lg:max-w-xs space-y-6">
                    <div className="px-2">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                            {/* FEATURE: Live System Time */}
                            <p className="text-[10px] font-mono font-bold text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mt-1">{nameSum} <span className="text-orange-500">.</span></h1>
                    </div>
                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div key={notice.id} className={`p-4 rounded-[1.5rem] border shadow-sm transition-all hover:shadow-md ${notice.type === 'urgent' ? 'bg-white border-rose-100 text-rose-700' : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-100'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg ${notice.type === 'urgent' ? 'bg-rose-50' : 'bg-white/20'}`}>{notice.type === 'urgent' ? '⚠️' : '📢'}</div>
                                    <p className="text-xs font-bold leading-relaxed">{notice.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {summaryData.map((item, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-48 active:scale-95 cursor-pointer border-b-4" style={{ borderBottomColor: item.isWarning ? '#f43f5e' : '#e2e8f0' }}>
                            <div className="flex justify-between items-start">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>{item.icon}</div>
                                <div className="bg-slate-50 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">{item.stats}</div>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className={`${item.color} h-full transition-all duration-1000 ease-out`} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WareHouseSummaryCard;