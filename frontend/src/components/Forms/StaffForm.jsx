import React from "react";
import { User, Briefcase, MapPin, Clock, Save, FileText, ChevronDown } from "lucide-react";

export default function StaffForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: PERSONAL IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><User className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Employee Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Role</label>
              <div className="relative">
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold appearance-none shadow-inner">
                  <option value="Staff">Regular Staff</option>
                  <option value="Manager">Department Manager</option>
                  <option value="Admin">System Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: WORK DESCRIPTION */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><Briefcase className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Job Responsibilities</h2>
          </div>
          <textarea 
            name="works" 
            value={formData.works} 
            onChange={handleInputChange} 
            rows={4} 
            placeholder="Describe daily tasks, KPI targets, and department assignments..."
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* SECTION 3: SYSTEM STATUS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl"><Clock className="text-emerald-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Employment Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold shadow-inner">
                <option value="Active">Active / On Duty</option>
                <option value="Inactive">Inactive / On Leave</option>
              </select>
            </div>
            <FormInput label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate || ""} onChange={handleInputChange} />
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
            <Save size={24} /> {formData.id ? "Update Profile" : "Register Employee"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
      <input required={required} name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
    </div>
  );
}