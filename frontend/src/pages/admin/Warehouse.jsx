import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import WareHouseSummaryCard from "../../components/Summerys/WarehouseSummaryCard.jsx";
import WarehouseForm from "../../components/Forms/WarehouseForm.jsx";
import {
  Search, Plus, Trash2, Eye, ArrowLeft, Edit2,
  PackageSearch, MapPin, Hash, ChevronLeft, ChevronRight, Filter, Loader2,
  Layers, Info, Calendar, Activity, Box, DollarSign, Users, ShieldCheck
} from "lucide-react";

export default function Warehouse({ searchQuery = "" }) {
  const { token } = useAuth();
  // --- STATES ---
  const [stockList, setStockList] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const initialFormState = {
    warehouseId: "",
    name: "",
    storageType: "solid",
    capacity: 0,
    hierarchyLevel: 1,
    details: "",
    ranking: 0,
    address: {
      zone: "",
      city: "",
      state: "",
      pin: 0,
    },
    statusWarehouse: "active",
    quantity: 0,
    status: "In Stock",
    admin: "",
    staff: [],
    labourCount: 0,
    zone: [],
    inventory: [],
    order: [],
    img: null,
    unitCost: 0,
    sellingPrice: 0,
    totalRevenue: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  const api = axios.create({
    baseURL: `${import.meta.env.URL}/api`,
    headers: { Authorization: `Bearer ${token}` }
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value === "" ? 0 : Number(value)) : value
        }
      }));
    }
    else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value)
      }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await api.get("/warehouse");
      if (res.data.success) {
        setStockList(res.data.stocks || []);
        setProductList(res.data.product || []);
        setUserList(res.data.users || []);
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

    const zoneString = Array.isArray(s.zone)
      ? s.zone.map(z => typeof z === 'object' ? z.name : z).join(" ")
      : "";
    const addressString = s.address ? `${s.address.city} ${s.address.state} ${s.address.zone}` : "";

    const matchesSearch =
      (s.name || "").toLowerCase().includes(finalQuery) ||
      (s.warehouseId || "").toLowerCase().includes(finalQuery) ||
      (s.details || "").toLowerCase().includes(finalQuery) ||
      addressString.toLowerCase().includes(finalQuery) ||
      zoneString.toLowerCase().includes(finalQuery);

    const matchesStatus = statusFilter === "All" || s.statusWarehouse === statusFilter;

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
    availabilityRate: stockList.length > 0
      ? Number(((stockList.filter(s => s.status === "In Stock").length / stockList.length) * 100).toFixed(2)) + "%"
      : '0%',
    activeZonesCount: stockList.length,
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
                  <option value={itemsSummary.totalWarehouses}>all</option>
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
                    placeholder="Quick search products, cities, or zones..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
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
                    <th className="p-5">Name & City</th>
                    <th className="p-5">Mapped Zones</th>
                    <th className="p-5">Qty / Capacity</th>
                    <th className="p-5">System Status</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((stock) => (
                    <tr key={stock._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 font-bold text-slate-400 text-xs">{stock.warehouseId || "N/A"}</td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-slate-700">{stock.name}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                            <MapPin size={10} /> {stock.address?.city || "Unknown City"}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(stock.zone) && stock.zone.map((z, i) => (
                            <span key={z.id || i} className="bg-white border border-slate-100 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                              {typeof z === 'object' ? z.name : z}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-slate-700 font-black">
                        {stock.quantity} <span className="text-slate-300 font-medium">/ {stock.capacity}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${stock.statusWarehouse === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>{stock.statusWarehouse}</span>
                      </td>
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
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-orange-600 text-white shadow-xl shadow-orange-100" : "text-slate-400 hover:bg-slate-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
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
        <div className="max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-6 duration-700 pb-20 mt-10">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
              Back to Ledger
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteStock(selectedStock._id)} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Trash2 size={20} />
              </button>
              <button onClick={() => { setFormData(selectedStock); setView("add"); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                <Edit2 size={16} /> Edit Deployment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                  <div className="w-48 h-48 rounded-[3.5rem] bg-orange-50 flex items-center justify-center text-7xl shadow-2xl shrink-0 overflow-hidden">
                    {selectedStock.img ? <img src={selectedStock.img} className="w-full h-full object-cover" alt="Profile" /> : "🏢"}
                  </div>
                  <div className="pt-4 flex-1">
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{selectedStock.name}</h1>
                    <div className="flex flex-wrap gap-3 mb-10">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">ID: {selectedStock.warehouseId}</span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Layers size={10} /> Level {selectedStock.hierarchyLevel}
                      </span>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Activity size={10} /> {selectedStock.statusWarehouse}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-50 pt-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" /> City</p>
                        <p className="text-xl font-black text-slate-800">{selectedStock.address?.city || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Hash size={12} className="text-orange-500" /> Storage</p>
                        <p className="text-xl font-black text-slate-800 uppercase">{selectedStock.storageType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} className="text-orange-500" /> Quantity</p>
                        <p className="text-xl font-black text-slate-800">{selectedStock.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Box size={12} className="text-orange-500" /> Capacity</p>
                        <p className="text-xl font-black text-slate-800">{selectedStock.capacity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="text-indigo-500" size={20} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operational Zones</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedStock.zone) && selectedStock.zone.length > 0 ? (
                      selectedStock.zone.map((z, i) => (
                        <span key={z.id || i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider">
                          {typeof z === 'object' ? z.name : z}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs font-bold italic">No internal zones defined.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="text-blue-500" size={20} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Notes</h3>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed opacity-80">{selectedStock.details || 'No specific directives recorded.'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-lg">
                <div className="flex items-center gap-3 mb-8"><Users className="text-blue-500" size={18} /><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Human Resources</h3></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-indigo-400 uppercase">Lead Admin</p>
                      <p className="text-xs font-black text-indigo-900 truncate">
                        {(() => {
                          const adminId = typeof selectedStock.admin === 'object' ? selectedStock.admin?._id : selectedStock.admin;
                          const found = (userList || []).find(u => u._id === adminId);
                          return found ? found.name : "Unassigned / ID Not Found";
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Financials</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-emerald-400">${(selectedStock.totalRevenue || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-white/30 mb-1">YTD Revenue</span>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> Last Expiry Check</p>
                      <p className="text-xs font-bold text-white/80">{selectedStock.expiryDate ? new Date(selectedStock.expiryDate).toLocaleDateString() : "No Date Set"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} /> Full Address</p>
                      <p className="text-xs font-bold text-white/80">{selectedStock.address?.state}, PIN: {selectedStock.address?.pin}</p>
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
              Back to Registry
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{formData._id ? "Update Deployment" : "New Inventory Log"}</h1>
          </div>
          <WarehouseForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit} onCancel={() => setView("list")}
            users={userList}
            products={productList}
          />
        </div>
      )}
    </div>
  );
}