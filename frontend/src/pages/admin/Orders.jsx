import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import OrderSummaryCard from "../../components/Summerys/OrderSummaryCard.jsx";
import OrderForm from "../../components/Forms/OrderForm.jsx";
import OrderDetailPage from "../details/OrderDetailPage.jsx";

import {
  Search, Filter, Plus, Trash2, Eye, ArrowLeft,
  Edit2, ChevronLeft, ChevronRight, Layers, Loader2,
} from "lucide-react";

export default function Orders({ searchQuery = "" }) {
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
  const [showTracking, setShowTracking] = useState(false); // LIVE TRACKING TOGGLE
  const [supplierList, setSupplierList] = useState(["All"]);
  const [warehouseList, setWarehouseList] = useState(["All"]);
  const [zoneList, setZoneList] = useState(["All"]);
  const [categoryList, setCategoryList] = useState(["All"]);
  const filterRef = useRef(null);

  // PAGINATION & FILTER STATE
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ status: "All", priority: "All" });

  const initialPurchaseForm = {
    _id: null,
    poNumber: "",
    refId: "",
    priority: "standard",
    vendorName: "",
    vendorEmail: "",
    itemName: "",
    sku: "",
    category: "",
    variants: [],
    warehouse: "",
    zone: "",
    whContact: "",
    shippingMethod: "",
    deliveryAddress: "",
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    shippingCharges: 0,
    discount: 0,
    totalOrderValue: 0,
    paymentTerms: "Due on Receipt",
    minStock: 0,
    status: "Pending",
    stockUpdated: false,
    notes: "",
    trackingId: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    estimatedDuration: 7,
    expectedDate: "",
    timeline: {
      processedAt: null,
      shippedAt: null,
      deliveredAt: null
    },
    images: []
  };
  const [purchaseOrder, setPurchaseOrder] = useState(initialPurchaseForm);

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      if (res.data.success) {
        setOrders(res.data.orders);
        setSummaryData(res.data.summary);
        setCategoryList(["All", ...(res.data.availableCategories || [])]);
        setWarehouseList(["All", ...(res.data.availableWarehouses || [])]);
        setZoneList(["All", ...(res.data.availableZones || [])]);
        setSupplierList(["All", ...(res.data.availableSuppliers || [])]);
        setLiveNotices(res.data.notices || []);
      }
    } catch (err) { console.error("Fetch Error:", err); } finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchOrders(); }, [token]);

  useEffect(() => {
    function handleClickOutside(event) { if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterPopup(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, localSearch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPurchaseOrder = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = purchaseOrder._id ? await api.put(`/orders/${purchaseOrder._id}`, purchaseOrder) : await api.post("/orders", purchaseOrder);
      if (res.data.success) {
        alert(res.data.message);
        fetchOrders();
        setView("list");
        setPurchaseOrder(initialPurchaseForm);
      }
    } catch (err) { alert(err.response?.data?.message || "Sync failed"); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/orders/status/${id}`, { status });
      if (res.data.success) fetchOrders();
    } catch (err) { alert("Status update failed"); }
  };

  const removeOrder = async (id) => {
    if (!window.confirm("Delete this order record permanently?")) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.data.success) fetchOrders();
    } catch (err) { alert("Delete operation failed"); }
  };

  const filteredOrders = orders.filter((o) => {
    const finalSearch = (searchQuery || localSearch).toLowerCase();
    const zoneName = typeof o.zone === 'object' ? o.zone?.name : o.zone;

    const matchesSearch =
      (o.vendorName || "").toLowerCase().includes(finalSearch) ||
      (o.poNumber || "").toLowerCase().includes(finalSearch) ||
      (o._id || "").toLowerCase().includes(finalSearch) ||
      (o.itemName || "").toLowerCase().includes(finalSearch) ||
      (o.category || "").toLowerCase().includes(finalSearch) ||
      (zoneName || "").toLowerCase().includes(finalSearch);

    const matchesStatus = activeFilters.status === "All" || o.status === activeFilters.status;
    const matchesPriority = activeFilters.priority === "All" || o.priority === activeFilters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setView("view-details");
    setShowTracking(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDetails = (order) => {
    setPurchaseOrder({
      ...order,
      expectedDate: order.expectedDate ? order.expectedDate.split('T')[0] : ""
    });
    setView("add");
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventory</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Layers size={14} className="text-indigo-500" /> {filteredOrders.length} Orders              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full lg:max-w-3xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search Vendor, PO#, or SKU..."
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
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                          <select value={activeFilters.priority} onChange={(e) => { setActiveFilters({ ...activeFilters, priority: e.target.value }); setCurrentPage(1); }} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all">
                            <option value="All">All Priorities</option>
                            <option value="standard">Standard</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <button onClick={() => setActiveFilters({ status: "All", priority: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset Filters</button>
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
                    <th className="p-6">PO Number</th>
                    <th className="p-6">OrderSKU / Vender</th>
                    <th className="p-6">Priority</th>
                    <th className="p-6 text-right">Grand Total</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-mono text-xs font-black text-indigo-400">{order.poNumber || `#${order._id.slice(-6).toUpperCase()}`}</td>
                      <td className="p-6">
                        <div className="flex flex-col cursor-pointer" onClick={() => handleOpenDetails(order)}>
                          <span className="text-slate-800 font-black group-hover:text-indigo-600 transition-colors">{order.itemName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.vendorName}</span>
                        </div>
                      </td>
                      <td className="p-6"><PriorityBadge priority={order.priority} /></td>
                      <td className="p-6 text-right text-slate-800 font-black">₹{(order.totalOrderValue || (order.quantity * order.unitPrice)).toLocaleString()}</td>
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
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20 mt-10">
          <OrderDetailPage
            selectedOrder={selectedOrder}
            showTracking={showTracking}
            setShowTracking={setShowTracking}
            onBack={() => setView("list")}
            handleDeleteProduct={removeOrder}
            handleEditDetails={handleEditDetails}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 mt-10">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-500 font-bold transition-all group">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div> Back
          </button>
          <OrderForm
            purchaseOrder={purchaseOrder}
            handleFormChange={handleFormChange}
            handleSubmit={handleAddPurchaseOrder}
            onCancel={() => setView("list")}
            suppliers={supplierList}
            zones={zoneList}
            categories={categoryList}
            warehouses={warehouseList}
            allProducts={[]}
          />
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function PriorityBadge({ priority }) {
  const styles = { standard: "bg-slate-100 text-slate-600", urgent: "bg-amber-100 text-amber-600", critical: "bg-rose-100 text-rose-600" };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[priority] || styles.standard}`}>{priority}</span>;
}

function StatusBadge({ status, onUpdate }) {
  const styles = {
    Pending: "bg-indigo-50 text-indigo-500 border-indigo-100",
    Processing: "bg-blue-50 text-blue-500 border-blue-100",
    Shipped: "bg-amber-50 text-amber-500 border-amber-100",
    Delivered: "bg-emerald-50 text-emerald-500 border-emerald-100",
    Completed: "bg-emerald-50 text-emerald-500 border-emerald-100",
    Cancelled: "bg-rose-50 text-rose-500 border-rose-100"
  };
  return (
    <select value={status} onChange={(e) => onUpdate(e.target.value)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer ${styles[status] || styles.Pending}`}>
      <option value="Pending">Pending</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}

function ActionBtn({ onClick, icon, color }) { return <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-90 ${color}`}>{icon}</button>; }
function NavBtn({ onClick, disabled, icon }) { return <button onClick={onClick} disabled={disabled} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95">{icon}</button>; }