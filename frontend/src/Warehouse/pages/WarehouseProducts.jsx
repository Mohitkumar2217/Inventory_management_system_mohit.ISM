import React from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const WarehouseProducts = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Product Catalog</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all">
                    <FaPlus /> Add New SKU
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by name, SKU, or category..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20" />
                    </div>
                    <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"><FaFilter /></button>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Product Details</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800 text-sm">Industrial Compressor V{i}</p>
                                    <p className="text-xs text-slate-400">Heavy Machinery</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">IND-992{i}</td>
                                <td className="px-6 py-4 text-sm font-black text-slate-700">240 Units</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase">In Stock</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehouseProducts;