import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import OrderSummaryCard from "../../components/Summerys/OrderSummaryCard.jsx";
import OrderForm from "../../components/Forms/OrderForm.jsx";
import {
  Search, Filter, Plus, Trash2, Tag, Activity,
  Eye, ArrowLeft, IndianRupee, Package,
  Edit2, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Layers, Loader2, AlertCircle, Truck, MapPin, Hash, Calendar
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
    _id: null, poNumber: "", refId: "", priority: "standard", vendorName: "", vendorEmail: "", itemName: "", sku: "", category: "", quantity: 1, unitPrice: "", taxRate: 0, shippingCharges: 0, discount: 0, warehouse: "", zone: "", whContact: "", shippingMethod: "", deliveryAddress: "", expectedDate: "", paymentTerms: "Due on Receipt", notes: "", images: []
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
      if (res.data.success) { alert(res.data.message); fetchOrders(); setView("list"); setPurchaseOrder(initialPurchaseForm); }
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
    const matchesSearch = (o.vendorName || "").toLowerCase().includes(finalSearch) || (o.poNumber || "").toLowerCase().includes(finalSearch) || (o._id || "").toLowerCase().includes(finalSearch) || (o.itemName || "").toLowerCase().includes(finalSearch) || (o.category || "").toLowerCase().includes(finalSearch) || (zoneName || "").toLowerCase().includes(finalSearch);
    const matchesStatus = activeFilters.status === "All" || o.status === activeFilters.status;
    const matchesPriority = activeFilters.priority === "All" || o.priority === activeFilters.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenDetails = (order) => { setSelectedOrder(order); setView("view-details"); setShowTracking(false); };
  const handleEditDetails = (order) => { setPurchaseOrder({ ...order, expectedDate: order.expectedDate ? order.expectedDate.split('T')[0] : "" }); setView("add"); };

  const getRemainingDays = (expectedDate) => {
    const diff = new Date(expectedDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
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
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventory Procurement</h1>
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
                  <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                </select>
              </div>
              <div className="flex flex-1 gap-3 w-full lg:max-w-3xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input type="text" placeholder="Search Vendor, PO#, or SKU..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
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
                            <option value="All">All Status</option><option value="Completed">Completed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                          <select value={activeFilters.priority} onChange={(e) => { setActiveFilters({ ...activeFilters, priority: e.target.value }); setCurrentPage(1); }} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all">
                            <option value="All">All Priorities</option><option value="standard">Standard</option><option value="urgent">Urgent</option><option value="critical">Critical</option>
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
          </div>
        </div>
      ) : view === "view-details" && selectedOrder ? (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20 mt-10">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100"><ArrowLeft size={18} /></div> Back
            </button>
            <button 
              onClick={() => setShowTracking(!showTracking)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${showTracking ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}
            >
              {showTracking ? <XCircle size={18} /> : <Truck size={18} />}
              {showTracking ? "Exit Tracker" : "Track Order Live"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="lg:col-span-2 space-y-8">
              {showTracking ? (
                /* LIVE TRACKER UI */
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-indigo-50 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <Activity className="text-indigo-500 animate-pulse" size={28} />
                        Transit Status
                      </h2>
                      <p className="text-indigo-500 font-bold text-xs uppercase mt-1">ID: <span className="font-mono">{selectedOrder.trackingId || 'TRK-GEN-99'}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                      <p className="text-xl font-black text-slate-800">{getRemainingDays(selectedOrder.expectedDate)} Days Left</p>
                    </div>
                  </div>

                  <div className="flex justify-between relative mb-24 px-4">
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
                    <div 
                      className="absolute top-1/2 left-0 h-1.5 bg-indigo-500 -translate-y-1/2 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                      style={{ width: selectedOrder.status === 'Delivered' ? '100%' : selectedOrder.status === 'Shipped' ? '66.6%' : selectedOrder.status === 'Processing' ? '33.3%' : '0%' }} 
                    />
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                      const isActive = selectedOrder.status === step;
                      const isCompleted = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(selectedOrder.status) >= i;
                      return (
                        <div key={i} className="relative z-10 flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 scale-125 ring-8 ring-indigo-50' : isCompleted ? 'bg-emerald-500' : 'bg-white text-slate-300'}`}>
                            {isActive ? <Loader2 className="text-white animate-spin" size={24} /> : isCompleted ? <CheckCircle size={24} className="text-white" /> : <div className="w-3 h-3 bg-slate-200 rounded-full" />}
                          </div>
                          <div className="absolute -bottom-12 flex flex-col items-center min-w-[100px]">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>{step}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                    <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                      <p className="text-[10px] font-black text-indigo-500 uppercase mb-3 tracking-widest flex items-center gap-2"><Truck size={14} /> Origin Supplier</p>
                      <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600">{selectedOrder.vendorName}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">{selectedOrder.vendorEmail || 'orders@vendor.com'}</p>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                      <p className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest flex items-center gap-2"><MapPin size={14} /> Destination Hub</p>
                      <p className="font-black text-slate-800 text-lg group-hover:text-emerald-600">{selectedOrder.warehouse}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">Zone: {typeof selectedOrder.zone === 'object' ? selectedOrder.zone.name : selectedOrder.zone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDARD DETAILS UI */
                <>
                  <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-10 relative z-10 gap-6">
                      <div>
                        <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block tracking-widest">Order Specification</span>
                        <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{selectedOrder.itemName}</h1>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ref: {selectedOrder.poNumber || selectedOrder._id}</p>
                          <PriorityBadge priority={selectedOrder.priority} />
                        </div>
                      </div>
                      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white text-right shadow-xl min-w-[240px]">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Total Order Value</p>
                        <p className="text-4xl font-black tracking-tighter">₹{(selectedOrder.totalOrderValue || (selectedOrder.quantity * selectedOrder.unitPrice)).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Truck size={16} className="text-indigo-500" /> Logistics & Destination</h3>
                        <div className="space-y-4">
                          <DetailRow label="Warehouse" value={selectedOrder.warehouse} />
                          <DetailRow label="Shipping Method" value={selectedOrder.shippingMethod} />
                          <DetailRow label="Delivery Address" value={selectedOrder.deliveryAddress} />
                          <DetailRow label="Expected ETA" value={selectedOrder.expectedDate ? new Date(selectedOrder.expectedDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : "N/A"} />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><IndianRupee size={16} className="text-amber-500" /> Financial Breakdown</h3>
                        <div className="space-y-4">
                          <DetailRow label="Unit Cost" value={`₹${selectedOrder.unitPrice}`} />
                          <DetailRow label="Quantity" value={selectedOrder.quantity} />
                          <DetailRow label="Tax Rate" value={`${selectedOrder.taxRate || 0}%`} />
                          <DetailRow label="Discount" value={`₹${selectedOrder.discount || 0}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Tag size={16} className="text-emerald-500" /> Business Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <DetailRow label="Primary Supplier" value={selectedOrder.vendorName} />
                      <DetailRow label="Supplier Email" value={selectedOrder.vendorEmail || "N/A"} />
                      <DetailRow label="Asset Category" value={selectedOrder.category} />
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100/50 relative">
                    <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Internal Notes</div>
                    <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{selectedOrder.notes || 'No specific notes recorded.'}"</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commitment</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Calendar size={18} className="text-slate-400" /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">Target Date</p>
                        <p className="text-xs font-bold text-slate-300">{new Date(selectedOrder.expectedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Clock size={18} className="text-slate-400" /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">Assigned Duration</p>
                        <p className="text-xs font-bold text-slate-300">{selectedOrder.estimatedDuration || 7} Working Days</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={200} />
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} className="text-indigo-400" /> Fulfillment Status</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${selectedOrder.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Current Stage</p><p className="text-sm font-black text-slate-700 uppercase">{selectedOrder.status}</p></div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Allocation</h3>
                <DetailRow label="Assigned Zone" value={typeof selectedOrder.zone === 'object' ? selectedOrder.zone?.name : selectedOrder.zone || "N/A"} />
                <div className="mt-4 pt-4 border-t border-slate-200"><DetailRow label="Warehouse Contact" value={selectedOrder.whContact || "N/A"} /></div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                 <div className="relative z-10">
                    <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Inventory SKU</h3>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-4 flex items-center gap-3">
                      <Package className="text-indigo-400" size={24} />
                      <p className="text-xl font-black tracking-widest uppercase">{selectedOrder.sku || 'NO-SKU'}</p>
                    </div>
                 </div>
                 <Layers className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={150} />
              </div>
            </div>
          </div>
          <Layers className="absolute -right-20 -bottom-20 text-slate-50 rotate-12" size={400} />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 mt-10">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-500 font-bold transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100"><ArrowLeft size={18} /></div> Back
          </button>
          <OrderForm purchaseOrder={purchaseOrder} handleFormChange={handleFormChange} handleSubmit={handleAddPurchaseOrder} onCancel={() => setView("list")} suppliers={supplierList} zones={zoneList} categories={categoryList} warehouses={warehouseList} allProducts={[]} />
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
  const styles = { Pending: "bg-indigo-50 text-indigo-500 border-indigo-100", Completed: "bg-emerald-50 text-emerald-500 border-emerald-100", Cancelled: "bg-rose-50 text-rose-500 border-rose-100" };
  return (
    <select value={status} onChange={(e) => onUpdate(e.target.value)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer ${styles[status]}`}>
      <option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
    </select>
  );
}

function DetailRow({ label, value }) { return <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span><span className="text-sm font-bold text-slate-700">{value || "N/A"}</span></div>; }
function ActionBtn({ onClick, icon, color }) { return <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-90 ${color}`}>{icon}</button>; }
function NavBtn({ onClick, disabled, icon }) { return <button onClick={onClick} disabled={disabled} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95">{icon}</button>; }