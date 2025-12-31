import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrderAnalysisModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    // Mock data for order trends
    const data = [
        { name: 'Mon', val: 450 },
        { name: 'Tue', val: 320 },
        { name: 'Wed', val: 580 },
        { name: 'Thu', val: 890 },
        { name: 'Fri', val: 420 },
        { name: 'Sat', val: 950 },
        { name: 'Sun', val: 680 },
    ];

    // Dynamic color selection based on the card clicked
    const isNegative = item.label.includes("Cancelled") || item.isWarning;
    const themeColor = isNegative ? "#f43f5e" : "#6366f1"; // Rose for alerts, Indigo for orders

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-8 flex justify-between items-start border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.label}</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Order Logistics Analysis</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-slate-100 hover:bg-rose-50 hover:text-rose-500 text-slate-400 w-10 h-10 rounded-xl transition-all flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-8">
                    <div className="flex items-baseline gap-3 mb-8">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{item.value}</span>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${isNegative ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}`}>
                            {item.stats} Efficiency
                        </span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="orderColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                    contentStyle={{ 
                                        borderRadius: '20px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                        padding: '12px' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke={themeColor} 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#orderColor)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Footer Insight Grid */}
                <div className="grid grid-cols-3 border-t border-slate-50 bg-slate-50/30">
                    <div className="p-8 text-center border-r border-slate-50 hover:bg-white transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Weekly Goal</p>
                        <p className="text-lg font-black text-slate-800">88.5%</p>
                    </div>
                    <div className="p-8 text-center border-r border-slate-50 hover:bg-white transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Health</p>
                        <div className="flex items-center justify-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isNegative ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <p className={`text-lg font-black ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {isNegative ? 'Alert' : 'Optimal'}
                            </p>
                        </div>
                    </div>
                    <div className="p-8 text-center hover:bg-white transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Run</p>
                        <p className="text-lg font-black text-slate-800">+18%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderAnalysisModal;