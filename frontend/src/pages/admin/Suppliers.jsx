import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SupplierSummaryCard from "../../components/Summerys/SupplierSummaryCard.jsx";
import SupplierForm from "../../components/Forms/SupplierForm.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Globe, MapPin, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import SupplierDetailPage from "../details/SupplierDetailPage.jsx";

export default function Suppliers({ searchQuery }) {
  const { token } = useAuth();

  // --- STATES ---
  const [vendors, setVendors] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [warehouseList, setWarehouseList] = useState({});
  const [categoriesList, setCategoriesList] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const initialFormState = {
    _id: null, name: "", address: "", photo: "", email: "", phone: "",
    status: "Active", suppliesQuantity: 0, hierarchy: "Level 1", details: "", idCard: "",
    itemsDetails: [{
      itemName: "",
      category: "",
      unitPrice: 0,
      brand: "",
      Mop: 0,
      itemid: "",
      itemDescription: ""
    }],
    isCurrentlyActiveForDelivery: true, itemLimit: 0, verification: "Pending",
    documents: { licence: "", contract: "", idProof: "", addressProof: "" },
    connectedWarehouses: [{ warehouseId: null, warehouseName: "", itemCountSupplied: 0 }],
    bankDetails: { bankName: "", accountNumber: "", ifscCode: "", bankBranch: "" },
    performance: {
      daysActive: 0, deliveryPercentage: 100, goodsQualityStatus: "Good",
      deliveryAccuracy: 100, staffFeedback: [], totalOrdersCompleted: 0
    },
    history: {
      lastDelivery: { status: "completed", date: null, orderId: null },
      paymentHistory: []
    },
    description: { ranking: 0, additionalNotes: "" }
  };
  const [formData, setFormData] = useState(initialFormState);

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/suppliers");
      if (res.data.success) {
        setVendors(res.data.suppliers || []);
        setSummaryData(res.data.summary || {});
        setCategoriesList(res.data.availableCategories);
        setWarehouseList(res.data.availableWarehouses);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, complianceFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const data = new FormData();

        // 1. Append Standard Text Fields
        const simpleFields = ["name", "address", "email", "phone", "status", "verification", "itemLimit", "details", "isCurrentlyActiveForDelivery"];
        simpleFields.forEach(field => {
            if (formData[field] !== undefined) data.append(field, formData[field]);
        });

        // 2. Stringify and Append Complex Objects
        data.append("itemsDetails", JSON.stringify(formData.itemsDetails));
        data.append("connectedWarehouses", JSON.stringify(formData.connectedWarehouses));
        data.append("bankDetails", JSON.stringify(formData.bankDetails));
        data.append("description", JSON.stringify(formData.description));
        data.append("performance", JSON.stringify(formData.performance));

        // 3. Append Files (Binary data from state)
        if (formData.photo instanceof File) data.append("photo", formData.photo);
        if (formData.idCard instanceof File) data.append("idCard", formData.idCard);
        
        // Nested Files (Keys must match the backend router names)
        if (formData.documents?.licence instanceof File) data.append("documents.licence", formData.documents.licence);
        if (formData.documents?.contract instanceof File) data.append("documents.contract", formData.documents.contract);
        if (formData.documents?.idProof instanceof File) data.append("documents.idProof", formData.documents.idProof);
        if (formData.documents?.addressProof instanceof File) data.append("documents.addressProof", formData.documents.addressProof);
        
        if (formData.bankDetails?.bankPassbookProof instanceof File) {
            data.append("bankDetails.bankPassbookProof", formData.bankDetails.bankPassbookProof);
        }

        // 4. Send Request
        const url = formData._id ? `/suppliers/${formData._id}` : "/suppliers";
        const method = formData._id ? "put" : "post";

        const res = await api[method](url, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (res.data.success) {
            alert(res.data.message);
            fetchVendors();
            setView("list");
            setFormData(initialFormState);
        }
    } catch (err) {
        console.error("Submission Error:", err);
        alert(err.response?.data?.message || "Operation failed");
    } finally {
        setLoading(false);
    }
};

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this partner?")) return;
    try {
      const res = await api.delete(`/suppliers/${id}`);
      if (res.data.success) fetchVendors();
    } catch (err) {
      alert("Failed to remove partner.");
    }
  };

  // --- FILTER & SEARCH ---
  const filteredVendors = vendors.filter(v => {
    const finalSearch = (searchQuery || localSearch || "").toLowerCase();
    const matchesSearch =
      (v.name || "").toLowerCase().includes(finalSearch) ||
      (v._id || "").toString().includes(finalSearch) ||
      (v.email || "").toLowerCase().includes(finalSearch);
    const matchesCompliance = complianceFilter === "All" || v.verification === complianceFilter;
    return matchesSearch && matchesCompliance;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && vendors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <SupplierSummaryCard items={summaryData} nameSum="Suppliers" />

          <div className="flex justify-between items-center mb-6 mt-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vendor Network</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Globe size={14} className="text-green-500" /> {filteredVendors.length} Partners Active
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-slate-50 px-4 py-2 rounded-2xl">
                <span className="text-[10px] uppercase font-black opacity-40">Limit</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-transparent outline-none cursor-pointer font-black">
                  <option value={5}>05</option><option value={10}>10</option><option value={20}>20</option>
                </select>
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <Search className="text-slate-300 group-focus-within:text-green-500" size={18} />
                  <input type="text" placeholder="Search by name, email or ID..." className="bg-transparent outline-none font-bold text-sm w-full" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select className="bg-transparent outline-none font-bold text-xs text-slate-600" value={complianceFilter} onChange={(e) => { setComplianceFilter(e.target.value); setCurrentPage(1); }}>
                    <option value="All">All Compliance</option><option value="Verified">Verified Only</option><option value="Pending">Pending Audit</option>
                  </select>
                </div>

                <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-green-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                  <Plus size={18} /> New Partner
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                  <tr>
                    <th className="p-5">Partner Identity</th>
                    <th className="p-5">Logistics Area</th>
                    <th className="p-5">Supply Volume</th>
                    <th className="p-5">Compliance</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-black shadow-inner overflow-hidden border border-green-100">
                          {v.photo ? <img src={v.photo} alt="p" className="w-full h-full object-cover" /> : v.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-700">{v.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">ID: #{v._id?.slice(-6)}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                          <MapPin size={12} className="text-rose-400" /> {v.address?.split(',')[0] || "Global"}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600 font-black text-xs">{v.suppliesQuantity || 0} Units</td>
                      <td className="p-5">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${v.verification === 'Verified' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {v.verification || 'Pending'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${v.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setSelectedVendor(v); setView("view-details"); }} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                          <button onClick={() => { setFormData(v); setView("add"); }} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteVendor(v._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {currentItems.length} of {filteredVendors.length} Records
              </p>
              <div className="flex items-center gap-2">
                <button disabled={activePage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={18} /></button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-green-600 text-white shadow-xl shadow-green-100" : "text-slate-400 hover:bg-slate-50"}`}>{i + 1}</button>
                  ))}
                </div>
                <button disabled={activePage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedVendor ? (
        /* ======================== DETAILED VIEW FULL SCHEMA ======================== */
        <div className="max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 pb-20 mt-10">
          <SupplierDetailPage
            selectedVendor={selectedVendor}
            onBack={() => setView("list")}
          />
        </div>
      ) : (
        /* ======================== FORM VIEW ======================== */
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500 mt-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-all"><ArrowLeft size={18} /></div>
              Back to Registry
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{formData._id ? "Update Profile" : "Register Partner"}</h1>
          </div>
          <SupplierForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleAddVendor}
            onCancel={() => setView("list")}
            warehouses={warehouseList}
            categories={categoriesList}
          />
        </div>
      )}
    </div>
  );
}

// --- SHARED UI HELPERS ---
function MetricCard({ label, val }) {
  return (
    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-slate-800 mt-1">{val}</p>
    </div>
  );
}

function TreasuryRow({ label, val, isMono }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className={`text-xs font-bold text-slate-700 ${isMono ? 'font-mono' : ''}`}>{val || "N/A"}</span>
    </div>
  );
}