import React, { useState, useEffect, useRef } from "react";
import axios from "axios";  
import { 
    Search, Plus, Trash2, Edit2, Package, 
    Filter, ArrowLeft, Save, X, Layers,
    ChevronLeft, ChevronRight
} from "lucide-react";
// import CategorySummaryCard from "../../components/Summerys/CategorySummaryCard.jsx"; // Assuming you have this

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState("list"); // 'list', 'add', or 'edit'
    const [search, setSearch] = useState("");
    
    // Form State
    const [currentId, setCurrentId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
        const payload = { name: categoryName, description: categoryDescription };
        const url = currentId 
            ? `http://localhost:4000/api/categories/${currentId}` 
            : 'http://localhost:4000/api/categories/add';
        
        try {
            const response = currentId 
                ? await axios.put(url, payload, { headers: { 'Authorization': `Bearer ${localStorage.getItem('pos-token')}` } })
                : await axios.post(url, payload, { headers: { 'Authorization': `Bearer ${localStorage.getItem('pos-token')}` } });

            if (response.status === 200 || response.status === 201) {
                alert(`Category ${currentId ? 'updated' : 'added'} successfully!`);
                resetForm();
                fetchCategories();
                setView("list");
            }
        } catch (error) {
            alert('Operation failed.');
            console.error(error);
        }
    };

    const handleEdit = (cat) => {
        setCurrentId(cat._id);
        setCategoryName(cat.name);
        setCategoryDescription(cat.description);
        setView("add");
    };

    const resetForm = () => {
        setCurrentId(null);
        setCategoryName('');
        setCategoryDescription('');
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

    // --- FILTER & PAGINATION LOGIC ---
    const filteredCategories = categories.filter(c => 
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    // --- SUMMARY LOGIC ---
    const itemsSummary = {
        totalProducts: categories.length,
        totalStock: 100, // Utilization rate
        totalOrders: categories.filter(c => !c.description).length, // Pending descriptions
        totalCancelled: 0,
        totalRevenue: 0,
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
            {view === "list" ? (
                <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700"> 
                    
                    {/* Summary Cards */}
                    {/* <CategorySummaryCard items={itemsSummary} nameSum="Departments" /> */}

                    <div className="flex justify-between items-center mb-8 mt-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Departmental Groups</h1>
                            <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                                <Layers size={14} className="text-blue-500" /> {filteredCategories.length} Categories Defined
                            </p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setView("add"); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            <Plus size={20} /> Create New
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
                        {/* Table Header / Toolbar */}
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                Show
                                <select 
                                    value={itemsPerPage} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                    className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none font-black"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                </select>
                                Entries
                            </div>

                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search categories..." 
                                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                                    <tr>
                                        <th className="p-6">Category Detail</th>
                                        <th className="p-6">Description</th>
                                        <th className="p-6 text-center">Manage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                    {currentItems.map((cat) => (
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
                                                    <button 
                                                        onClick={() => handleEdit(cat)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                                                    >
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
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCategories.length)} / {filteredCategories.length} entries
                            </p>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={currentPage === 1} 
                                    className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={18}/>
                                </button>
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i + 1} 
                                            onClick={() => setCurrentPage(i + 1)} 
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages || totalPages === 0} 
                                    className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ================= ADD/EDIT FORM VIEW ================= */
                <div className="max-w-4xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-10 mt-4">
                        <button onClick={() => { resetForm(); setView("list"); }} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100"><ArrowLeft size={20} /></div>
                            Back to Groups
                        </button>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight tracking-widest uppercase">
                            {currentId ? "Edit Category" : "New Category"}
                        </h1>
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
                                <Save size={24} /> {currentId ? "Update Category" : "Register Category"}
                            </button>
                            <button type="button" onClick={() => { resetForm(); setView("list"); }} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}