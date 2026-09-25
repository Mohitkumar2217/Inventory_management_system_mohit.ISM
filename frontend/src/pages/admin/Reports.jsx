import React from "react";
import PageTitle from "../../components/PageTitle";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { 
  FileText, TrendingUp, Users, Truck, ShoppingCart, 
  Package, Warehouse, Download, Sparkles
} from "lucide-react";

// --- MOCK DATA FOR ALL MODULES ---
const salesData = [
  { name: "Mon", orders: 40, revenue: 2400 },
  { name: "Tue", orders: 30, revenue: 1398 },
  { name: "Wed", orders: 60, revenue: 3800 },
  { name: "Thu", orders: 45, revenue: 3908 },
  { name: "Fri", orders: 90, revenue: 4800 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Beauty", value: 300 },
  { name: "Grocery", value: 300 },
  { name: "Home", value: 200 },
];

const warehouseUtilization = [
  { name: "Zone A", used: 80, empty: 20 },
  { name: "Zone B", used: 45, empty: 55 },
  { name: "Zone C", used: 90, empty: 10 },
  { name: "Zone D", used: 30, empty: 70 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

export default function Reports() {

  // --- EXPORT LOGIC ---
  const handleExport = () => {
    // 1. Prepare the data for export (flattening/combining mock data)
    const exportData = salesData.map(item => ({
      Day: item.name,
      Orders: item.orders,
      Revenue: `₹${item.revenue}`,
      SystemStatus: "Optimal"
    }));

    // 2. Create CSV Header and Content
    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData.map(row => Object.values(row).join(",")).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

    // 3. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Performance_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-2 md:p-4 font-sans animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <PageTitle>Analytics & Intelligence</PageTitle>
            <p className="text-slate-400 text-sm font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
              <FileText size={14} className="text-blue-500" /> System Performance Report
            </p>
          </div>
          <div className="flex gap-3">
             {/* <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <Sparkles size={16} className="text-amber-500" /> AI Insights
             </button> */}
             {/* ACTIVATED EXPORT BUTTON */}
             <button 
                onClick={handleExport}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-slate-800"
             >
                <Download size={16} /> Export Data
             </button>
          </div>
        </div>

        {/* --- REPORT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Charts remain the same as your provided code */}
          <ReportCard 
            title="Order Velocity" 
            subtitle="Sales Performance" 
            icon={<ShoppingCart className="text-blue-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard 
            title="Stock Segregation" 
            subtitle="Category Breakdown" 
            icon={<Package className="text-emerald-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
               {categoryData.map((cat, i) => (
                 <div key={i} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{cat.name}</span>
                 </div>
               ))}
            </div>
          </ReportCard>

          <ReportCard 
            title="Storage Density" 
            subtitle="Zone Capacity" 
            icon={<Warehouse className="text-orange-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={warehouseUtilization} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="used" fill="#f97316" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard 
            title="Partner Reliability" 
            subtitle="Delivery Accuracy" 
            icon={<Truck className="text-indigo-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 3, stroke: '#6366f1'}} />
              </LineChart>
            </ResponsiveContainer>
          </ReportCard>

          <ReportCard 
            title="Team Activity" 
            subtitle="Task Completion" 
            icon={<Users className="text-pink-500" />}
          >
            <div className="space-y-6 flex flex-col justify-center h-full">
              <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Avg</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">94.2%</p>
                </div>
                <div className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">+2.4%</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-full w-[94.2%] transition-all duration-1000 ease-out" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic text-center">Efficiency is up by 2.4% compared to last week.</p>
            </div>
          </ReportCard>

          <ReportCard 
            title="Valuation Forecast" 
            subtitle="Financial Health" 
            icon={<TrendingUp className="text-cyan-500" />}
          >
            <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden h-full flex flex-col justify-center shadow-2xl shadow-indigo-200">
              <div className="relative z-10">
                <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Projected Valuation</h3>
                <p className="text-white text-4xl font-black mb-6 tracking-tighter">₹ 14.8M</p>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Fiscal Q1 2026
                    </div>
                </div>
              </div>
              <TrendingUp className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={160} />
            </div>
          </ReportCard>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden min-h-[380px] flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
            {React.cloneElement(icon, { size: 22 })}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">{title}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}