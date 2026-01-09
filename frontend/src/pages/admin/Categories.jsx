import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Ensure path is correct
import {
    Plus, Trash2, Edit2, ArrowLeft, Save, Layers,
    Percent, Globe, Eye, Info, Palette, Hash,
    Calendar, ListOrdered, ShieldAlert, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";

export default function Categories({ searchQuery }) {
    const { token } = useAuth(); //
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState("list");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', code: '', description: '', taxRate: 18,
        slug: '', status: 'Active', priority: 1,
        metaTitle: '', isPrivate: false, colorCode: '#3b82f6'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // API Instance with Auth Header
    const api = axios.create({
        baseURL: "http://localhost:4000/api",
        headers: { Authorization: `Bearer ${token}` }
    });

    // --- FETCH DATA FROM BACKEND ---
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categories"); //
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCategories();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // --- SUBMIT (CREATE OR UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = currentId
                ? await api.put(`/categories/${currentId}`, formData) //
                : await api.post("/categories", formData); //

            if (res.data.success) {
                alert(res.data.message);
                fetchCategories(); // Refresh list
                resetForm();
                setView("list");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
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

    // --- DELETE ---
    const deleteCategory = async (id) => {
        if (!window.confirm("Confirm permanent deletion?")) return;
        try {
            const res = await api.delete(`/categories/${id}`); //
            if (res.data.success) {
                fetchCategories();
                if (view === "view-details") setView("list");
            }
        } catch (err) {
            alert("Delete failed. Please try again.");
        }
    };

    // --- FILTER & PAGINATION ---
    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        c.code?.toLowerCase().includes((searchQuery || "").toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const activePage = currentPage > totalPages ? 1 : currentPage;
    const currentItems = filteredCategories.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    // Initial Loading State
    if (loading && categories.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

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
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                Show
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none font-black cursor-pointer">
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                </select>
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Registry</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                                    <tr>
                                        <th className="p-6">Group Info</th>
                                        <th className="p-6">Compliance</th>
                                        <th className="p-6">Level</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                    {currentItems.map((cat) => (
                                        <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg font-black transition-transform group-hover:scale-110" style={{ backgroundColor: cat.colorCode }}>
                                                    {cat.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-slate-700 text-lg font-black block">{cat.name}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{cat.code}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-600 font-black text-xs flex items-center gap-1"><Percent size={12} className="text-emerald-500" /> {cat.taxRate}% Rate</span>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">{cat.isPrivate ? 'Restricted Access' : 'Public Listing'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    Priority {cat.priority}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleViewDetails(cat)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={16} /></button>
                                                    <button onClick={() => handleEdit(cat)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={16} /></button>
                                                    <button onClick={() => deleteCategory(cat._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Page {activePage} of {totalPages}</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={activePage === 1} className="p-2 rounded-xl border border-slate-100 disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={activePage === totalPages || totalPages === 0} className="p-2 rounded-xl border border-slate-100 disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : view === "view-details" ? (
                /* ================= DETAILS VIEW ================= */
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
            ) : (
                /* ================= FORM VIEW ================= */
                <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 pb-20 mt-10">
                    <div className="flex items-center justify-between mb-10">
                        <button onClick={() => { resetForm(); setView("list"); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
                            Cancel
                        </button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{currentId ? "Update Category" : "New Registration"}</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput label="Display Name *" name="name" value={formData.name} onChange={handleInputChange} required />
                                        <FormInput label="Group Code" name="code" value={formData.code} onChange={handleInputChange} />
                                        <FormInput label="URL Slug" name="slug" value={formData.slug} onChange={handleInputChange} />
                                        <FormInput label="Meta Title" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} />
                                    </div>
                                    <div className="mt-6">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                                        <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full p-5 mt-2 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-slate-600 shadow-inner resize-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                                    <FormInput label="Tax Rate (%)" type="number" name="taxRate" value={formData.taxRate} onChange={handleInputChange} />
                                    <FormInput label="Priority Level" type="number" name="priority" value={formData.priority} onChange={handleInputChange} />
                                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Label Color</label><input type="color" name="colorCode" value={formData.colorCode} onChange={handleInputChange} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer" /></div>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all"><input type="checkbox" name="isPrivate" checked={formData.isPrivate} onChange={handleInputChange} className="w-4 h-4 rounded text-blue-600" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal Unit</span></label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"><Save size={24} /> {currentId ? "Save Changes" : "Register Category"}</button>
                            <button type="button" onClick={() => { resetForm(); setView("list"); }} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

const DetailBox = ({ label, value, icon, color }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400">{icon}<p className="text-[9px] font-black uppercase tracking-widest">{label}</p></div>
        <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
        <input {...props} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-700 shadow-inner text-sm" />
    </div>
);