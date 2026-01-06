import React, { useState, useRef, useEffect } from "react";
import OrderSummaryCard from "../../components/Summerys/OrderSummaryCard.jsx";
import OrderForm from "../../components/Forms/OrderForm.jsx";
import {
  Search, Filter, Plus, Trash2,
  Eye, ArrowLeft, IndianRupee,
  Edit2, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle,Layers
} from "lucide-react";

export default function Orders() {
  // --- INITIAL DATA ---
  const initialOrders = Array.from({ length: 45 }).map((_, i) => ({
    id: 1000 + i,
    client: `Vendor ${i + 1}`,
    category: i % 2 === 0 ? "Electronics" : "Beauty",
    amount: Math.floor(Math.random() * 5) + 1,
    price: (i + 1) * 500,
    status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Cancelled",
    stockUpdated: true,
    details: `Stock procurement for order #${1000 + i}. Priority shipping requested from vendor.`,
  }));

  // --- STATES ---
  const [orders, setOrders] = useState(initialOrders);
  const [view, setView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const filterRef = useRef(null);

  // PAGINATION & FILTER STATE
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ status: "All", priceRange: "All" });

  const initialPurchaseForm = {
    id: null, vendorName: "", itemName: "", category: "Electronics",
    quantity: 1, unitPrice: "", warehouse: "Main Warehouse",
    expectedDate: "", paymentTerms: "Due on Receipt", notes: ""
  };
  const [purchaseOrder, setPurchaseOrder] = useState(initialPurchaseForm);

  // --- HANDLERS ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterPopup(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPurchaseOrder = (e) => {
    if (e) e.preventDefault();
    const newEntry = {
      id: purchaseOrder.id || 1000 + orders.length + 1,
      client: purchaseOrder.vendorName,
      category: purchaseOrder.category,
      amount: parseInt(purchaseOrder.quantity),
      price: parseFloat(purchaseOrder.unitPrice) || 0,
      status: purchaseOrder.id ? orders.find(o => o.id === purchaseOrder.id).status : "Pending",
      stockUpdated: false,
      details: purchaseOrder.notes || `Stock order for ${purchaseOrder.itemName}`
    };

    if (purchaseOrder.id) {
      setOrders(orders.map(o => o.id === purchaseOrder.id ? newEntry : o));
    } else {
      setOrders([newEntry, ...orders]);
    }

    setPurchaseOrder(initialPurchaseForm);
    setView("list");
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredOrders = orders.filter((o) => {
    const totalPrice = o.amount * o.price;
    const matchesSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toString().includes(search);
    const matchesStatus = activeFilters.status === "All" || o.status === activeFilters.status;

    let matchesPrice = true;
    if (activeFilters.priceRange === "Under ₹500") matchesPrice = totalPrice < 500;
    else if (activeFilters.priceRange === "₹500 - ₹2000") matchesPrice = totalPrice >= 500 && totalPrice <= 2000;
    else if (activeFilters.priceRange === "₹2000 - ₹5000") matchesPrice = totalPrice >= 2000 && totalPrice <= 5000;
    else if (activeFilters.priceRange === "Above ₹5000") matchesPrice = totalPrice > 5000;

    return matchesSearch && matchesStatus && matchesPrice;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenDetails = (order) => { setSelectedOrder(order); setView("view-details"); };
  const handleEditDetails = (order) => {
    setPurchaseOrder({
      id: order.id, vendorName: order.client, itemName: order.category,
      category: order.category, quantity: order.amount, unitPrice: order.price,
      warehouse: "Main Warehouse", expectedDate: "", paymentTerms: "Due on Receipt", notes: order.details
    });
    setView("add");
  };

  const removeOrder = (id) => { if(window.confirm("Delete this order record?")) setOrders(orders.filter(o => o.id !== id)); };
  const updateStatus = (id, status) => setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));

  const itemsSummary = {
    totalProducts: orders.length,
    totalStock: orders.filter(o => o.status === "Pending").length,
    totalOrders: orders.filter(o => o.status === "Completed").length,
    totalCancelled: orders.filter(o => o.status === "Cancelled").length,
    totalRevenue: orders.filter(o => o.status === "Completed").reduce((sum, o) => sum + (o.amount * o.price), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-500">
          <OrderSummaryCard items={itemsSummary} nameSum={'Orders'} />

          {/* MAIN PAGE TITLE - PRESERVED */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Orders Inventory</h1>
            <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
              <Layers size={14} className="text-indigo-500" /> {filteredOrders.length} Orders
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
              
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={orders.length}>All</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full lg:max-w-3xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input type="text" placeholder="Search client name or ID..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
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
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                          <select value={activeFilters.priceRange} onChange={(e) => { setActiveFilters({ ...activeFilters, priceRange: e.target.value }); setCurrentPage(1); }} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all">
                            <option value="All">Any Price</option>
                            <option value="Under ₹500">Under ₹500</option>
                            <option value="₹500 - ₹2000">₹500 - ₹2000</option>
                            <option value="₹2000 - ₹5000">₹2000 - ₹5000</option>
                            <option value="Above ₹5000">Above ₹5000</option>
                          </select>
                        </div>
                        <button onClick={() => setActiveFilters({ status: "All", priceRange: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setPurchaseOrder(initialPurchaseForm); setView("add"); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95">
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
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-mono text-xs font-black text-indigo-400">#{order.id}</td>
                      <td className="p-6 text-slate-800 font-black cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleOpenDetails(order)}>{order.client}</td>
                      <td className="p-6"><span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase text-[9px] font-black shadow-sm">{order.category}</span></td>
                      <td className="p-6 text-right text-slate-800 font-black">₹{(order.amount * order.price).toLocaleString()}</td>
                      <td className="p-6 text-center"><StatusBadge status={order.status} onUpdate={(s) => updateStatus(order.id, s)} /></td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <ActionBtn onClick={() => handleOpenDetails(order)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(order)} icon={<Edit2 size={14} />} color="bg-slate-50 text-slate-500 hover:bg-slate-800" />
                          <ActionBtn onClick={() => removeOrder(order.id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} / {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <NavBtn onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} icon={<ChevronLeft size={18}/>} />
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <NavBtn onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} icon={<ChevronRight size={18}/>} />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100"><ArrowLeft size={18} /></div> Back
          </button>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Purchase Order Information</span>
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{selectedOrder.client}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Ref ID: #{selectedOrder.id}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><IndianRupee size={12}/> Valuation</p>
                 <p className="text-2xl font-black text-slate-800">₹{(selectedOrder.price * selectedOrder.amount).toLocaleString()}</p>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Package size={12}/> Volume</p>
                 <p className="text-2xl font-black text-slate-800">{selectedOrder.amount} Units</p>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</p>
                 <p className="text-2xl font-black text-slate-800">{selectedOrder.category}</p>
               </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
              <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Notes & Requirements</div>
              <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{selectedOrder.details}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
             <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Back
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
    Completed: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle size={10}/> },
    Pending: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={10}/> },
    Cancelled: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={10}/> },
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