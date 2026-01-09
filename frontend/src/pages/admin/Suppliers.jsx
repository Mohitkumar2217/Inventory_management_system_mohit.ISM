import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SupplierSummaryCard from "../../components/Summerys/SupplierSummaryCard.jsx";
import SupplierForm from "../../components/Forms/SupplierForm.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Globe, MapPin, ChevronLeft, ChevronRight,
  ShieldCheck, Truck, Loader2
} from "lucide-react";

export default function Suppliers({ searchQuery }) {
  const { token } = useAuth(); //
  
  // --- STATES ---
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(""); 
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const initialFormState = {
    _id: null, name: "", address: "", email: "", status: "Active",
    verification: "Verified", warehouses: 1, suppliesQuantity: 0,
    hierarchy: "Level 1", details: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- API CONFIGURATION ---
  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` } //
  });

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/suppliers"); //
      if (res.data.success) {
        setVendors(res.data.suppliers);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (token) fetchVendors(); 
  }, [token]);

  // --- EFFECT: GLOBAL SEARCH RESET ---
  useEffect(() => {
    setCurrentPage(1); 
  }, [searchQuery, localSearch, complianceFilter]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. ADD OR UPDATE VENDOR ---
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = formData._id 
        ? await api.put(`/suppliers/${formData._id}`, formData) //
        : await api.post("/suppliers", formData); //

      if (res.data.success) {
        alert(res.data.message);
        fetchVendors(); 
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  // --- 3. DELETE VENDOR ---
  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this partner from the network?")) return;
    try {
      const res = await api.delete(`/suppliers/${id}`); //
      if (res.data.success) {
        fetchVendors();
      }
    } catch (err) {
      alert("Failed to remove partner.");
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredVendors = vendors.filter(v => {
    const finalSearch = (searchQuery || localSearch).toLowerCase();
    const matchesSearch = 
        v.name.toLowerCase().includes(finalSearch) || 
        v._id.toString().includes(finalSearch) ||
        v.email.toLowerCase().includes(finalSearch);
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

  if (loading && vendors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <SupplierSummaryCard items={itemsSummary} nameSum="Suppliers" />

          <div className="flex justify-between items-center mb-6"> 
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vendor Network</h1>
                <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                    <Globe size={14} className="text-green-500" /> {filteredVendors.length} Matches Found
                </p> 
              </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-slate-50 px-4 py-2 rounded-2xl">
                <span className="text-[10px] uppercase font-black opacity-40">View</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                  className="bg-transparent outline-none focus:ring-0 cursor-pointer font-black"
                >
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={vendors.length}>All</option>
                </select>
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <Search className="text-slate-300 group-focus-within:text-green-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Refine search locally..." 
                    className="bg-transparent outline-none font-bold text-sm w-full placeholder:text-slate-300"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select 
                    className="bg-transparent outline-none font-bold text-xs text-slate-600 cursor-pointer"
                    value={complianceFilter}
                    onChange={(e) => {setComplianceFilter(e.target.value); setCurrentPage(1);}}
                  >
                    <option value="All">All Status</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setFormData(initialFormState); setView("add"); }} 
                  className="bg-green-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all whitespace-nowrap"
                >
                  <Plus size={18} /> Add Partner
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                  <tr>
                    <th className="p-5">Partner Profile</th>
                    <th className="p-5">Geo Location</th>
                    <th className="p-5">Inventory Vol</th>
                    <th className="p-5">Trust Level</th>
                    <th className="p-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-black shadow-inner">{v.name.charAt(0)}</div>
                        <div>
                          <p className="text-slate-700">{v.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Ref: #{v._id.slice(-6)}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                          <MapPin size={12} className="text-rose-400"/> {v.address.split(',')[0]}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600 font-black text-xs">{v.suppliesQuantity} SKUs</td>
                      <td className="p-5">
                         <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${v.verification === 'Verified' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                           {v.verification}
                         </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setSelectedVendor(v); setView("view-details"); }} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14}/></button>
                          <button onClick={() => { setFormData(v); setView("add"); }} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteVendor(v._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Viewing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVendors.length)} / {filteredVendors.length} Partners
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
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-green-600 text-white shadow-xl shadow-green-100" : "text-slate-400 hover:bg-slate-50"}`}
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
      ) : view === "view-details" && selectedVendor ? (
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 pb-20 mt-10">
          <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest mb-8 group transition-all">
            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={18} /></div>
            Back to Registry
          </button>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
             <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
                <div className="w-40 h-40 bg-green-50 rounded-[3rem] flex items-center justify-center text-7xl font-black text-green-600 border border-green-100 shadow-2xl">{selectedVendor.name.charAt(0)}</div>
                <div className="pt-4 flex-1">
                   <span className="text-green-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Enterprise Partner Profile</span>
                   <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">{selectedVendor.name}</h1>
                   <div className="flex flex-wrap gap-3">
                      <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-100"><ShieldCheck size={12}/> Verified Security Tier</span>
                      <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedVendor.hierarchy} Priority</span>
                      <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-rose-400"/> India Hub</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contract Details</p>
                    <p className="text-slate-600 font-bold">Email: <span className="text-slate-800">{selectedVendor.email}</span></p>
                    <p className="text-slate-600 font-bold">Address: <span className="text-slate-800">{selectedVendor.address}</span></p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Truck size={14} className="text-green-600"/> Strategic Note</p>
                    <p className="text-slate-600 italic leading-relaxed font-bold text-lg opacity-80">"{selectedVendor.details}"</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500 mt-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
              Cancel Registration
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{formData._id ? "Sync Profile" : "Registry Protocol"}</h1>
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