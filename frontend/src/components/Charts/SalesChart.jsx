import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Calendar, ChevronDown } from 'lucide-react';

const SalesChart = () => {
    // 1. Time Range & Dropdown State
    const [range, setRange] = useState(7); // Default 7 days
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

    // 2. Dynamic Data Generator (Candlestick format: [Open, High, Low, Close])
    const chartSeries = useMemo(() => {
        const baseTime = new Date().getTime() - (range * 86400000);
        const data = Array.from({ length: range }, (_, i) => {
            const open = Math.floor(Math.random() * (7000 - 6000) + 6000);
            const close = Math.floor(Math.random() * (7000 - 6000) + 6000);
            const high = Math.max(open, close) + Math.floor(Math.random() * 50);
            const low = Math.min(open, close) - Math.floor(Math.random() * 50);

            return {
                x: new Date(baseTime + (i * 86400000)), 
                y: [open, high, low, close]
            };
        });

        return [{ data }];
    }, [range]);

    // ApexChart Configurations
    const chartOptions = {
        chart: {
            type: 'candlestick',
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
            animations: { enabled: true, easing: 'easeinout', speed: 800 }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                formatter: (val) => `₹${val.toLocaleString()}`,
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 }
            }
        },
        grid: {
            borderColor: '#f8fafc',
            strokeDashArray: 4,
            padding: { left: 10, right: 10 }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#3b82f6', 
                    downward: '#f43f5e' 
                },
                wick: { useFillColor: true }
            }
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
                const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
                const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
                const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
                return `
                    <div style="background: #000000; color: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid #334155; font-family: Inter, sans-serif; min-width: 140px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
                        <div style="font-weight: 900; font-size: 10px; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 5px; color: #60a5fa; letter-spacing: 1px;">MARKET DATA</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                            <span style="color: #94a3b8;">Open:</span>
                            <span style="font-weight: 700; margin-left: 15px;">₹${o.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                            <span style="color: #94a3b8;">High:</span>
                            <span style="font-weight: 700; color: #10b981; margin-left: 15px;">₹${h.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                            <span style="color: #94a3b8;">Low:</span>
                            <span style="font-weight: 700; color: #f43f5e; margin-left: 15px;">₹${l.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px;">
                            <span style="color: #94a3b8;">Close:</span>
                            <span style="font-weight: 700; margin-left: 15px;">₹${c.toLocaleString()}</span>
                        </div>
                    </div>
                `;
            }
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 flex flex-col h-[600px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Price Movement</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        Inventory Valuation Analytics
                    </p>
                </div>

                {/* Time Range Selector Dropdown */}
                <div className="relative" ref={rangeRef}>
                    <button
                        onClick={() => setShowRangeMenu(!showRangeMenu)}
                        className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Calendar size={14} className="text-blue-500" />
                        <span>Last {range} Days</span>
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
                            {[5, 10, 30, 90].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => {
                                        setRange(d);
                                        setShowRangeMenu(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group/item ${
                                        range === d ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                        {d === 90 ? 'Last Quarter' : `Last ${d} Days`}
                                    </span>
                                    {range === d && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Headline Stats */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">₹6,695.00</span>
                    <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        ↑ 12.5%
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[300px] w-full">
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="candlestick"
                    height="100%"
                />
            </div>

            {/* Legend Section */}
            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price Up</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price Down</span>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;