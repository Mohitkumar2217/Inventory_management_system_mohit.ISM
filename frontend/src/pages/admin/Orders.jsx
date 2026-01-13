import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import OrderSummaryCard from "../../components/Summerys/OrderSummaryCard.jsx";
import OrderForm from "../../components/Forms/OrderForm.jsx";
import {
  Search, Filter, Plus, Trash2,
  Eye, ArrowLeft, IndianRupee, Package,
  Edit2, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Layers, Loader2
} from "lucide-react";

export default function Orders({ searchQuery }) {
  const { token } = useAuth();

  // --- STATES ---
  const [orders, setOrders] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [view, setView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveNotices, setLiveNotices] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const filterRef = useRef(null);

  // PAGINATION & FILTER STATE
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ status: "All", priceRange: "All" });

  const initialPurchaseForm = {
    _id: null, vendorName: "", itemName: "", category: "Electronics",
    quantity: 1, unitPrice: "", warehouse: "Main Warehouse",
    expectedDate: "", paymentTerms: "Due on Receipt", notes: ""
  };
  const [purchaseOrder, setPurchaseOrder] = useState(initialPurchaseForm);

  // API Instance Config
  const api = axios.create({
    baseURL: "https://inventory-management-system-mohit-ism.onrender.com/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      if (res.data.success) {
        setOrders(res.data.orders);
        setSummaryData(res.data.summary);
        setLiveNotices(res.data.notices);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // Click outside filter logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterPopup(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // RESET TO PAGE 1 WHEN SEARCHING
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrder(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. ADD OR UPDATE ORDER ---
  const handleAddPurchaseOrder = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = purchaseOrder._id
        ? await api.put(`/orders/${purchaseOrder._id}`, purchaseOrder)
        : await api.post("/orders", purchaseOrder);

      if (res.data.success) {
        alert(res.data.message);
        fetchOrders();
        setView("list");
        setPurchaseOrder(initialPurchaseForm);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Sync failed");
    }
  };

  // --- 3. QUICK STATUS UPDATE ---
  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/orders/status/${id}`, { status });
      if (res.data.success) fetchOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

  // --- 4. DELETE ORDER ---
  const removeOrder = async (id) => {
    if (!window.confirm("Delete this order record permanently?")) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.data.success) fetchOrders();
    } catch (err) {
      alert("Delete operation failed");
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredOrders = orders.filter((o) => {
    const finalSearch = (searchQuery || localSearch).toLowerCase();

    const matchesSearch =
      o.vendorName.toLowerCase().includes(finalSearch) ||
      o._id.toLowerCase().includes(finalSearch) ||
      o.category.toLowerCase().includes(finalSearch);

    const matchesStatus = activeFilters.status === "All" || o.status === activeFilters.status;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenDetails = (order) => { setSelectedOrder(order); setView("view-details"); };

  const handleEditDetails = (order) => {
    setPurchaseOrder({
      _id: order._id, vendorName: order.vendorName, itemName: order.itemName,
      category: order.category, quantity: order.quantity, unitPrice: order.unitPrice,
      warehouse: order.warehouse, expectedDate: order.expectedDate ? order.expectedDate.split('T')[0] : "",
      paymentTerms: order.paymentTerms, notes: order.notes
    });
    setView("add");
  };

  if (loading && orders.length === 0) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-500">
          <OrderSummaryCard items={summaryData} nameSum={'Orders'} notices={liveNotices} />

          <div className="flex justify-between items-center mb-6 mt-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Orders Inventory</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Layers size={14} className="text-indigo-500" /> {filteredOrders.length} Results Found
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">

              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full lg:max-w-3xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Quick search Client, ID or Category..."
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>

                <div className="relative" ref={filterRef}>
                  <button onClick={() => setShowFilterPopup(!showFilterPopup)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${showFilterPopup ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                    <Filter size={16} /> Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-[100] w-64 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 animate-in zoom-in-95 duration-200">
                      <div className="grid gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Status</label>
                          <select value={activeFilters.status} onChange={(e) => { setActiveFilters({ ...activeFilters, status: e.target.value }); setCurrentPage(1); }} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all">
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <button onClick={() => setActiveFilters({ status: "All", priceRange: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setPurchaseOrder(initialPurchaseForm); setView("add"); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap">
                  <Plus size={18} /> New Order
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="p-6">Order Reference</th>
                    <th className="p-6">Vendor / Client</th>
                    <th className="p-6">Category</th>
                    <th className="p-6 text-right">Total Amount</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-mono text-xs font-black text-indigo-400">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-6 text-slate-800 font-black cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleOpenDetails(order)}>{order.vendorName}</td>
                      <td className="p-6"><span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase text-[9px] font-black shadow-sm">{order.category}</span></td>
                      <td className="p-6 text-right text-slate-800 font-black">₹{(order.quantity * order.unitPrice).toLocaleString()}</td>
                      <td className="p-6 text-center"><StatusBadge status={order.status} onUpdate={(s) => updateStatus(order._id, s)} /></td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <ActionBtn onClick={() => handleOpenDetails(order)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(order)} icon={<Edit2 size={14} />} color="bg-slate-50 text-slate-500 hover:bg-slate-800" />
                          <ActionBtn onClick={() => removeOrder(order._id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {currentItems.length} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <NavBtn onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} icon={<ChevronLeft size={18} />} />
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <NavBtn onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} icon={<ChevronRight size={18} />} />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedOrder ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 mt-10">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100"><ArrowLeft size={18} /></div> Back
          </button>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Purchase Order Information</span>
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{selectedOrder.vendorName}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">System ID: {selectedOrder._id}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><IndianRupee size={12} /> Valuation</p>
                <p className="text-2xl font-black text-slate-800">₹{(selectedOrder.unitPrice * selectedOrder.quantity).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Package size={12} /> Volume</p>
                <p className="text-2xl font-black text-slate-800">{selectedOrder.quantity} Units</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</p>
                <p className="text-2xl font-black text-slate-800">{selectedOrder.category}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
              <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Notes & Requirements</div>
              <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{selectedOrder.notes || 'No specific notes recorded for this registry entry.'}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 mt-10">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Back to Ledger
          </button>
          <OrderForm purchaseOrder={purchaseOrder} handleFormChange={handleFormChange} handleSubmit={handleAddPurchaseOrder} onCancel={() => setView("list")} />
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatusBadge({ status, onUpdate }) {
  const configs = {
    Completed: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle size={10} /> },
    Pending: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={10} /> },
    Cancelled: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={10} /> },
  };
  const current = configs[status];
  return (
    <div onClick={(e) => e.stopPropagation()} className="relative">
      <select value={status} onChange={(e) => onUpdate(e.target.value)} className={`${current.bg} border appearance-none px-8 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer outline-none text-center transition-all hover:shadow-sm`}>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">{current.icon}</div>
    </div>
  );
}

const ActionBtn = ({ onClick, icon, color }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm ${color} hover:text-white hover:scale-110 active:scale-90`}>{icon}</button>
);

const NavBtn = ({ onClick, disabled, icon }) => (
  <button onClick={onClick} disabled={disabled} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95">{icon}</button>
);