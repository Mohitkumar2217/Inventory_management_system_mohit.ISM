import React, { useState, useEffect, useRef } from "react";
import axios from "axios";  
import { 
    Search, Plus, Trash2, Edit2, Package, 
    Filter, ArrowLeft, Save, X, Layers 
} from "lucide-react";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState("list"); // 'list' or 'add'
    const [search, setSearch] = useState("");
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    // --- FETCH DATA ---
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/categories', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('pos-token')}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- HANDLERS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/categories/add', 
                { name: categoryName, description: categoryDescription }, 
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('pos-token')}` } }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Category added successfully!');
                setCategoryName('');
                setCategoryDescription('');
                fetchCategories(); // Refresh list
                setView("list");
            }
        } catch (error) {
            alert('Failed to add category.');
            console.error(error);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/categories/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('pos-token')}` }
            });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    // --- SUMMARY LOGIC ---
    const itemsSummary = {
        totalProducts: categories.length,
        totalStock: categories.length > 0 ? 100 : 0, // Mock percentage
        totalOrders: categories.filter(c => !c.description).length, // Categories missing description
        totalCancelled: 0,
        totalRevenue: 0,
    };

    const filteredCategories = categories.filter(c => 
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

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
                        <button
                            onClick={() => setView("add")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            <Plus size={20} /> Create New
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-[2rem] p-4 mb-6 border border-slate-100 shadow-sm flex items-center gap-4">
                        <Search className="text-slate-400 ml-2" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search categories..." 
                            className="flex-1 bg-transparent outline-none font-bold text-sm text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Modern Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                                <tr>
                                    <th className="p-6">Category Detail</th>
                                    <th className="p-6">Description</th>
                                    <th className="p-6 text-center">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                {filteredCategories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl shadow-inner font-black">
                                                {cat.name.charAt(0)}
                                            </div>
                                            <span className="text-slate-700 text-lg font-black">{cat.name}</span>
                                        </td>
                                        <td className="p-6 text-slate-400 font-medium italic max-w-md truncate">
                                            {cat.description || "No description provided."}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-3">
                                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteCategory(cat._id)}
                                                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCategories.length === 0 && (
                            <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                No categories found
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ================= ADD FORM VIEW ================= */
                <div className="max-w-4xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-10 mt-4">
                        <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100"><ArrowLeft size={20} /></div>
                            Back to Groups
                        </button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight tracking-widest uppercase">New Category</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
                                <div className="p-3 bg-blue-50 rounded-2xl"><Layers className="text-blue-500" size={24} /></div>
                                <div>
                                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Category Identity</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Define how products are grouped</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Name *</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="e.g. Household Electronics"
                                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 shadow-inner" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                                    <textarea 
                                        rows={4}
                                        value={categoryDescription}
                                        onChange={(e) => setCategoryDescription(e.target.value)}
                                        placeholder="Briefly describe what kind of items belong here..."
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-600 shadow-inner resize-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 tracking-widest uppercase">
                                <Save size={24} /> Register Category
                            </button>
                            <button type="button" onClick={() => setView("list")} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}