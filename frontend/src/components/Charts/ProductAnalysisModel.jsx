import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductAnalysisModal = ({ isOpen, onClose, item, isInventory }) => {
    if (!isOpen || !item) return null;

    // Mock data based on the card's label
    const data = [
        { name: 'Mon', val: 400 },
        { name: 'Tue', val: 300 },
        { name: 'Wed', val: 600 },
        { name: 'Thu', val: 800 },
        { name: 'Fri', val: 500 },
        { name: 'Sat', val: 900 },
        { name: 'Sun', val: 700 },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 flex justify-between items-start border-b border-slate-50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`${item.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{item.label}</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Performance Analysis</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-slate-100 hover:bg-rose-50 hover:text-rose-500 text-slate-400 p-2 rounded-xl transition-colors font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Graph Body */}
                <div className="p-8">
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{item.value}</span>
                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${item.label.includes("Cancelled") ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"}`}>
                            {item.stats} Growth
                        </span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={item.label.includes("Cancelled") ? "#fb7185" : "#3b82f6"} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={item.label.includes("Cancelled") ? "#fb7185" : "#3b82f6"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke={item.label.includes("Cancelled") ? "#fb7185" : "#3b82f6"} 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorVal)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="grid grid-cols-3 border-t border-slate-50 bg-slate-50/50">
                    <div className="p-6 text-center border-r border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target</p>
                        <p className="text-sm font-black text-slate-700">92%</p>
                    </div>
                    <div className="p-6 text-center border-r border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                        <p className="text-sm font-black text-emerald-500 underline underline-offset-4">Healthy</p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Forecast</p>
                        <p className="text-sm font-black text-slate-700">+12%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAnalysisModal;