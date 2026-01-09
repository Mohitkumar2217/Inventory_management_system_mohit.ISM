import React from 'react';
import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, AlertCircle, Globe, TrendingUp, PackageCheck } from 'lucide-react';

const SupplierSummaryCard = ({ items = {}, nameSum }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // --- FEATURE: Real-time clock for "System Management" feel ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Process incoming data with supplier-specific fallbacks
    const totalPartners = items.totalPartners || 0;
    const verifiedPartners = items.verifiedPartners || 0;
    const activePartners = items.activePartners || 0;
    const pendingVerification = items.pendingVerification || 0;
    const totalSkuVolume = items.totalSkuVolume || 0;
    const summaryData = [
        { label: "Total Partners", value: totalPartners, stats: 'Network', color: "bg-green-600", bg: "bg-green-50", icon: <Globe size={22} className="text-green-600" /> },
        { label: "Verified Status", value: verifiedPartners, stats: 'Secure', color: "bg-blue-600", bg: "bg-blue-50", icon: <ShieldCheck size={22} className="text-blue-600" /> },
        { label: "Active Today", value: activePartners, stats: 'Live', color: "bg-emerald-600", bg: "bg-emerald-50", icon: <Truck size={22} className="text-emerald-600" /> },
        { label: "Pending Audit", value: pendingVerification, stats: 'Review', color: "bg-amber-600", bg: "bg-amber-50", icon: <AlertCircle size={22} className="text-amber-600" />, isWarning: true },
        { label: "Total SKU Vol.", value: totalSkuVolume.toLocaleString(), stats: 'Capacity', color: "bg-indigo-600", bg: "bg-indigo-50", icon: <PackageCheck size={22} className="text-indigo-600" /> },
        { label: "Supply Growth", value: "+12%", stats: 'Monthly', color: "bg-pink-600", bg: "bg-pink-50", icon: "📈" },
    ];

    const notices = [
        { id: 1, text: `${pendingVerification} vendors require documentation renewal.`, type: "urgent" },
        { id: 2, text: "Global Tech PVT updated their warehouse capacity.", type: "promo" },
    ];

    return (
        <div className="bg-[#F9FAFB] p-4 lg:p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row items-stretch gap-8">

                {/* Left Column: Management Suite (Matches your style exactly) */}
                <div className="w-full lg:max-w-xs space-y-6">
                    <div className="px-2">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                            {/* FEATURE: Live System Time */}
                            <p className="text-[10px] font-mono font-bold text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mt-1">
                            {nameSum} <span className="text-green-600">.</span>
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className={`p-4 rounded-[1.5rem] border shadow-sm transition-all hover:shadow-md ${notice.type === 'urgent'
                                    ? 'bg-white border-rose-100 text-rose-700'
                                    : 'bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-green-100'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg ${notice.type === 'urgent' ? 'bg-rose-50' : 'bg-white/20'}`}>
                                        {notice.type === 'urgent' ? '⚠️' : '📢'}
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">{notice.text}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group mt-4 shadow-xl">
                            <div className="relative z-10">
                                <h4 className="text-xs font-black mb-1 uppercase tracking-wider text-green-400">Partner AI</h4>
                                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Analyzing lead times across 15 vendors.</p>
                                <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-white/10">
                                    Audit Performance
                                </button>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-20 text-5xl group-hover:rotate-12 transition-transform duration-700">
                                🤝
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Supplier Metrics Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {summaryData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative border-b-4 flex flex-col justify-between h-48 active:scale-95 cursor-pointer"
                            style={{ borderBottomColor: item.isWarning ? '#f59e0b' : '#e2e8f0' }}
                        >
                            <div className="flex justify-between items-start">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${item.isWarning ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    <TrendingUp size={10} className="mr-0.5" /> {item.stats}
                                </div>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
                            </div>

                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                                <div
                                    className={`${item.color} h-full transition-all duration-1000 ease-out`}
                                    style={{ width: '75%' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupplierSummaryCard;