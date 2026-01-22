import React from "react";
import {
  ArrowLeft, IndianRupee, Truck, Activity, Hash, MapPin, 
  Calendar, Tag, Box, Clock, CheckCircle, Package, XCircle, Loader2, Layers
} from "lucide-react";

export default function OrderDetailPage({ 
    selectedOrder, 
    showTracking, 
    setShowTracking, 
    onBack 
}) {

    // --- HELPER: CALCULATE REMAINING DAYS ---
    const getRemainingDays = (expectedDate) => {
        if (!expectedDate) return 0;
        const diff = new Date(expectedDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    // --- HELPER: PRIORITY BADGE COMPONENT ---
    const PriorityBadge = ({ priority }) => {
        const styles = { 
            standard: "bg-slate-100 text-slate-600", 
            urgent: "bg-amber-100 text-amber-600", 
            critical: "bg-rose-100 text-rose-600" 
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[priority] || styles.standard}`}>
                {priority}
            </span>
        );
    };

    return (
        <div className="animate-in fade-in duration-700">
            {/* --- HEADER ACTIONS --- */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
                    <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div> Back
                </button>
                <button
                    onClick={() => setShowTracking(!showTracking)}
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl active:scale-95 ${showTracking ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}
                >
                    {showTracking ? <XCircle size={18} /> : <Truck size={18} />}
                    {showTracking ? "Exit Tracker" : "Track Order Live"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-2 space-y-8">
                    {showTracking ? (
                        /* --- LIVE TRACKER UI --- */
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-indigo-50 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                                        <Activity className="text-indigo-500 animate-pulse" size={28} />
                                        Transit Status
                                    </h2>
                                    <p className="text-indigo-500 font-bold text-xs uppercase mt-1">ID: <span className="font-mono">{selectedOrder.trackingId || 'TRK-GEN-99'}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                                    <p className="text-xl font-black text-slate-800">{getRemainingDays(selectedOrder.expectedDate)} Days Left</p>
                                </div>
                            </div>

                            {/* --- PROGRESS STEPPER --- */}
                            <div className="flex justify-between relative mb-24 px-4">
                                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
                                <div
                                    className="absolute top-1/2 left-0 h-1.5 bg-indigo-500 -translate-y-1/2 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ width: selectedOrder.status === 'Delivered' ? '100%' : selectedOrder.status === 'Shipped' ? '66.6%' : selectedOrder.status === 'Processing' ? '33.3%' : '0%' }}
                                />
                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                    const isActive = selectedOrder.status === step;
                                    const isCompleted = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed'].indexOf(selectedOrder.status) >= i;
                                    return (
                                        <div key={i} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 scale-125 ring-8 ring-indigo-50' : isCompleted ? 'bg-emerald-500' : 'bg-white text-slate-300'}`}>
                                                {isActive ? <Loader2 className="text-white animate-spin" size={24} /> : isCompleted ? <CheckCircle size={24} className="text-white" /> : <div className="w-3 h-3 bg-slate-200 rounded-full" />}
                                            </div>
                                            <div className="absolute -bottom-12 flex flex-col items-center min-w-[100px]">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>{step}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* --- SOURCE & DESTINATION CONTEXT --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase mb-3 tracking-widest flex items-center gap-2"><Truck size={14} /> Origin Supplier</p>
                                    <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600">{selectedOrder.vendorName}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1">{selectedOrder.vendorEmail || 'orders@vendor.com'}</p>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest flex items-center gap-2"><MapPin size={14} /> Destination Hub</p>
                                    <p className="font-black text-slate-800 text-lg group-hover:text-emerald-600">{selectedOrder.warehouse}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1">Zone: {typeof selectedOrder.zone === 'object' ? selectedOrder.zone.name : selectedOrder.zone}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- STANDARD DETAILS UI --- */
                        <>
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
                                <div className="flex flex-col lg:flex-row justify-between items-start mb-10 relative z-10 gap-6">
                                    <div>
                                        <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block tracking-widest">Order Specification</span>
                                        <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{selectedOrder.itemName}</h1>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ref: {selectedOrder.poNumber || selectedOrder._id}</p>
                                            <PriorityBadge priority={selectedOrder.priority} />
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white text-right shadow-xl min-w-[240px]">
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Total Order Value</p>
                                        <p className="text-4xl font-black tracking-tighter">₹{(selectedOrder.totalOrderValue || (selectedOrder.quantity * selectedOrder.unitPrice)).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Truck size={16} className="text-indigo-500" /> Logistics & Destination</h3>
                                        <div className="space-y-4">
                                            <DetailRow label="Warehouse" value={selectedOrder.warehouse} />
                                            <DetailRow label="Shipping Method" value={selectedOrder.shippingMethod} />
                                            <DetailRow label="Delivery Address" value={selectedOrder.deliveryAddress} />
                                            <DetailRow label="Expected ETA" value={selectedOrder.expectedDate ? new Date(selectedOrder.expectedDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : "N/A"} />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><IndianRupee size={16} className="text-amber-500" /> Financial Breakdown</h3>
                                        <div className="space-y-4">
                                            <DetailRow label="Unit Cost" value={`₹${selectedOrder.unitPrice}`} />
                                            <DetailRow label="Quantity" value={selectedOrder.quantity} />
                                            <DetailRow label="Tax Rate" value={`${selectedOrder.taxRate || 0}%`} />
                                            <DetailRow label="Discount" value={`₹${selectedOrder.discount || 0}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Tag size={16} className="text-emerald-500" /> Business Context</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <DetailRow label="Primary Supplier" value={selectedOrder.vendorName} />
                                    <DetailRow label="Supplier Email" value={selectedOrder.vendorEmail || "N/A"} />
                                    <DetailRow label="Asset Category" value={selectedOrder.category} />
                                </div>
                            </div>
                            <div className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100/50 relative">
                                <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Internal Notes</div>
                                <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{selectedOrder.notes || 'No specific notes recorded.'}"</p>
                            </div>
                        </>
                    )}
                </div>

                {/* --- SIDEBAR: STATUS & ALLOCATION --- */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commitment</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Calendar size={18} className="text-slate-400" /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase">Target Date</p>
                                        <p className="text-xs font-bold text-slate-300">
                                            {selectedOrder.expectedDate ? new Date(selectedOrder.expectedDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Clock size={18} className="text-slate-400" /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase">Assigned Duration</p>
                                        <p className="text-xs font-bold text-slate-300">{selectedOrder.estimatedDuration || 7} Working Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={200} />
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} className="text-indigo-400" /> Fulfillment Status</h3>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${selectedOrder.status === 'Completed' || selectedOrder.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Current Stage</p><p className="text-sm font-black text-slate-700 uppercase">{selectedOrder.status}</p></div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Allocation</h3>
                        <DetailRow label="Assigned Zone" value={typeof selectedOrder.zone === 'object' ? selectedOrder.zone?.name : selectedOrder.zone || "N/A"} />
                        <div className="mt-4 pt-4 border-t border-slate-200"><DetailRow label="Warehouse Contact" value={selectedOrder.whContact || "N/A"} /></div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Inventory SKU</h3>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-4 flex items-center gap-3">
                                <Package className="text-indigo-400" size={24} />
                                <p className="text-xl font-black tracking-widest uppercase">{selectedOrder.sku || 'NO-SKU'}</p>
                            </div>
                        </div>
                        <Layers className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={150} />
                    </div>
                </div>
            </div>
            <Layers className="absolute -right-20 -bottom-20 text-slate-50 rotate-12" size={400} />
        </div>
    );
}

// --- HELPER COMPONENTS ---
function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold text-slate-700">{value || "N/A"}</span>
        </div>
    );
}