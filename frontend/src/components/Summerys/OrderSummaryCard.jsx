import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, PackageSearch, TrendingUp } from 'lucide-react';
import OrderAnalysisModal from '../Charts/OrderAnalysisModel.jsx';

const OrderSummaryCard = ({ items = {}, nameSum, notices }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    // --- FEATURE: Real-time clock for "System Management" feel ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOpenModal = (item) => {
        setSelectedCard(item);
        setIsModalOpen(true);
    };

    const summaryData = [
        {
            label: "Total Revenue",
            value: `₹${(items.totalRevenue || 0).toLocaleString('en-IN')}`,
            stats: 'Growth', // You can calculate growth vs last month on backend
            color: "bg-pink-600", bg: "bg-pink-50", icon: "💰",
            percent: 90
        },
        {
            label: "Total Orders",
            value: items.totalProducts || 0,
            stats: items.totalProducts > 0 ? `${Math.round((items.totalOrders / items.totalProducts) * 100)}%` : '0%',
            color: "bg-blue-600", bg: "bg-blue-50", icon: "📥",
            percent: 85
        },
        {
            label: "Avg. Fulfillment",
            value: items.avgFulfillment ? `${items.avgFulfillment} hrs` : 'N/A',
            stats: '-2h',
            color: "bg-indigo-600", bg: "bg-indigo-50",
            icon: <Clock size={22} className="text-indigo-600" />,
            percent: 60
        },
        {
            label: "Order Accuracy",
            value: items.accuracyRate || "0%",
            stats: 'Live',
            color: "bg-emerald-600", bg: "bg-emerald-50",
            icon: <CheckCircle size={22} className="text-emerald-600" />,
            percent: parseFloat(items.accuracyRate) || 0
        },
        {
            label: "Backorder Volume",
            value: items.backorderCount || 0,
            stats: items.backorderCount > 10 ? 'High' : 'Stable',
            color: "bg-orange-600", bg: "bg-orange-50",
            icon: <PackageSearch size={22} className="text-orange-600" />,
            isWarning: (items.backorderCount > 5),
            percent: items.totalProducts > 0 ? (items.backorderCount / items.totalProducts) * 100 : 0
        },
        {
            label: "Pending Action",
            value: items.totalStock || 0,
            stats: 'Active',
            color: "bg-cyan-600", bg: "bg-cyan-50", icon: "🏢",
            percent: 40
        },
    ];
    return (
        <div className="bg-[#F9FAFB] p-4 lg:p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row items-stretch gap-8">

                {/* Left Column: UNTOUCHED - ORIGINAL DESIGN */}
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
                            <div
                                key={notice.id}
                                className={`p-4 rounded-[1.5rem] border shadow-sm transition-all hover:shadow-md ${notice.type === 'urgent'
                                    ? 'bg-white border-rose-100 text-rose-700'
                                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-100'
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

                        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group mt-4">
                            <div className="relative z-10">
                                <h4 className="text-xs font-black mb-1 uppercase tracking-wider text-cyan-400">Inventory AI</h4>
                                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Predict low stock before it happens.</p>
                                <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-white/10">
                                    Activate
                                </button>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-20 text-5xl group-hover:rotate-12 transition-transform duration-700">
                                🔮
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Grid of 6 Cards (Updated with Logistics) */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaryData.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleOpenModal(item)}
                            className="cursor-pointer bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm group hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative border-b-4 flex flex-col justify-between h-48 active:scale-95"
                            style={{ borderBottomColor: item.isWarning ? '#f59e0b' : '#e2e8f0' }}
                        >
                            <div className="flex justify-between items-start">
                                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className={`items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${item.isWarning ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        <TrendingUp size={10} className="mr-0.5" /> {item.stats}
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 mt-1 transition-opacity">View Details</span>
                                </div>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
                            </div>

                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className={`${item.color} h-full transition-all duration-1000 ease-out`} style={{ width: item.stats.includes('%') ? item.stats : '75%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <OrderAnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedCard} />
        </div>
    );
};

export default OrderSummaryCard;