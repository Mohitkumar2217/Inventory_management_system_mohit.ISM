import React from "react";
import { ArrowLeft, Trash2, Edit2, Layers, Percent, ListOrdered, ShieldAlert, Info, Palette, Globe, Calendar, Hash } from "lucide-react";

export default function CategoryDetails({ selectedCategory, setView, deleteCategory, handleEdit }) {
    return (
        <div className="max-w-6xl mx-auto p-6 animate-in slide-in-from-bottom-6 duration-700 pb-20 mt-10">
            <div className="flex items-center justify-between mb-10">
                <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
                    <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
                    Back to Registry
                </button>
                <div className="flex gap-3">
                    <button onClick={() => deleteCategory(selectedCategory._id)} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <Trash2 size={20} />
                    </button>
                    <button onClick={() => handleEdit(selectedCategory)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                        <Edit2 size={16} /> Edit Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                            <div className="w-48 h-48 rounded-[3.5rem] flex items-center justify-center text-white text-8xl shadow-2xl font-black shrink-0 transition-transform hover:scale-105 duration-500" style={{ backgroundColor: selectedCategory.colorCode }}>
                                {selectedCategory.name.charAt(0)}
                            </div>
                            <div className="pt-4 flex-1">
                                <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-2">{selectedCategory.name}</h1>
                                <div className="flex flex-wrap gap-3 mb-10">
                                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedCategory.code}</span>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Layers size={10} /> Group Tier A</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-50 pt-8">
                                    <DetailBox label="Tax Component" value={`${selectedCategory.taxRate}% Rate`} icon={<Percent size={14} />} color="text-indigo-600" />
                                    <DetailBox label="Hierarchy Level" value={`Priority ${selectedCategory.priority}`} icon={<ListOrdered size={14} />} color="text-emerald-600" />
                                    <DetailBox label="Access Level" value={selectedCategory.isPrivate ? 'Restricted' : 'Universal'} icon={<ShieldAlert size={14} />} color="text-rose-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="text-blue-500" size={20} />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Group Definition & Scope</h3>
                        </div>
                        <p className="text-slate-600 font-bold leading-relaxed italic text-2xl opacity-80">"{selectedCategory.description}"</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-lg">
                        <div className="flex items-center gap-3 mb-6"><Palette className="text-pink-500" size={18} /><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Identity</h3></div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 rounded-xl border-2 border-white" style={{ backgroundColor: selectedCategory.colorCode }} />
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">HEX Code</p><p className="font-mono text-sm font-black text-slate-700 uppercase">{selectedCategory.colorCode}</p></div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL Key / Slug</p><div className="flex items-center gap-2 text-cyan-400 font-bold"><Globe size={14} /><span>/{selectedCategory.slug}</span></div></div>
                            <div className="space-y-1"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Registry</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Calendar size={18} className="text-slate-400" /></div><div><p className="text-[9px] font-black text-slate-500 uppercase">Registry Date</p><p className="text-xs font-bold text-slate-300">{new Date(selectedCategory.createdAt).toLocaleDateString()}</p></div></div></div>
                        </div>
                        <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={200} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const DetailBox = ({ label, value, icon, color }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400">{icon}<p className="text-[9px] font-black uppercase tracking-widest">{label}</p></div>
        <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
);