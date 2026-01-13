import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; //
import StaffSummaryCard from "../../components/Summerys/StaffSummaryCard.jsx";
import StaffForm from "../../components/Forms/StaffForm.jsx";
import {
  Search, Plus, Trash2, Eye, ArrowLeft, Edit2,
  UserCog, Mail, Briefcase,
  Calendar, Info, ChevronLeft, ChevronRight, Filter, Loader2
} from "lucide-react";

export default function Staff({ searchQuery }) {
  const { token } = useAuth();
  // --- STATES ---
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const initialFormState = { name: "", works: "", role: "staff", status: "Active", email: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);

  // --- API CONFIGURATION ---
  const api = axios.create({
    baseURL: "https://inventory-management-system-mohit-ism.onrender.com/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staffs");
      if (res.data.success) {
        setStaffList(res.data.staff);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) fetchStaff();
  }, [token]);

  // AUTO-RESET PAGINATION ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, roleFilter]);

  // --- 1. HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. ADD OR UPDATE STAFF ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = formData._id
        ? await api.put(`/staffs/${formData._id}`, formData)
        : await api.post("/staffs", formData);
      if (res.data.success) {
        alert(res.data.message);
        fetchStaff();
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleOpenDetails = (staff) => {
    setSelectedStaff(staff);
    setView("view-details");
  };

  // --- 3. DELETE STAFF ---
  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Delete this staff member permanently?")) return;
    try {
      const res = await api.delete(`/staffs/${id}`);
      if (res.data.success) {
        fetchStaff();
      }
    } catch (err) {
      alert("Failed to remove member.");
    }
  };

  const itemsSummary = {
    totalStaff: staffList.length,
    activeStaff: staffList.filter(s => s.status === "Active").length,
    inactiveStaff: staffList.filter(s => s.status === "Inactive").length,
    admins: staffList.filter(s => s.role === "admin").length,
    managers: staffList.filter(s => s.role === "manager").length,
  };

  // --- FILTER LOGIC ---
  const filteredStaff = staffList.filter(s => {
    const finalSearch = (searchQuery || localSearch).toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(finalSearch) ||
      s.email.toLowerCase().includes(finalSearch) ||
      s.role.toLowerCase().includes(finalSearch);
    const matchesRole = roleFilter === "All" || s.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && staffList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-700">
          <StaffSummaryCard items={itemsSummary} nameSum="Team" />
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Staff Directory</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <UserCog size={14} className="text-indigo-500" /> {filteredStaff.length} Members Matching
              </p>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer"
                >
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={staffList.length}>All</option>
                </select>
              </div>

              <div className="flex flex-1 items-center gap-3 w-full lg:max-w-3xl justify-end">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <Search className="text-slate-300 group-focus-within:text-indigo-400" size={18} />
                  <input
                    type="text"
                    placeholder="Quick search name, email or role..."
                    className="bg-transparent outline-none font-bold text-sm w-full placeholder:text-slate-300"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select
                    className="bg-transparent outline-none font-bold text-xs text-slate-600 cursor-pointer"
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="All">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <button
                  onClick={() => { setFormData(initialFormState); setView("add"); }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all whitespace-nowrap"
                >
                  <Plus size={18} /> Add Staff
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50 tracking-widest">
                  <tr>
                    <th className="p-5">Member Name</th>
                    <th className="p-5">Organization Role</th>
                    <th className="p-5">Employment Status</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((staff) => (
                    <tr key={staff._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-inner">{staff.name.charAt(0)}</div>
                        <div>
                          <p className="text-slate-700">{staff.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{staff.email}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-[10px] uppercase font-black text-slate-500">{staff.role}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${staff.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{staff.status}</span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenDetails(staff)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                          <button onClick={() => { setFormData(staff); setView("add"); }} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteStaff(staff._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStaff.length === 0 && (
                <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs italic">
                  No matching team members found.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStaff.length)} / {filteredStaff.length} members
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
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:bg-slate-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
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
      ) : view === "view-details" && selectedStaff ? (
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700">
          <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all mt-10">
            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
            Back
          </button>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden mt-8">
            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
              <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-indigo-600 border border-indigo-100 shadow-inner">
                {selectedStaff.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{selectedStaff.name}</h1>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-8">{selectedStaff.role} • Security Level {selectedStaff.role === 'admin' ? '01' : '02'}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DetailItem icon={<Mail size={14} />} label="Work Email" value={selectedStaff.email} />
                  <DetailItem icon={<Briefcase size={14} />} label="Department" value="Logistics Hub" />
                  <DetailItem icon={<Calendar size={14} />} label="Joined Date" value={new Date(selectedStaff.createdAt).toLocaleDateString()} />
                </div>
              </div>
            </div>

            <div className="mt-12 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500">
                  <Info size={16} />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Responsibilities & Bio</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">
                "{selectedStaff.works || 'No description provided.'}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500 mt-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-bold group transition-all">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Back
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formData._id ? "Edit Employee Profile" : "Register New Member"}</h1>
          </div>
          <StaffForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} onCancel={() => setView("list")} />
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">{icon} {label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}