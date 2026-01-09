import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Hash, CheckCircle, XCircle, BarChart3, TrendingUp } from 'lucide-react';

const WareHouseSummaryCard = ({ items = {}, nameSum }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const summaryData = [
        { 
            label: "Total SKUs", 
            value: items.totalProducts || 0, 
            stats: 'Unique Items', 
            color: "bg-blue-600", 
            bg: "bg-blue-50", 
            icon: <Package size={22} className="text-blue-600" />,
            percent: 100 
        },
        { 
            label: "Stock Volume", 
            value: (items.totalQuantity || 0).toLocaleString(), 
            stats: 'Total Units', 
            color: "bg-orange-600", 
            bg: "bg-orange-50", 
            icon: <Hash size={22} className="text-orange-600" />,
            percent: 80 
        },
        { 
            label: "Ready Items", 
            value: items.inStockCount || 0, 
            stats: 'In Stock', 
            color: "bg-emerald-600", 
            bg: "bg-emerald-50", 
            icon: <CheckCircle size={22} className="text-emerald-600" />,
            percent: items.totalProducts > 0 ? (items.inStockCount / items.totalProducts) * 100 : 0
        },
        { 
            label: "Out of Stock", 
            value: items.outOfStockCount || 0, 
            stats: 'Critical', 
            color: "bg-rose-600", 
            bg: "bg-rose-50", 
            icon: <XCircle size={22} className="text-rose-600" />, 
            isWarning: items.outOfStockCount > 0,
            percent: items.totalProducts > 0 ? (items.outOfStockCount / items.totalProducts) * 100 : 0
        },
        { 
            label: "Availability", 
            value: items.availabilityRate || "0%", 
            stats: 'Service Level', 
            color: "bg-indigo-600", 
            bg: "bg-indigo-50", 
            icon: <BarChart3 size={22} className="text-indigo-600" />,
            percent: parseFloat(items.availabilityRate) || 0
        },
        { 
            label: "Active Zones", 
            value: items.activeZonesCount || 0, 
            stats: 'Occupancy', 
            color: "bg-pink-600", 
            bg: "bg-pink-50", 
            icon: <TrendingUp size={22} className="text-pink-600" />,
            percent: 60 
        },
    ];

    return (
        <div className="bg-[#F9FAFB] p-4 lg:p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row items-stretch gap-8">
                {/* Left Column (Clock & Notices) */}
                <div className="w-full lg:max-w-xs space-y-6">
                    <div className="px-2">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                            <p className="text-[10px] font-mono font-bold text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mt-1">{nameSum} <span className="text-orange-500">.</span></h1>
                    </div>
                    
                    <div className="p-4 rounded-[1.5rem] border border-rose-100 bg-white shadow-sm shadow-rose-50">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-rose-50">⚠️</div>
                            <p className="text-xs font-bold leading-relaxed text-rose-700">
                                {items.outOfStockCount || 0} critical SKUs currently unavailable. Restock required.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {summaryData.map((item, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-48 active:scale-95 border-b-4" style={{ borderBottomColor: item.isWarning ? '#f43f5e' : '#e2e8f0' }}>
                            <div className="flex justify-between items-start">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center`}>{item.icon}</div>
                                <div className="bg-slate-50 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">{item.stats}</div>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className={`${item.color} h-full transition-all duration-1000 ease-out`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WareHouseSummaryCard;