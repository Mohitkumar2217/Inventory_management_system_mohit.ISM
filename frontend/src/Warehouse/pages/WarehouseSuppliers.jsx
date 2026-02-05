import React from 'react';
import { FaGlobe, FaPhone } from 'react-icons/fa';

const WarehouseSuppliers = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Supplier Directory</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FaGlobe size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-1">Logistics Pro Ltd.</h3>
                        <p className="text-slate-400 text-sm font-medium mb-6">International Shipping Partner</p>
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                <FaPhone className="text-blue-600" /> +1 (888) 990-202{i}
                            </div>
                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">Contact Partner</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseSuppliers;