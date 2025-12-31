import React, { useState, useRef, useEffect } from "react";
import OrderSummaryCard from "../../components/Summerys/OrderSummaryCard.jsx";
import OrderForm from "../../components/Forms/OrderForm.jsx"; // IMPORT THE NEW FORM
import {
  Search, Filter, Plus, Trash2,
  Eye, ArrowLeft, IndianRupee,
  Edit2
} from "lucide-react";

export default function Orders() {
  // --- INITIAL DATA ---
  const initialOrders = Array.from({ length: 40 }).map((_, i) => ({
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
  const [activeFilters, setActiveFilters] = useState({ status: "All" });

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
    const matchesSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toString().includes(search);
    const matchesStatus = activeFilters.status === "All" || o.status === activeFilters.status;

    let matchesPrice = true;
    if (activeFilters.priceRange === "Under ₹500") matchesPrice = o.price < 500;
    else if (activeFilters.priceRange === "₹500 - ₹2000") matchesPrice = o.price >= 500 && o.price <= 2000;
    else if (activeFilters.priceRange === "₹2000 - ₹5000") matchesPrice = o.price >= 2000 && o.price <= 5000;
    else if (activeFilters.priceRange === "₹5000 - ₹10000") matchesPrice = o.price >= 5000 && o.price <= 10000;
    else if (activeFilters.priceRange === "Above ₹10000") matchesPrice = o.price > 10000;

    return matchesSearch && matchesStatus && matchesPrice;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenDetails = (order) => { setSelectedOrder(order); setView("view-details"); };

  const handleEditDetails = (order) => {
    setPurchaseOrder({
      id: order.id,
      vendorName: order.client,
      itemName: order.category,
      category: order.category,
      quantity: order.amount,
      unitPrice: order.price,
      warehouse: "Main Warehouse",
      expectedDate: "",
      paymentTerms: "Due on Receipt",
      notes: order.details
    });
    setView("add");
  };

  const removeOrder = (id) => setOrders(orders.filter(o => o.id !== id));
  const updateStatus = (id, status) => setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));

  const itemsSummary = {
    totalProducts: orders.length,
    totalStock: orders.filter(o => o.status === "Pending").length,
    totalOrders: orders.filter(o => o.status === "Completed").length,
    totalCancelled: orders.filter(o => o.status === "Cancelled").length,
    totalRevenue: orders.filter(o => o.status === "Completed").reduce((sum, o) => sum + (o.amount * o.price), 0)
  };

  return (
    <div className="p-2 md:p-4 min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          <OrderSummaryCard items={itemsSummary} nameSum={'Orders'} />

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-4 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">

              {/* select page */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                Show
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={orders.length}>All</option>
                </select>
                Entries
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* search section */}
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search Client or ID..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                </div>
                {/* filter section */}
                <div className="relative" ref={filterRef}>
                  <button onClick={() => setShowFilterPopup(!showFilterPopup)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all border ${showFilterPopup ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}>
                    <Filter size={18} /> Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-50 w-56 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 animate-in zoom-in-95 duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Status</p>
                      <select className="w-full bg-slate-50 border-none rounded-xl p-2 text-xs font-bold outline-none" value={activeFilters.status} onChange={(e) => { setActiveFilters({ ...activeFilters, status: e.target.value }); setCurrentPage(1); }}>
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                          <select
                            value={activeFilters.priceRange}
                            onChange={(e) => setActiveFilters({ ...activeFilters, priceRange: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
                          >
                            <option value="All">Any Price</option>
                            <option value="Under ₹500">Under ₹500</option>
                            <option value="₹500 - ₹2000">₹500 - ₹2000</option>
                            <option value="₹2000 - ₹5000">₹2000 - ₹5000</option>
                            <option value="₹5000 - ₹10000">₹5000 - ₹10000</option>
                            <option value="Above ₹10000">Above ₹10000</option>
                          </select>
                        </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setPurchaseOrder(initialPurchaseForm); setView("add"); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                  <Plus size={18} /> Order
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="p-6">Order ID</th><th className="p-6">Vendor / Client</th><th className="p-6">Category</th><th className="p-6 text-right">Total</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-6 font-mono text-xs font-black text-indigo-400">#{order.id}</td>
                      <td className="p-6 font-bold text-slate-700 cursor-pointer hover:text-indigo-600" onClick={() => handleOpenDetails(order)}>{order.client}</td>
                      <td className="p-6"><span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{order.category}</span></td>
                      <td className="p-6 text-right font-black text-slate-800">₹{(order.amount * order.price).toLocaleString()}</td>
                      <td className="p-6 text-center"><StatusBadge status={order.status} onUpdate={(s) => updateStatus(order.id, s)} /></td>
                      <td className="p-5 text-right">
                        <div className="flex justify-center gap-2 transition-opacity">
                          <button onClick={() => handleOpenDetails(order)} className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                          <button onClick={() => handleEditDetails(order)} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                          <button onClick={() => removeOrder(order.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-all font-black">Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-xl transition-all font-black ${currentPage === i + 1 ? 'bg-cyan-400 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 border rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-all font-black">Next</button>
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedOrder ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold group transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Back to List
            </button>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden border border-slate-100">
            <h1 className="text-3xl font-black text-slate-800 mb-2">{selectedOrder.client}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Order ID: #{selectedOrder.id}</p>
            <div className="bg-slate-50 p-8 rounded-3xl mb-8">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Procurement Notes</h3>
              <p className="text-sm font-medium text-slate-600 italic leading-relaxed">"{selectedOrder.details}"</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total</p><p className="text-lg font-black text-slate-800">₹{(selectedOrder.price * selectedOrder.amount).toLocaleString()}</p></div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quantity</p><p className="text-lg font-black text-slate-800">{selectedOrder.amount} Units</p></div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p><p className={`text-lg font-black ${selectedOrder.status === 'Cancelled' ? 'text-rose-500' : 'text-emerald-500'}`}>{selectedOrder.status}</p></div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= CALL EXTERNAL FORM ================= */
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold group">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Back to List
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{purchaseOrder.id ? 'Edit' : 'Issue'} Purchase Order</h1>
          </div>

          <OrderForm
            purchaseOrder={purchaseOrder}
            handleFormChange={handleFormChange}
            handleSubmit={handleAddPurchaseOrder}
            onCancel={() => setView("list")}
          />
        </div>
      )}
    </div>
  );
}

// --- REMAINING SUB-COMPONENTS ---
function StatusBadge({ status, onUpdate }) {
  const configs = {
    Completed: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Pending: { bg: "bg-amber-50 text-amber-600 border-amber-100" },
    Cancelled: { bg: "bg-rose-50 text-rose-600 border-rose-100" },
  };
  const current = configs[status];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <select value={status} onChange={(e) => onUpdate(e.target.value)} className={`${current.bg} border appearance-none px-3 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer outline-none text-center transition-all`}>
        <option value="Completed">Completed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
}