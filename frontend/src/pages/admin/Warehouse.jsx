import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import WareHouseSummaryCard from "../../components/Summerys/WarehouseSummaryCard.jsx";
import WarehouseForm from "../../components/Forms/WarehouseForm.jsx";
import {
  Search, Plus, Trash2, Eye, ArrowLeft, Edit2,
  PackageSearch, MapPin, Hash, ChevronLeft, ChevronRight, Filter, Loader2,
  Layers, Info, Calendar, Palette, Activity, Box
} from "lucide-react";

export default function Warehouse({ searchQuery = "" }) {
  const { token } = useAuth();
  // --- STATES ---
  const [stockList, setStockList] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const initialFormState = {
    product: "",
    warehouseName: "",
    quantity: 0,
    status: "In Stock",
    details: "",
    zone: [], 
    sku: "",
    priority: "Standard",
    subZone: "",
    minStock: 10,
    maxStock: 500,
    img: null
  };

  const [formData, setFormData] = useState(initialFormState);

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await api.get("/warehouse");
      if (res.data.success) {
        setStockList(res.data.stocks || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStock();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = formData._id
        ? await api.put(`/warehouse/${formData._id}`, formData)
        : await api.post("/warehouse", formData);

      if (res.data.success) {
        alert(res.data.message);
        fetchStock();
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleOpenDetails = (stock) => {
    setSelectedStock(stock);
    setView("view-details");
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm("Delete this stock record permanently?")) return;
    try {
      const res = await api.delete(`/warehouse/${id}`);
      if (res.data.success) {
        fetchStock();
        if (view === "view-details") setView("list");
      }
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const filteredStock = (stockList || []).filter(s => {
    const finalQuery = (searchQuery || localSearch || "").toLowerCase();
    // Updated search logic to check zone object names
    const zoneString = Array.isArray(s.zone) 
      ? s.zone.map(z => typeof z === 'object' ? z.name : z).join(" ") 
      : "";
      
    const matchesSearch =
      (s.product || "").toLowerCase().includes(finalQuery) ||
      (s.warehouseName || "").toLowerCase().includes(finalQuery) ||
      (s.details || "").toLowerCase().includes(finalQuery) ||
      zoneString.toLowerCase().includes(finalQuery);
      
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStock.slice(indexOfFirstItem, indexOfLastItem);

  const itemsSummary = {
    totalWarehouses: stockList.length,
    totalQuantity: stockList.reduce((sum, s) => sum + Number(s.quantity || 0), 0),
    inStockCount: stockList.filter(s => s.status === "In Stock").length,
    outOfStockCount: stockList.filter(s => s.status === "Out of Stock").length,
  };

  if (loading && stockList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <WareHouseSummaryCard items={itemsSummary} nameSum="Inventory" />

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Warehouse Ledger</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-widest">
                <PackageSearch size={14} className="text-orange-500" /> {filteredStock.length} Matches in Stock
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-black opacity-40">View</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-transparent outline-none focus:ring-0 cursor-pointer font-black"
                >
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <Search className="text-slate-300 group-focus-within:text-orange-500" size={18} />
                  <input
                    type="text"
                    placeholder="Quick search products or zones..."
                    className="bg-transparent outline-none font-bold text-sm w-full placeholder:text-slate-300"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select
                    className="bg-transparent outline-none font-bold text-xs text-slate-600 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <button
                  onClick={() => { setFormData(initialFormState); setView("add"); }}
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-100 active:scale-95 transition-all whitespace-nowrap"
                >
                  <Plus size={18} /> Add Stock
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                  <tr>
                    <th className="p-5">Warehouse ID</th>
                    <th className="p-5">Warehouse Name</th>
                    <th className="p-5">Zone Location</th>
                    <th className="p-5">Quantity</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Capacity</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((stock) => (
                    <tr key={stock._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 font-bold text-slate-400 text-xs">#{stock._id?.slice(-6).toUpperCase() || "NEW"}</td>
                      <td className="p-5 font-bold text-slate-700">{stock.warehouseName || "N/A"}</td>
                      <td className="p-5 text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {/* FIX: Access .name of zone object */}
                          {Array.isArray(stock.zone) && stock.zone.map((z, i) => (
                            <span key={z.id || i} className="bg-white border border-slate-100 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                                {typeof z === 'object' ? z.name : z}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-slate-700 font-black">{stock.quantity} Units</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${stock.status === "In Stock" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>{stock.status}</span>
                      </td>
                      <td className="p-5 text-slate-700">{stock.capacity}</td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenDetails(stock)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                          <button onClick={() => { setFormData(stock); setView("add"); }} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteStock(stock._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Viewing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStock.length)} / {filteredStock.length} items
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={activePage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedStock ? (
        <div className="max-w-6xl mx-auto p-6 animate-in slide-in-from-bottom-6 duration-700 pb-20 mt-10">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
              Back
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteStock(selectedStock._id)} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Trash2 size={20} />
              </button>
              <button onClick={() => { setFormData(selectedStock); setView("add"); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                <Edit2 size={16} /> Edit Warehouse Record
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                  <div className="w-48 h-48 rounded-[3.5rem] bg-orange-50 flex items-center justify-center text-7xl shadow-2xl shrink-0">🏢</div>
                  <div className="pt-4 flex-1">
                    <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-2">{selectedStock.warehouseName}</h1>
                    <div className="flex flex-wrap gap-3 mb-10">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">ID: #{selectedStock._id?.slice(-6).toUpperCase()}</span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Layers size={10} /> 
                        {/* FIX: Join zone names */}
                        {Array.isArray(selectedStock.zone) 
                          ? selectedStock.zone.map(z => typeof z === 'object' ? z.name : z).join(", ") 
                          : "No Zones"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-50 pt-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" /> All Zones</p>
                        <p className="text-xl font-black text-slate-800">
                          {/* FIX: Handle zone objects for rendering */}
                          {Array.isArray(selectedStock.zone) 
                            ? selectedStock.zone.map(z => typeof z === 'object' ? z.name : z).join(", ") 
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Hash size={12} className="text-orange-500" /> Capacity</p>
                        <p className="text-2xl font-black text-slate-800">{selectedStock.capacity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="text-blue-500" size={20} />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Group Definition & Scope</h3>
                </div>
                <p className="text-slate-600 font-bold leading-relaxed italic text-2xl opacity-80">"{selectedStock.details || 'No specific directives recorded.'}"</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-lg">
                <div className="flex items-center gap-3 mb-6"><Palette className="text-pink-500" size={18} /><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</h3></div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-12 h-12 rounded-xl border-2 border-white ${selectedStock.status === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Availability</p><p className="text-sm font-black text-slate-700 uppercase">{selectedStock.status}</p></div>
                </div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Registry</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Calendar size={18} className="text-slate-400" /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">Registry ID</p>
                        <p className="text-xs font-bold text-slate-300">#{selectedStock._id?.toUpperCase()}</p>
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
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500 mt-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={18} /></div>
              Back
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{formData._id ? "Update Deployment" : "New Inventory Log"}</h1>
          </div>
          <WarehouseForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} onCancel={() => setView("list")} />
        </div>
      )}
    </div>
  );
}