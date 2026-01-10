import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const OrderAnalysisModal = ({ isOpen, onClose, item }) => {
    const { token } = useAuth();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && item) {
            fetchTrendData();
        }
    }, [isOpen, item]);

    const fetchTrendData = async () => {
        setChartData([]); // Clear previous data
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/api/orders/analysis/trends?type=${item.label}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setChartData(res.data.chartData);
            }
        } catch (err) {
            console.error("Trend fetch error", err);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen || !item) return null;

    const isNegative = item.label.includes("Cancelled") || item.isWarning;
    const themeColor = isNegative ? "#f43f5e" : "#6366f1";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Section */}
                <div className="p-8 flex justify-between items-start border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.label}</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Logistics Insight</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-slate-100 hover:bg-rose-50 hover:text-rose-500 text-slate-400 w-10 h-10 rounded-xl transition-all flex items-center justify-center font-bold">✕</button>
                </div>

                {/* Body Content */}
                <div className="p-8">
                    <div className="flex items-baseline gap-3 mb-8">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{item.value}</span>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${isNegative ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}`}>
                            {item.stats} Efficiency
                        </span>
                    </div>

                    <div className="h-64 w-full flex items-center justify-center">
                        {loading ? (
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.length > 0 ? chartData : [{ name: '...', val: 0 }]}>
                                    <defs>
                                        <linearGradient id="orderColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }} />
                                    <Area type="monotone" dataKey="val" stroke={themeColor} strokeWidth={4} fillOpacity={1} fill="url(#orderColor)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Footer Insight Grid */}
                <div className="grid grid-cols-3 border-t border-slate-50 bg-slate-50/30">
                    <FooterDetail label="Weekly Goal" val="88.5%" />
                    <FooterDetail label="Health" val={isNegative ? "Alert" : "Optimal"} color={isNegative ? "text-rose-500" : "text-emerald-500"} isNegative={isNegative} />
                    <FooterDetail label="Next Run" val="+18%" />
                </div>
            </div>
        </div>
    );
};

const FooterDetail = ({ label, val, color = "text-slate-800", isNegative }) => (
    <div className="p-8 text-center border-r border-slate-50 hover:bg-white transition-colors last:border-r-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center justify-center gap-1.5">
            {label === "Health" && <div className={`w-2 h-2 rounded-full animate-pulse ${isNegative ? 'bg-rose-500' : 'bg-emerald-500'}`} />}
            <p className={`text-lg font-black ${color}`}>{val}</p>
        </div>
    </div>
);

export default OrderAnalysisModal;