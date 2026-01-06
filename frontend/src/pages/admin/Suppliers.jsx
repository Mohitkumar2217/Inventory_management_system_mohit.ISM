import React, { useState } from "react";
import SupplierSummaryCard from "../../components/Summerys/SupplierSummaryCard.jsx";
import SupplierForm from "../../components/Forms/SupplierForm.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Globe, MapPin, ChevronLeft, ChevronRight,
  ShieldCheck, Truck
} from "lucide-react";

export default function Suppliers() {
  const initialVendors = Array.from({ length: 45 }).map((_, i) => ({
    id: 100 + i,
    name: `Vendor ${i + 1}`,
    address: `${i + 12} Logistics Park, New Delhi, India`,
    status: i % 4 === 0 ? "Inactive" : "Active",
    verification: i % 3 === 0 ? "Pending" : "Verified",
    warehouses: Math.floor(Math.random() * 5) + 1,
    suppliesQuantity: Math.floor(Math.random() * 500) + 100,
    hierarchy: `Level ${i % 3 + 1}`,
    email: `contact@vendor${i + 1}.com`,
    details: `Primary supplier for ${i % 2 === 0 ? 'Electronics' : 'Beauty'} category items.`,
  }));

  // --- STATES ---
  const [vendors, setVendors] = useState(initialVendors);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const initialFormState = {
    id: null, name: "", address: "", email: "", status: "Active",
    verification: "Verified", warehouses: 1, suppliesQuantity: 0,
    hierarchy: "Level 1", details: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (formData.id) {
      setVendors(vendors.map(v => v.id === formData.id ? { ...formData } : v));
    } else {
      setVendors([{ ...formData, id: Date.now() }, ...vendors]);
    }
    setView("list");
    setFormData(initialFormState);
  };

  const handleDeleteVendor = (id) => {
    if (!window.confirm("Are you sure you want to remove this partner from the network?")) return;
    setVendors(vendors.filter(v => v.id !== id));
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toString().includes(search);
    const matchesCompliance = complianceFilter === "All" || v.verification === complianceFilter;
    return matchesSearch && matchesCompliance;
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  const itemsSummary = {
    totalProducts: vendors.length,
    totalStock: vendors.filter(v => v.verification === "Verified").length,
    totalOrders: vendors.filter(v => v.status === "Active").length,
    totalCancelled: vendors.filter(v => v.verification === "Pending").length,
    totalRevenue: vendors.reduce((sum, v) => sum + v.suppliesQuantity, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <SupplierSummaryCard items={itemsSummary} nameSum="Suppliers" />

          {/* PAGE TITLE SECTION */}
          <div className="flex justify-between items-center "> 
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vendor Network</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1">
                <Globe size={14} className="text-green-500" /> {filteredVendors.length} Active Partners
              </p> 
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            {/* INTEGRATED TABLE TOOLBAR */}
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
              
              {/* Show Entries Section */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                Show
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                  className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-green-100 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={vendors.length}>All</option>
                </select>
                Entries
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                {/* Search Bar */}
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <Search className="text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by vendor name or ID..." 
                    className="bg-transparent outline-none font-bold text-sm w-full"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select 
                    className="bg-transparent outline-none font-bold text-xs text-slate-600 cursor-pointer"
                    value={complianceFilter}
                    onChange={(e) => {setComplianceFilter(e.target.value); setCurrentPage(1);}}
                  >
                    <option value="All">All Compliance</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Add Button Inside Table Header */}
                <button 
                  onClick={() => { setFormData(initialFormState); setView("add"); }} 
                  className="bg-green-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all text-sm whitespace-nowrap"
                >
                  <Plus size={18} /> Add Partner
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                  <tr>
                    <th className="p-5">Partner Info</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">SKU Vol</th>
                    <th className="p-5">Compliance</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-black shadow-inner">{v.name.charAt(0)}</div>
                        <div>
                          <p className="text-slate-700">{v.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{v.email}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <MapPin size={12} className="text-slate-300"/> {v.address.split(',')[0]}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600">{v.suppliesQuantity} Units</td>
                      <td className="p-5">
                         <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${v.verification === 'Verified' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                           {v.verification}
                         </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setSelectedVendor(v); setView("view-details"); }} className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14}/></button>
                          <button onClick={() => { setFormData(v); setView("add"); }} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteVendor(v.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* INTEGRATED PAGINATION FOOTER */}
            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVendors.length)} / {filteredVendors.length} entries
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
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-green-600 text-white shadow-xl shadow-green-100" : "text-slate-400 hover:bg-slate-50"}`}
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
      ) : view === "view-details" && selectedVendor ? (
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
          <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold mb-8 group transition-all">
            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
            Back to List
          </button>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
             <div className="flex gap-8 items-start mb-10">
                <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-green-600 border border-green-100 shadow-inner">{selectedVendor.name.charAt(0)}</div>
                <div>
                   <h1 className="text-4xl font-black text-slate-800 mb-2">{selectedVendor.name}</h1>
                   <div className="flex gap-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12}/> {selectedVendor.verification}</span>
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedVendor.hierarchy}</span>
                   </div>
                </div>
             </div>
             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={16} className="text-green-600"/>
                  <h3 className="text-[10px] font-black text-green-600 uppercase tracking-widest">Performance Notes</h3>
                </div>
                <p className="text-slate-600 italic leading-relaxed font-medium">"{selectedVendor.details}"</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={20} /></div>
              Go Back
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formData.id ? "Edit Partner Profile" : "Register New Partner"}</h1>
          </div>
          <SupplierForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleAddVendor} 
            onCancel={() => setView("list")} 
          />
        </div>
      )}
    </div>
  );
}