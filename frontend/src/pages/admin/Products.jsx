import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ProductSummaryCard from "../../components/Summerys/ProductSummaryCard.jsx";
import ProductForm from "../../components/Forms/ProductForm.jsx"; 

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, IndianRupee, ChevronLeft, ChevronRight,
  Layers, Loader2
} from "lucide-react";

export default function Products({ searchQuery }) {
  const { token } = useAuth();
  
  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [categoriesList, setCategoriesList] = useState(["All"]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: "All", stockStatus: "All", priceRange: "All" });
  const filterRef = useRef(null);
  
  const initialFormState = {
    _id: null, name: "", code: "", category: "", price: "", cost: "",
    stock: "", brand: "", details: "", sku: "", supplier: "", minStock: 20,
    weight: "", dimensions: "", color: "", img: "📦"
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- API CONFIGURATION ---
  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      if (res.data.success) {
        setProducts(res.data.products);
        setSummaryData(res.data.summary); 
        setCategoriesList(["All", ...res.data.availableCategories]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (token) fetchInventory(); 
  }, [token]);

  // Click outside filter logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // AUTO-RESET PAGINATION ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, activeFilters]);
  
  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDetails = (product) => { 
    setFormData(product);
    setView("view-details"); 
  };
  
  const handleEditDetails = (product) => { 
    setFormData({ ...product }); 
    setView("add"); // Redirect to form view for editing
  };

  // --- 2. ADD OR UPDATE PRODUCT ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = formData._id 
        ? await api.put(`/products/${formData._id}`, formData)
        : await api.post("/products", formData);

      if (res.data.success) {
        alert(res.data.message);
        fetchInventory();
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Sync failed");
    }
  };

  // --- 3. DELETE PRODUCT ---
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from live inventory?")) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        fetchInventory();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredProducts = products.filter((p) => {
    const finalSearch = (searchQuery || localSearch).toLowerCase();
    
    const matchesSearch = 
        p.name.toLowerCase().includes(finalSearch) || 
        p.code.toLowerCase().includes(finalSearch) ||
        p.brand?.toLowerCase().includes(finalSearch);

    const matchesCategory = activeFilters.category === "All" || p.category === activeFilters.category;
    const matchesStock = activeFilters.stockStatus === "All" || 
        (activeFilters.stockStatus === "Low Stock" ? p.stock < (p.minStock || 20) : p.stock >= (p.minStock || 20));
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-500">
          <ProductSummaryCard items={summaryData} nameSum="Inventory" />

          <div className="flex justify-between items-center mt-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Products Inventory</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Layers size={14} className="text-indigo-500" /> {filteredProducts.length} Match Found
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full md:max-w-2xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search inside results..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all placeholder:text-slate-300" 
                    value={localSearch} 
                    onChange={(e) => setLocalSearch(e.target.value)} 
                  />
                </div>

                <div className="relative" ref={filterRef}>
                  <button onClick={() => setShowFilterPopup(!showFilterPopup)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${showFilterPopup ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                    <Filter size={16} /> Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-[100] w-72 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 animate-in zoom-in-95 duration-200">
                      <div className="grid gap-5">
                        <FilterSelect label="Category" value={activeFilters.category} options={categoriesList} onChange={(v) => setActiveFilters({ ...activeFilters, category: v })} />
                        <FilterSelect label="Stock Status" value={activeFilters.stockStatus} options={["All", "In Stock", "Low Stock"]} onChange={(v) => setActiveFilters({ ...activeFilters, stockStatus: v })} />
                        <button onClick={() => setActiveFilters({ category: "All", stockStatus: "All", priceRange: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-95 whitespace-nowrap">
                  <Plus size={18} /> Product
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="p-6">Product Item</th>
                    <th className="p-6">ID Code</th>
                    <th className="p-6">Department</th>
                    <th className="p-6">Retail Price</th>
                    <th className="p-6">Stock Status</th>
                    <th className="p-6 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100">{item.img}</div>
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">{item.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.brand}</span>
                        </div>
                      </td>
                      <td className="p-6 text-slate-500 font-mono text-xs">{item.code}</td>
                      <td className="p-6"><span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase text-[9px] font-black shadow-sm">{item.category}</span></td>
                      <td className="p-6 text-slate-800 font-black flex items-center gap-1 mt-3"><IndianRupee size={12} />{item.price.toFixed(2)}</td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${item.stock < (item.minStock || 20) ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.stock < (item.minStock || 20) ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {item.stock} Units
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2 transition-all">
                          <ActionBtn onClick={() => handleOpenDetails(item)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(item)} icon={<Edit2 size={14} />} color="bg-slate-50 text-slate-500 hover:bg-slate-800" />
                          <ActionBtn onClick={() => handleDeleteProduct(item._id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs italic">
                  No matching products found.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} / {filteredProducts.length} entries
              </p>
              <div className="flex items-center gap-2">
                <NavBtn onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={activePage === 1} icon={<ChevronLeft size={18} />} />
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? 'bg-cyan-400 text-white shadow-xl shadow-cyan-100' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <NavBtn onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={activePage === totalPages || totalPages === 0} icon={<ChevronRight size={18} />} />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 mt-10">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Back
          </button>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <div className="w-48 h-48 bg-slate-50 rounded-[3rem] flex items-center justify-center text-8xl shadow-inner border border-slate-100">{formData.img}</div>
              <div className="flex-1">
                <span className="text-cyan-500 font-black text-xs uppercase tracking-[0.3em] mb-2 block">{formData.brand}</span>
                <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-6">{formData.name}</h1>
                <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto md:mx-0">
                  <DetailBox label="Identifier" val={formData.code} />
                  <DetailBox label="Retail Price" val={`₹${formData.price}`} highlight />
                  <DetailBox label="Stock Level" val={`${formData.stock} Units`} />
                  <DetailBox label="Department" val={formData.category} />
                </div>
              </div>
            </div>
            <div className="mt-16 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
              <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Product Description</div>
              <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{formData.details || 'No additional details provided for this asset.'}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in duration-500 mt-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Cancel
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{formData._id ? "Update Product" : "New Registration"}</h1>
          </div>
          <ProductForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleAddProduct} 
            onCancel={() => setView("list")} 
            categories={categoriesList.filter(c => c !== "All")} 
          />
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ActionBtn = ({ onClick, icon, color }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm ${color} hover:text-white hover:scale-110 active:scale-90`}>{icon}</button>
);

const NavBtn = ({ onClick, disabled, icon }) => (
  <button onClick={onClick} disabled={disabled} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95">{icon}</button>
);

const DetailBox = ({ label, val, highlight }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
    <p className={`text-xl font-black ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{val}</p>
  </div>
);