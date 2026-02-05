import React from 'react';

export const WarehouseReports = () => (
    <div className="p-12 bg-white rounded-[3rem] text-center border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Logistics Analytics</h2>
        <p className="text-slate-500 mb-8">Generated monthly reports for warehouse efficiency.</p>
        <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Download PDF</button>
            <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">View CSV</button>
        </div>
    </div>
);

export const WarehouseSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Warehouse Configuration</h1>
        <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50">
            {['Inbound Notifications', 'Low Stock Alerts', 'Staff Messaging'].map(setting => (
                <div key={setting} className="p-6 flex items-center justify-between">
                    <span className="font-bold text-slate-700">{setting}</span>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                </div>
            ))}
        </div>
    </div>
);