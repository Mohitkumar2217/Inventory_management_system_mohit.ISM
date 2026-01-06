import React, { useState, useEffect } from "react";
import axios from "axios";  
import { 
    Search, Plus, Trash2, Edit2, Filter, 
    ArrowLeft, Save, Layers, ChevronLeft, 
    ChevronRight, Tag, Percent, Globe, 
    ShieldCheck, Eye, Info, Palette, Hash,
    Calendar, ListOrdered, ShieldAlert, ExternalLink
} from "lucide-react";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState("list"); 
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Form State
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', code: '', description: '', taxRate: 18,
        slug: '', status: 'Active', priority: 1,
        metaTitle: '', isPrivate: false, colorCode: '#3b82f6'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- FETCH DATA ---
    const fetchCategories = async () => {
        const dummyData = [
            { _id: "1", name: "Electronics", code: "ELEC-01", description: "Smartphones, Laptops, and Accessories. Handles all high-voltage and battery-operated consumer goods.", taxRate: 18, slug: "electronics-hub", status: "Active", priority: 1, metaTitle: "Premium Tech Gadgets", isPrivate: false, colorCode: "#3b82f6" },
            { _id: "2", name: "FMCG", code: "FAST-22", description: "Daily household essentials and groceries with high turnover rates.", taxRate: 5, slug: "daily-essentials", status: "Active", priority: 2, metaTitle: "Everyday Groceries", isPrivate: false, colorCode: "#10b981" },
            { _id: "3", name: "Beauty & Care", code: "BEAU-09", description: "Skincare, cosmetics and personal hygiene products. Requires climate-controlled storage.", taxRate: 12, slug: "beauty-zone", status: "Active", priority: 3, metaTitle: "Cosmetic Products", isPrivate: false, colorCode: "#ec4899" },
            { _id: "4", name: "Warehouse Tools", code: "TOOL-WH", description: "Equipment for logistics and maintenance. Internal use only.", taxRate: 18, slug: "industrial-tools", status: "Active", priority: 5, metaTitle: "Heavy Duty Tools", isPrivate: true, colorCode: "#f59e0b" },
            { _id: "5", name: "Fashion", code: "FASH-ST", description: "Apparel, footwear and seasonal wear. Managed by the lifestyle department.", taxRate: 12, slug: "lifestyle-fashion", status: "Active", priority: 4, metaTitle: "Latest Trends 2025", isPrivate: false, colorCode: "#8b5cf6" },
            { _id: "6", name: "Home Decor", code: "HOME-DC", description: "Furniture, lighting and interior items. Oversized shipping applies.", taxRate: 18, slug: "interior-design", status: "Inactive", priority: 6, metaTitle: "Modern Home Decor", isPrivate: false, colorCode: "#64748b" },
            { _id: "7", name: "Beverages", code: "BEV-COLD", description: "Soft drinks, juices and energy drinks. Glass handling protocols required.", taxRate: 28, slug: "refreshments", status: "Active", priority: 7, metaTitle: "Beverage Hub", isPrivate: false, colorCode: "#06b6d4" },
            { _id: "8", name: "Pharmaceuticals", code: "MED-CORE", description: "Over-the-counter medicines and first aid. Restricted access zone.", taxRate: 12, slug: "healthcare-meds", status: "Active", priority: 1, metaTitle: "Health & Wellness", isPrivate: true, colorCode: "#f43f5e" },
            { _id: "9", name: "Office Stationery", code: "OFF-SUP", description: "Paper, pens and organizational supplies for corporate clients.", taxRate: 12, slug: "office-essentials", status: "Active", priority: 8, metaTitle: "Workplace Supplies", isPrivate: false, colorCode: "#14b8a6" },
            { _id: "10", name: "Logistics Spares", code: "LOGI-SP", description: "Spare parts for delivery vehicles and conveyor maintenance.", taxRate: 18, slug: "transport-parts", status: "Active", priority: 9, metaTitle: "Logistics Inventory", isPrivate: true, colorCode: "#78350f" },
        ];
        setCategories(dummyData);
    };

    useEffect(() => { fetchCategories(); }, []);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert(`Category Saved Successfully!`);
        resetForm();
        setView("list");
    };

    const handleEdit = (cat) => {
        setCurrentId(cat._id);
        setFormData({ ...cat });
        setView("add");
    };

    const handleViewDetails = (cat) => {
        setSelectedCategory(cat);
        setView("view-details");
    };

    const resetForm = () => {
        setCurrentId(null);
        setFormData({
            name: '', code: '', description: '', taxRate: 18,
            slug: '', status: 'Active', priority: 1,
            metaTitle: '', isPrivate: false, colorCode: '#3b82f6'
        });
    };

    const deleteCategory = (id) => {
        if (!window.confirm("Delete this category?")) return;
        setCategories(categories.filter(c => c._id !== id));
        if (view === "view-details") setView("list");
    };

    const filteredCategories = categories.filter(c => 
        c.name?.toLowerCase().includes(search.toLowerCase()) || c.code?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
            {view === "list" ? (
                <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700"> 
                    
                    <div className="flex justify-between items-center mb-8 mt-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Departmental Groups</h1>
                            <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                                <Layers size={14} className="text-blue-500" /> {filteredCategories.length} Categories Defined
                            </p>
                        </div>
                        <button onClick={() => { resetForm(); setView("add"); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                            <Plus size={20} /> Create New
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                Show <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none font-black cursor-pointer"><option value={10}>10</option><option value={25}>25</option></select>
                            </div>
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Search by name or code..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50/50" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                                    <tr>
                                        <th className="p-6">Group Name</th>
                                        <th className="p-6">Tax/Privacy</th>
                                        <th className="p-6">Level</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                    {currentItems.map((cat) => (
                                        <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg font-black" style={{backgroundColor: cat.colorCode}}>{cat.name.charAt(0)}</div>
                                                <div><span className="text-slate-700 text-lg font-black block">{cat.name}</span><span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{cat.code}</span></div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-500 font-black text-xs">GST: {cat.taxRate}%</span>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">{cat.isPrivate ? 'Restricted' : 'Public'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>P{cat.priority}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleViewDetails(cat)} className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all"><Eye size={16}/></button>
                                                    <button onClick={() => handleEdit(cat)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all"><Edit2 size={16}/></button>
                                                    <button onClick={() => deleteCategory(cat._id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : view === "view-details" ? (
                /* ================= IMPROVED DETAILS VIEW ================= */
                <div className="max-w-6xl mx-auto p-6 animate-in slide-in-from-bottom-6 duration-700 pb-20">
                    <div className="flex items-center justify-between mb-10 mt-4">
                        <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100"><ArrowLeft size={18} /></div>
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
                        {/* LEFT: Identity Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCategory.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                                        {selectedCategory.status}
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10 text-center md:text-left">
                                    <div className="w-48 h-48 rounded-[3.5rem] flex items-center justify-center text-white text-8xl shadow-2xl font-black shrink-0" style={{backgroundColor: selectedCategory.colorCode}}>
                                        {selectedCategory.name.charAt(0)}
                                    </div>
                                    <div className="pt-4 flex-1">
                                        <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-2">{selectedCategory.name}</h1>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
                                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedCategory.code}</span>
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Layers size={10}/> Group Tier A</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-50 pt-8">
                                            <DetailBox label="Tax Component" value={`${selectedCategory.taxRate}% Rate`} icon={<Percent size={14}/>} color="text-indigo-600" />
                                            <DetailBox label="Hierarchy Level" value={`Priority ${selectedCategory.priority}`} icon={<ListOrdered size={14}/>} color="text-emerald-600" />
                                            <DetailBox label="Access Level" value={selectedCategory.isPrivate ? 'Restricted' : 'Universal'} icon={<ShieldAlert size={14}/>} color="text-rose-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-sm relative">
                                <div className="flex items-center gap-3 mb-6">
                                    <Info className="text-blue-500" size={20} />
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Group Definition & Scope</h3>
                                </div>
                                <p className="text-slate-600 font-bold leading-relaxed italic text-2xl opacity-80">
                                    "{selectedCategory.description}"
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Properties & Audit */}
                        <div className="space-y-8">
                            {/* Visual Branding Card */}
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <Palette className="text-pink-500" size={18} />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Identity</h3>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl shadow-inner border-2 border-white" style={{backgroundColor: selectedCategory.colorCode}} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">HEX Code</p>
                                        <p className="font-mono text-sm font-black text-slate-700 uppercase">{selectedCategory.colorCode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* System Meta Card */}
                            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL Key / Slug</p>
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                            <Globe size={14}/>
                                            <span>/{selectedCategory.slug}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Search Engine Title</p>
                                        <p className="text-sm font-black text-slate-200">{selectedCategory.metaTitle || "Not Configured"}</p>
                                    </div>
                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Audit Information</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Calendar size={18} className="text-slate-400"/></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase">Registry Date</p>
                                                <p className="text-xs font-bold text-slate-300">Jan 12, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={200} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ================= ADD/EDIT FORM VIEW ================= */
                <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 pb-20">
                    <div className="flex items-center justify-between mb-10 mt-4">
                        <button onClick={() => { resetForm(); setView("list"); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100"><ArrowLeft size={18} /></div>
                            Cancel
                        </button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{currentId ? "Update Registry" : "New Registration"}</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><Tag size={24} /></div>
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Main Metadata</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput label="Display Name *" name="name" value={formData.name} onChange={handleInputChange} required />
                                        <FormInput label="Group Code" name="code" value={formData.code} onChange={handleInputChange} />
                                        <FormInput label="URL Slug" name="slug" value={formData.slug} onChange={handleInputChange} />
                                        <FormInput label="SEO Meta Title" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} />
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                                        <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-600 shadow-inner resize-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
                                    <div className="space-y-6">
                                        <FormInput label="Tax Rate (%)" type="number" name="taxRate" value={formData.taxRate} onChange={handleInputChange} />
                                        <FormInput label="Priority Level" type="number" name="priority" value={formData.priority} onChange={handleInputChange} />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Label Color</label>
                                            <input type="color" name="colorCode" value={formData.colorCode} onChange={handleInputChange} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer" />
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-blue-100">
                                            <input type="checkbox" name="isPrivate" checked={formData.isPrivate} onChange={handleInputChange} className="w-4 h-4 rounded text-blue-600" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal Use Only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"><Save size={24} /> {currentId ? "Synchronize Changes" : "Commit to Registry"}</button>
                            <button type="button" onClick={() => { resetForm(); setView("list"); }} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 uppercase tracking-widest">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// Sub-components
const DetailBox = ({ label, value, icon, color }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400">
            {icon}
            <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
        </div>
        <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
        <input {...props} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-700 shadow-inner text-sm" />
    </div>
);