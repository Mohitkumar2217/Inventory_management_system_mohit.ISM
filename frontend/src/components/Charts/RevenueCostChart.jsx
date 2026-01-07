import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { Calendar, ChevronDown } from 'lucide-react'; // Ensure lucide-react is installed

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
  const [days, setDays] = useState(7);
  const [showRangeMenu, setShowRangeMenu] = useState(false);
  const rangeRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target)) {
        setShowRangeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate dynamic data based on the selected time range
  const dynamicData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: days }, (_, i) => ({
      name: days <= 10 ? `Day ${i + 1}` : months[i % 12],
      sales: Math.floor(Math.random() * 3000) + 1000,
      margin: Math.floor(Math.random() * 30) + 20,
    }));
  }, [days]);

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-8 flex flex-col h-[600px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">

      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full mb-2 inline-block uppercase tracking-wider">Performance Hub</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sales Analytics</h2>
          <p className="text-slate-500 text-xs font-medium">Revenue vs Profit Margin trends</p>
        </div>

        {/* Time Range Selector Dropdown (SalesChart Style) */}
        <div className="relative" ref={rangeRef}>
          <button
            onClick={() => setShowRangeMenu(!showRangeMenu)}
            className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <Calendar size={14} className="text-blue-500" />
            <span>Last {days} Days</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 ${showRangeMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Content */}
          {showRangeMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 p-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 border-b border-slate-50 mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Interval</span>
              </div>
              {[5, 10, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDays(d);
                    setShowRangeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    days === d 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Last {d} Days
                  </span>
                  {days === d && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dynamicData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
              dy={15}
            />

            <YAxis yAxisId="left" orientation="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 10 }} />

            <Bar
              yAxisId="left"
              dataKey="sales"
              fill="url(#barGradient)"
              radius={[12, 12, 12, 12]}
              barSize={days > 10 ? 12 : 32}
            />

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

      {/* Legend Footer */}
      <div className="mt-6 flex gap-6 border-t border-slate-50 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-900 shadow-[0_0_8px_rgba(15,23,42,0.4)]"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Margin %</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;