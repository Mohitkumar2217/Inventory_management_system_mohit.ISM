import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
    Plus, Trash2, Edit2, Eye, Layers, Percent,
    ChevronLeft, ChevronRight, Loader2, Search, X, Filter
} from "lucide-react";
import CategoryForm from "../../components/Forms/CategoryForm";
import CategoryDetails from "../details/CategoryDetails";

export default function Categories({ searchQuery = "" }) {
    const initialFormData = {
        name: '',
        code: '',
        description: '',
        slug: '',
        metaTitle: '',
        brand: [],
        storageType: 'solid',
        requiresCooling: false,
        isFragile: false,
        hazardLevel: 'None',
        defaultMinStock: 10,
        defaultMaxStock: 500,
        taxRate: 18,
        hsnCode: '',
        status: 'Active',
        priority: 1,
        colorCode: '#3b82f6',
        icon: 'package',
        isPrivate: false
    };

    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState("list");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- Filter States ---
    const [localSearch, setLocalSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
        headers: { Authorization: `Bearer ${token}` }
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categories");
            if (res.data.success) setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchCategories(); }, [token]);

    // Auto-reset pagination on search or filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, localSearch, statusFilter]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);

        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prev) => {
                let updated = { ...prev };
                let current = updated;
                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] };
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = val;
                return updated;
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: val }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = currentId
                ? await api.put(`/categories/${currentId}`, formData)
                : await api.post("/categories", formData);

            if (res.data.success) {
                alert(res.data.message);
                fetchCategories();
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
        setFormData(initialFormData);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Confirm permanent deletion?")) return;
        try {
            const res = await api.delete(`/categories/${id}`);
            if (res.data.success) {
                fetchCategories();
                if (view === "view-details") setView("list");
            }
        } catch (err) {
            alert("Delete failed. Please try again.");
        }
    };

    // --- Filter Logic ---
    const filteredCategories = categories.filter(c => {
        const finalQuery = (searchQuery || localSearch || "").toLowerCase();
        const matchesSearch =
            (c.name || "").toLowerCase().includes(finalQuery) ||
            (c.code || "").toLowerCase().includes(finalQuery);

        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
    const activePage = currentPage > totalPages ? 1 : currentPage;
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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
                <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">

                    <div className="flex justify-between items-center mb-6 mt-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Departmental Groups</h1>
                            <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                                <Layers size={14} className="text-blue-500" /> {filteredCategories.length} Categories Matching
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible mt-8">
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">

                            {/* Items Per Page Selector */}
                            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer"
                                >
                                    <option value={categories.length}>all</option>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                                {/* Search Input */}
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <Search className="text-slate-300 group-focus-within:text-blue-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Quick search category name or code..."
                                        className="bg-transparent outline-none font-bold text-sm w-full placeholder:text-slate-300"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                                    <Filter size={16} className="text-slate-400" />
                                    <select
                                        className="bg-transparent outline-none font-bold text-xs text-slate-600 cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={() => { resetForm(); setView("add"); }}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all whitespace-nowrap"
                                >
                                    <Plus size={18} /> Create New
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                                    <tr>
                                        <th className="p-6">Group Info</th>
                                        <th className="p-6">Compliance</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6 text-center">Manage</th>
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
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                                                    {cat.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleViewDetails(cat)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                                                    <button onClick={() => handleEdit(cat)} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                                                    <button onClick={() => deleteCategory(cat._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredCategories.length === 0 && (
                                <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs italic">
                                    No matching categories found.
                                </div>
                            )}
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCategories.length)} / {filteredCategories.length} items
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={activePage === 1} className="p-2 rounded-xl border border-slate-100 disabled:opacity-30 transition-all hover:bg-slate-50 active:scale-95"><ChevronLeft size={18} /></button>
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={activePage === totalPages || totalPages === 0} className="p-2 rounded-xl border border-slate-100 disabled:opacity-30 transition-all hover:bg-slate-50 active:scale-95"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : view === "view-details" ? (
                <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
                    <CategoryDetails selectedCategory={selectedCategory} setView={setView} deleteCategory={deleteCategory} handleEdit={handleEdit} />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 ">
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ChevronLeft size={20} /></div>
                            Back
                        </button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{currentId ? "Edit Department Group" : "Create New Group"}</h1>
                    </div>
                    <CategoryForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} onCancel={() => setView("list")} currentId={currentId} />
                </div>
            )}
        </div>
    );
}