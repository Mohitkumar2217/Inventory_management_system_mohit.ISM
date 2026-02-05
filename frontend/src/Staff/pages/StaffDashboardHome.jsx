import React from 'react';
import { FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white text-xl shadow-lg`}>
      {icon}
    </div>
  </div>
);

const StaffDashboardHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Staff Overview</h1>
        <p className="text-slate-500 font-medium">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned Tasks" value="12" icon={<FaClipboardList />} color="bg-blue-600" />
        <StatCard title="Completed" value="08" icon={<FaCheckCircle />} color="bg-emerald-500" />
        <StatCard title="Pending" value="04" icon={<FaClock />} color="bg-amber-500" />
        <StatCard title="Issues" value="01" icon={<FaExclamationTriangle />} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activities</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">ST</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold text-sm">Stock count completed for A-Section</p>
                <p className="text-slate-400 text-xs">2 hours ago • Warehouse Sector 4</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">Success</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardHome;