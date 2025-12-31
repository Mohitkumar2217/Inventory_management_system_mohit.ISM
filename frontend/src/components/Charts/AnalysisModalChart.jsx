import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiX } from 'react-icons/fi';

const AnalysisModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Mock data for the graph - in a real app, you'd fetch this based on data.label
  const graphData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{data.icon}</span>
              <h3 className="text-2xl font-black text-slate-900">{data.label} Analysis</h3>
            </div>
            <p className="text-slate-500 text-sm font-medium">Performance overview for the last 7 days</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Graph Section */}
        <div className="p-8">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={data.isWarning ? "#f97316" : "#3b82f6"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={data.isWarning ? "#f97316" : "#3b82f6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={data.isWarning ? "#f97316" : "#3b82f6"} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Avg Growth</p>
              <p className="text-lg font-black text-slate-900">{data.trend}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Current</p>
              <p className="text-lg font-black text-slate-900">{data.value}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
              <p className={`text-lg font-black ${data.isWarning ? 'text-orange-500' : 'text-emerald-500'}`}>Healthy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;