import React, { useState, useRef, useEffect } from "react";
import SupplierSummaryCard from "../../components/Summerys/SupplierSummaryCard.jsx";
import SupplierForm from "../../components/Forms/SupplierForm.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Globe, MapPin, ChevronLeft, ChevronRight,
  ShieldCheck, Truck
} from "lucide-react";

export default function Suppliers() {
  const initialVendors = Array.from({ length: 15 }).map((_, i) => ({
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
  const [selectedVendor, setSelectedVendor] = useState(null);
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

  // --- NEW: DELETE HANDLER ---
  const handleDeleteVendor = (id) => {
    if (window.confirm("Are you sure you want to remove this partner from the network?")) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toString().includes(search)
  );

  const itemsSummary = {
    totalProducts: vendors.length,
    totalStock: vendors.filter(v => v.verification === "Verified").length,
    totalOrders: vendors.filter(v => v.status === "Active").length,
    totalCancelled: vendors.filter(v => v.verification === "Pending").length,
    totalRevenue: vendors.reduce((sum, v) => sum + v.suppliesQuantity, 0),
  };

  const currentItems = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-700">
          <SupplierSummaryCard items={itemsSummary} nameSum="Suppliers" />

          <div className="flex justify-between items-center mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vendor Network</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1">
                <Globe size={14} className="text-green-500" /> {filteredVendors.length} Active Partners
              </p>
            </div>
            <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
              <Plus size={20} /> Partner
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50">
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
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-black">{v.name.charAt(0)}</div>
                        <div><p>{v.name}</p><p className="text-[10px] text-slate-400 uppercase font-black">{v.email}</p></div>
                      </td>
                      <td className="p-5"><span className="flex items-center gap-1 text-slate-500 text-xs"><MapPin size={12}/> {v.address.split(',')[0]}</span></td>
                      <td className="p-5">{v.suppliesQuantity} Units</td>
                      <td className="p-5">
                         <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${v.verification === 'Verified' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{v.verification}</span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setSelectedVendor(v); setView("view-details"); }} className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14}/></button>
                          <button onClick={() => { setFormData(v); setView("add"); }} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14}/></button>
                          {/* ADDED DELETE BUTTON */}
                          <button onClick={() => handleDeleteVendor(v.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedVendor ? (
        /* DETAILS VIEW remains the same */
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
          <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold mb-8 group transition-all">
            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
            Back to List
          </button>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
             <div className="flex gap-8 items-start mb-10">
                <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-green-600 border border-green-100">{selectedVendor.name.charAt(0)}</div>
                <div>
                   <h1 className="text-4xl font-black text-slate-800 mb-2">{selectedVendor.name}</h1>
                   <div className="flex gap-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12}/> {selectedVendor.verification}</span>
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedVendor.hierarchy}</span>
                   </div>
                </div>
             </div>
             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h3 className="text-[10px] font-black text-green-600 uppercase mb-4 tracking-widest">Performance Notes</h3>
                <p className="text-slate-600 italic leading-relaxed">"{selectedVendor.details}"</p>
             </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW remains the same */
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={20} /></div>
              Go Back
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formData.id ? "Edit Partner" : "Register Partner"}</h1>
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