import React from 'react';

const WarehouseStaff = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Personnel Management</h1>
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-black text-slate-500">M{i}</div>
                            <div>
                                <p className="font-bold text-slate-800">Michael Stevenson</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Shift Supervisor</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WarehouseStaff;