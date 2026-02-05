 import React from 'react';
import { FaBox, FaTruckLoading, FaHistory, FaCheckCircle } from 'react-icons/fa';

const StatCard = ({ title, value, label, icon, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}>{icon}</div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
    </div>
);

const WarehouseDashboard = () => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Warehouse Central</h1>
                <p className="text-slate-500 font-medium">Real-time logistics and inventory overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Products" value="1,284" label="Inventory" icon={<FaBox />} color="bg-blue-600" />
                <StatCard title="Inbound Shipments" value="12" label="Logistics" icon={<FaTruckLoading />} color="bg-emerald-500" />
                <StatCard title="Pending Orders" value="48" label="Sales" icon={<FaHistory />} color="bg-amber-500" />
                <StatCard title="Stock Safety" value="98%" label="Quality" icon={<FaCheckCircle />} color="bg-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Live Movement Feed</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-sm font-bold text-slate-700">Stock In: SKU-8829 (Electronics)</span>
                                </div>
                                <span className="text-xs font-medium text-slate-400">14:20 PM</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseDashboard;