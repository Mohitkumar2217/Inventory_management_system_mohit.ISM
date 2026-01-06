import React, { useState } from "react";
import WarehouseSummaryCard from "../../components/Summerys/WareHouseSummaryCard.jsx";
import WarehouseForm from "../../components/Forms/WarehouseForm.jsx";
import {
  Search, Plus, Trash2, Eye, ArrowLeft, Edit2,
  PackageSearch, MapPin, Info, Hash, ChevronLeft, ChevronRight, Filter
} from "lucide-react";

export default function Warehouse() {
  const initialStock = Array.from({ length: 45 }).map((_, i) => ({
    id: i + 1,
    product: `Product ${i + 1}`,
    quantity: Math.floor(Math.random() * 100),
    status: i % 5 === 0 ? "Out of Stock" : "In Stock",
    zone: `Zone ${String.fromCharCode(65 + (i % 4))}-${i + 1}`,
    details: `Handling instructions for Product ${i + 1}. Ensure temperature control if applicable. SKU-WARE-${100 + i}.`,
  }));

  const [stockList, setStockList] = useState(initialStock);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({ product: "", quantity: 0, status: "In Stock", details: "", zone: "" });

  const itemsSummary = {
    totalProducts: stockList.length,
    totalQuantity: stockList.reduce((sum, s) => sum + s.quantity, 0),
    inStockCount: stockList.filter(s => s.status === "In Stock").length,
    outOfStockCount: stockList.filter(s => s.status === "Out of Stock").length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setStockList(stockList.map(s => s.id === formData.id ? { ...formData } : s));
    } else {
      setStockList([{ ...formData, id: Date.now() }, ...stockList]);
    }
    setView("list");
  };

  const handleOpenDetails = (stock) => {
    setSelectedStock(stock);
    setView("view-details");
  };

  // Filter & Search Logic
  const filteredStock = stockList.filter(s => {
    const matchesSearch = s.product.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStock.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <WarehouseSummaryCard items={itemsSummary} nameSum="Inventory" />

          {/* PAGE TITLE - PRESERVED */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Warehouse Ledger</h1>
            <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-widest">
              <PackageSearch size={14} className="text-orange-500" /> Tracking {filteredStock.length} SKUs
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            {/* INTEGRATED TOOLBAR */}
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white">

              {/* Entries Selector */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                Show
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer font-black"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={stockList.length}>All</option>
                </select>
                Entries
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                {/* Search Input */}
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <Search className="text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by product title or SKU..."
                    className="bg-transparent outline-none font-bold text-sm w-full placeholder:text-slate-300"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>

                {/* Status Filter */}
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

                {/* Add Button */}
                <button
                  onClick={() => { setFormData({ product: "", quantity: 0, status: "In Stock", details: "", zone: "" }); setView("add"); }}
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
                    <th className="p-5">Stock Item</th>
                    <th className="p-5">Zone Location</th>
                    <th className="p-5">Quantity</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((stock) => (
                    <tr key={stock.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3 font-bold text-slate-700">{stock.product}</td>
                      <td className="p-5 text-slate-500">
                        <span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">{stock.zone}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${stock.status === "In Stock" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{stock.quantity} Units</span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenDetails(stock)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                          <button onClick={() => { setFormData(stock); setView("add"); }} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                          <button onClick={() => setStockList(stockList.filter(s => s.id !== stock.id))} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStock.length)} / {filteredStock.length} items
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
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
                  )).slice(Math.max(0, activePage - 3), Math.min(totalPages, activePage + 2))}
                </div>

                <button
                  disabled={activePage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedStock ? (
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold group transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all">
                <ArrowLeft size={20} />
              </div>
              Back to Ledger
            </button>
            <div className="text-right">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${selectedStock.status === "In Stock" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {selectedStock.status}
              </span>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
              <div className="w-40 h-40 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-6xl border border-orange-100 shadow-inner">
                📦
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{selectedStock.product}</h1>
                <p className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-8">Stock Record ID: #{selectedStock.id}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} /> Zone Location</p>
                    <p className="text-xl font-black text-slate-800">{selectedStock.zone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Hash size={12} /> Current Quantity</p>
                    <p className="text-xl font-black text-slate-800">{selectedStock.quantity} Units</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Info size={16} className="text-orange-500" />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Notes & Instructions</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">"{selectedStock.details}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Back to Ledger
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formData.id ? "Edit Stock Item" : "Register New Stock"}</h1>
          </div>
          <WarehouseForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} onCancel={() => setView("list")} />
        </div>
      )}
    </div>
  );
}