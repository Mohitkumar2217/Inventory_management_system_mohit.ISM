import React, { useState } from "react";
import VisualBarCode from "../../components/Lists/VisualBarCode.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, IndianRupee, ChevronLeft, ChevronRight,
  Layers, Loader2, Truck, Activity, Hash, MapPin, Calendar, Percent, Tag, Box, Clock, CheckCircle, Warehouse
} from "lucide-react";

export default function ProductDetailPage({ 
    formData, 
    handleDeleteProduct, 
    handleEditDetails, 
    onBack // Replaces setView for better component encapsulation
}) {
    // Internal state for the image carousel
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const handleNextImg = () => {
        if (formData.images?.length > 0) {
            setCurrentImgIndex((prev) => (prev + 1) % formData.images.length);
        }
    };

    const handlePrevImg = () => {
        if (formData.images?.length > 0) {
            setCurrentImgIndex((prev) => (prev - 1 + formData.images.length) % formData.images.length);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* --- TOP NAVIGATION & ACTIONS --- */}
            <div className="flex items-center justify-between mb-8 px-4">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
                    <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div> Back to Registry
                </button>
                <div className="flex gap-3">
                    <button onClick={() => handleDeleteProduct(formData._id)} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20} /></button>
                    <button onClick={() => handleEditDetails(formData)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"><Edit2 size={16} /> Update Registry</button>
                </div>
            </div>

            <div className="bg-white p-8 md:p-14 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10 border-b border-slate-50 pb-12">

                    {/* --- IMAGE SLIDER SECTION --- */}
                    <div className="w-full lg:w-[450px] shrink-0 ">
                        <div className="relative group aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center lg:h-[400px] lg:w-[400px]">
                            {formData.images && formData.images.length > 0 ? (
                                <>
                                    <img
                                        src={formData.images[currentImgIndex]}
                                        alt="Product"
                                        className="w-full h-full object-contain p-4 animate-in fade-in zoom-in-95 duration-300"
                                    />
                                    {formData.images.length > 1 && (
                                        <>
                                            <button onClick={handlePrevImg} className="absolute left-4 p-3 bg-white/80 backdrop-blur rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"><ChevronLeft size={24} /></button>
                                            <button onClick={handleNextImg} className="absolute right-4 p-3 bg-white/80 backdrop-blur rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"><ChevronRight size={24} /></button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Box size={80} className="text-slate-200" />
                            )}
                        </div>
                    </div>

                    {/* --- TITLE & PRIMARY STATS --- */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                            <span className="bg-cyan-50 text-cyan-600 font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{formData.brand}</span>
                            <span className="bg-slate-900 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">SKU: {formData.sku}</span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.stock <= formData.minStock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {formData.status}
                            </span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-4 leading-tight">{formData.name}</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DetailBox label="System Code" val={formData.code} />
                            <DetailBox label="Retail Price" val={`₹${formData.price}`} highlight />
                            <DetailBox label="Live Stock" val={`${formData.stock} ${formData.unit}`} alert={formData.stock <= formData.minStock} />
                            <DetailBox label="Total Sold" val={`${formData.totalSold || 0} Units`} />
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {/* --- LOGISTICS SECTION --- */}
                    <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                        <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest"><Warehouse size={14} className="text-indigo-500" /> Hub Allocation</div>
                        <div className="space-y-4">
                            <DetailItem label="Warehouse Location" value={formData.warehouse || "Not Assigned"} />
                            <DetailItem label="Storage Zone" value={formData.zone || "Global Access"} />
                            <div className="group border-b border-slate-50 pb-3">
                                <DetailItem label="Barcode String" value={formData.barcode || "No Barcode"} />
                                <VisualBarCode value={formData.barcode} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Weight" value={formData.weight || "N/A"} />
                                <DetailItem label="Dimensions" value={formData.dimensions || "N/A"} />
                            </div>
                        </div>
                    </div>

                    {/* --- FINANCIALS SECTION --- */}
                    <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                        <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest"><IndianRupee size={14} className="text-emerald-500" /> Economics</div>
                        <div className="space-y-4">
                            <DetailItem label="Procurement Cost" value={`₹${formData.cost}`} />
                            <DetailItem label="Projected Margin" value={`₹${formData.price - formData.cost}`} />
                            <DetailItem label="Taxation Profile" value={`${formData.taxPercentage || 18}% Applied`} />
                            <DetailItem label="Unit Description" value={formData.unit} />
                        </div>
                    </div>

                    {/* --- PROCUREMENT SIDEBAR --- */}
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6 text-slate-500 uppercase font-black text-[10px] tracking-widest"><Truck size={14} className="text-cyan-400" /> Sourcing</div>
                            <div className="space-y-5">
                                <DetailItemDark label="Primary Supplier" value={formData.supplier} />
                                <DetailItemDark label="Category Dept" value={formData.category} />
                                <DetailItemDark label="Condition" value={formData.condition} />
                                <DetailItemDark label="Expiry Check" value={formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : "Non-Perishable"} />
                            </div>
                        </div>
                        
                        {/* --- MINI TRACKER --- */}
                        <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Stock Status</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${formData.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <p className="text-xs font-bold text-slate-300">{formData.stock > 0 ? 'Available for Distribution' : 'Out of Stock'}</p>
                            </div>
                        </div>
                        <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />
                    </div>
                </div>

                {/* --- NOTES / DIRECTIVES --- */}
                <div className="mt-12 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative group ">
                    <div className="absolute top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">System Directives</div>
                    <p className="text-slate-600 font-bold leading-relaxed italic text-xl opacity-80 relative z-10">"{formData.details || 'No additional logistics directives registered for this asset.'}"</p>
                    <Activity className="absolute right-10 top-2 text-indigo-500/5 group-hover:scale-110 transition-transform" size={100} />
                </div>

                {/* --- VARIANTS DISPLAY --- */}
                {formData.variants && formData.variants.length > 0 && (
                    <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest">
                            <Layers size={14} className="text-indigo-500" /> Asset Variants ({formData.variants.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {formData.variants.map((v, idx) => (
                                <div key={idx} className="bg-slate-50/50 border border-slate-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Tag size={14} className="text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase">SKU: {v.sku || 'N/A'}</span>
                                    </div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">{v.name}</h4>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                                            <span className="text-sm font-black text-slate-900">₹{v.price || formData.price}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock</span>
                                            <span className={`text-sm font-black ${v.stock < 5 ? 'text-rose-500' : 'text-emerald-600'}`}>{v.stock} {formData.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- SHARED UI COMPONENTS ---

function DetailItem({ label, value }) {
  return (
    <div className="group border-b border-slate-50 pb-2">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest transition-colors group-hover:text-indigo-500">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || "N/A"}</p>
    </div>
  );
}

function DetailItemDark({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white">{value || "N/A"}</p>
    </div>
  );
}

function DetailBox({ label, val, highlight = false, alert = false }) {
  return (
    <div className={`p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-md ${alert ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tight ${highlight ? 'text-indigo-600' : alert ? 'text-rose-600' : 'text-slate-800'}`}>
        {val}
      </p>
    </div>
  );
}