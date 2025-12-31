import React from "react";
import PageTitle from "../../components/PageTitle";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { 
  FileText, TrendingUp, Users, Truck, ShoppingCart, 
  Package, Warehouse, Download 
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
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <PageTitle>Analytics & Intelligence</PageTitle>
            <p className="text-slate-400 text-sm font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
              <FileText size={14} className="text-blue-500" /> System Performance Report
            </p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all">
            <Download size={16} /> Export Data
          </button>
        </div>

        {/* --- REPORT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. ORDER & REVENUE TREND (Orders Module) */}
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </ReportCard>

          {/* 2. INVENTORY DISTRIBUTION (Products Module) */}
          <ReportCard 
            title="Stock Segregation" 
            subtitle="Category Breakdown" 
            icon={<Package className="text-emerald-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
               {categoryData.map((cat, i) => (
                 <div key={i} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                   <span className="text-[10px] font-bold text-slate-400">{cat.name}</span>
                 </div>
               ))}
            </div>
          </ReportCard>

          {/* 3. WAREHOUSE UTILIZATION (Warehouse Module) */}
          <ReportCard 
            title="Storage Density" 
            subtitle="Zone Capacity" 
            icon={<Warehouse className="text-orange-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={warehouseUtilization} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="used" fill="#f97316" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ReportCard>

          {/* 4. SUPPLIER RELIABILITY (Suppliers Module) */}
          <ReportCard 
            title="Partner Reliability" 
            subtitle="Delivery Accuracy" 
            icon={<Truck className="text-indigo-500" />}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Line type="stepAfter" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </ReportCard>

          {/* 5. STAFF PRODUCTIVITY (Staff Module) */}
          <ReportCard 
            title="Team Activity" 
            subtitle="Task Completion" 
            icon={<Users className="text-pink-500" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-2xl font-black text-slate-800">94.2%</p>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+2.4% Up</p>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full w-[94%] transition-all duration-1000" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">Average staff task completion rate this week.</p>
            </div>
          </ReportCard>

          {/* 6. GROWTH KPI (Valuation) */}
          <ReportCard 
            title="Valuation Forecast" 
            subtitle="Financial Health" 
            icon={<TrendingUp className="text-cyan-500" />}
          >
            <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col justify-center">
              <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">Projected ROI</h3>
              <p className="text-white text-3xl font-black mb-4">₹ 14.8M</p>
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Fiscal Year 2025
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 rotate-12" size={120} />
            </div>
          </ReportCard>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: REPORT CARD ---
function ReportCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden min-h-[350px] flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
            {icon}
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