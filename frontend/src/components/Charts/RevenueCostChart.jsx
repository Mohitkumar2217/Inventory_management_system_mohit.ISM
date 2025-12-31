import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-4 rounded-[1rem] shadow-2xl border border-slate-700 backdrop-blur-md bg-opacity-90">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold flex justify-between gap-4">
            <span className="text-blue-400">Sales:</span> 
            <span>₹{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm font-bold flex justify-between gap-4">
            <span className="text-emerald-400">Margin:</span> 
            <span>{payload[1].value}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const [days, setDays] = useState(7); // Default to 7 days (as per your initial UI)

  // Generate dynamic data based on the selected time range
  const dynamicData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: days }, (_, i) => ({
      name: days <= 10 ? `Day ${i + 1}` : months[i % 12], // Use names for small ranges, months for 30
      sales: Math.floor(Math.random() * 3000) + 1000,
      margin: Math.floor(Math.random() * 30) + 20,
    }));
  }, [days]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 flex flex-col h-[600px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full mb-2 inline-block">PERFORMANCE HUB</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sales Analytics</h2>
          <p className="text-slate-500 text-xs font-medium">Revenue vs Profit Margin trends</p>
        </div>
        <div className="flex gap-2">
            <select 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value={5}>Last 5 Days</option>
              <option value={10}>Last 10 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dynamicData} margin={{ top: 10, right: -10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
              dy={15}
            />
            
            <YAxis yAxisId="left" orientation="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />
            
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc', radius: 10}} />
            
            {/* Sales Bars - radius property preserved */}
            <Bar 
              yAxisId="left"
              dataKey="sales" 
              fill="url(#barGradient)" 
              radius={[12, 12, 12, 12]} 
              barSize={days > 10 ? 12 : 32} // Thinner bars for 30-day view
            />
            
            {/* Margin Line */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="margin" 
              stroke="#0f172a" 
              strokeWidth={3}
              dot={days <= 10 ? { r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 } : false}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend Footer */}
      <div className="mt-6 flex gap-6 border-t border-slate-50 pt-6">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-900"></div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Margin %</span>
          </div>
      </div>
    </div>
  );
};

export default RevenueChart;