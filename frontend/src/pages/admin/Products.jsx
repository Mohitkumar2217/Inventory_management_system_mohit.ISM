import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import ProductSummaryCard from "../../components/Summerys/ProductSummaryCard.jsx";
import ProductForm from "../../components/Forms/ProductForm.jsx";
import ProductDetailPage from "../details/ProductDetailPage.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, IndianRupee, ChevronLeft, ChevronRight,
  Layers, Loader2, Truck, MapPin, Warehouse, Activity
} from "lucide-react";

export default function Products({ searchQuery = "" }) {
  const { token } = useAuth();

  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [liveNotices, setLiveNotices] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["All"]);
  const [warehousesList, setWarehousesList] = useState(["All"]);
  const [zonesList, setZonesList] = useState(["All"]);
  const [suppliersList, setSuppliersList] = useState(["All"]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: "All", stockStatus: "All", warehouse: "All" });
  const filterRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const initialFormState = {
    _id: null, name: "", code: "", category: "", price: "", cost: "",
    stock: "", brand: "", details: "", sku: "", supplier: "", minStock: 20,
    weight: "", dimensions: "", color: "", images: [],
    warehouse: "", zone: "", barcode: "", unit: "pcs", taxPercentage: 18,
    status: "Active", condition: "New", expiryDate: "", totalSold: 0,
    variants: [], manufacturingDate: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const api = axios.create({
    baseURL: `${import.meta.env.URL}/api`,
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      if (res.data.success) {
        setProducts(res.data.products || []);
        setSummaryData(res.data.summary || {});
        setCategoriesList(["All", ...(res.data.availableCategories || [])]);
        setWarehousesList(["All", ...(res.data.availableWarehouses || [])]);
        setZonesList(["All", ...(res.data.availableZones || [])]);
        setSuppliersList(["All", ...(res.data.availableSuppliers || [])]);
        setLiveNotices(res.data.notices || []);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterPopup(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, activeFilters]);

  const handleNextImg = () => {
    if (formData.images?.length > 0) setCurrentImgIndex((prev) => (prev + 1) % formData.images.length);
  };

  const handlePrevImg = () => {
    if (formData.images?.length > 0) setCurrentImgIndex((prev) => (prev - 1 + formData.images.length) % formData.images.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDetails = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(product);
    setCurrentImgIndex(0);
    setView("view-details");
  };

  const handleEditDetails = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData({ ...product });
    setView("add");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = formData._id
        ? await api.put(`/products/${formData._id}`, formData)
        : await api.post("/products", formData);
      if (res.data.success) {
        alert(res.data.message);
        await fetchInventory();
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Sync failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from live inventory?")) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        fetchInventory();
        if (view === "view-details") setView("list");
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredProducts = (products || []).filter((p) => {
    const finalSearch = (searchQuery || localSearch || "").toLowerCase();
    const matchesSearch =
      (p.name || "").toLowerCase().includes(finalSearch) ||
      (p.code || "").toLowerCase().includes(finalSearch) ||
      (p.brand || "").toLowerCase().includes(finalSearch);

    const matchesCategory = activeFilters.category === "All" || p.category === activeFilters.category;
    const matchesWarehouse = activeFilters.warehouse === "All" || p.warehouse === activeFilters.warehouse;
    const matchesStock = activeFilters.stockStatus === "All" ||
      (activeFilters.stockStatus === "Low Stock" ? p.stock < (p.minStock || 20) : p.stock >= (p.minStock || 20));

    return matchesSearch && matchesCategory && matchesStock && matchesWarehouse;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-12 h-12 animate-spin text-cyan-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in slide-in-from-left-6 duration-500">
          <ProductSummaryCard items={summaryData} nameSum="Inventory" notices={liveNotices} />

          <div className="flex justify-between items-center mt-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Products Hub</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Activity size={14} className="text-cyan-500" /> Real-time Tracking Active
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full md:max-w-2xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-400" size={18} />
                  <input type="text" placeholder="Search by name, code or brand..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
                </div>

                <div className="relative" ref={filterRef}>
                  <button onClick={() => setShowFilterPopup(!showFilterPopup)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${showFilterPopup ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    <Filter size={16} /> Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-[100] w-72 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 animate-in zoom-in-95">
                      <div className="grid gap-5">
                        <FilterSelect label="Department" value={activeFilters.category} options={categoriesList} onChange={(v) => setActiveFilters({ ...activeFilters, category: v })} />
                        <FilterSelect label="Logistics Hub" value={activeFilters.warehouse} options={warehousesList} onChange={(v) => setActiveFilters({ ...activeFilters, warehouse: v })} />
                        <FilterSelect label="Stock Health" value={activeFilters.stockStatus} options={["All", "In Stock", "Low Stock"]} onChange={(v) => setActiveFilters({ ...activeFilters, stockStatus: v })} />
                        <button onClick={() => setActiveFilters({ category: "All", stockStatus: "All", warehouse: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors">Reset Global Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-95">
                  <Plus size={18} /> Add Asset
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="p-6">Registry Item</th>
                    <th className="p-6">Logistics Context</th>
                    <th className="p-6">Unit Price</th>
                    <th className="p-6">Live Inventory</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100 overflow-hidden">
                          {item.images?.length > 0 ? <img src={item.images[0]} className="w-full h-full object-cover" alt="thumb" /> : <Package size={24} className="text-slate-300" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">{item.name}</span>
                          <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest">{item.code}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase"><Warehouse size={12} className="text-cyan-500" /> {item.warehouse || 'Unassigned'}</span>
                          <span className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase"><MapPin size={10} /> {item.zone || 'Global Zone'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-slate-800 font-black tracking-tight"><div className="flex items-center gap-0.5"><IndianRupee size={12} />{Number(item.price).toLocaleString('en-IN')}</div></td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border ${item.stock < (item.minStock || 20) ? 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.stock < (item.minStock || 20) ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {item.stock} {item.unit || 'pcs'}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <ActionBtn onClick={() => handleOpenDetails(item)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(item)} icon={<Edit2 size={14} />} color="bg-indigo-50 text-indigo-500 hover:bg-indigo-500" />
                          <ActionBtn onClick={() => handleDeleteProduct(item._id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem] gap-4">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tracking {currentItems.length} of {filteredProducts.length} entries</p>
              <div className="flex items-center gap-2">
                <NavBtn onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} icon={<ChevronLeft size={18} />} />
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-cyan-400 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <NavBtn onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} icon={<ChevronRight size={18} />} />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" ? (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-20 mt-10">
          <ProductDetailPage
            formData={formData}
            handlePrevImg={handlePrevImg}
            handleNextImg={handleNextImg}
            handleDeleteProduct={handleDeleteProduct}
            handleEditDetails={handleEditDetails}
            onBack={() => setView("list")}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-8 duration-500 mt-10">
          <div className="flex items-center justify-between mb-8 px-4">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110"><ArrowLeft size={18} /></div> Cancel Entry
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{formData._id ? "Synchronize Asset" : "New Asset Registration"}</h1>
          </div>
          <div className="px-2 pb-20">
            <ProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleAddProduct}
              onCancel={() => setView("list")}
              categories={categoriesList.filter(c => c !== "All")}
              warehouses={warehousesList.filter(w => w !== "All")}
              zones={zonesList.filter(w => w !== "All")}
              suppliers={suppliersList.filter(w => w !== "All")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-cyan-50/50">
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