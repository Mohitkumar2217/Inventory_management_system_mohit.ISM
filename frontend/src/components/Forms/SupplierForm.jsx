import React from "react";
import { 
  Truck, ShieldCheck, Globe, Save, 
  MapPin, Mail, Layers, Info 
} from "lucide-react";

export default function SupplierForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: PARTNER IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-green-50 rounded-xl"><Truck className="text-green-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Partner Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Vendor Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. A1 Logistics" required />
            <FormInput label="Official Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contact@vendor.com" type="email" />
            <FormInput label="Physical Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Suite, City, Country" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hierarchy Level</label>
              <select name="hierarchy" value={formData.hierarchy} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold shadow-inner">
                <option>Level 1</option><option>Level 2</option><option>Level 3</option><option>Tier 1 Partner</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPLIANCE & LOGISTICS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><ShieldCheck className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Compliance & Volume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold shadow-inner">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification</label>
              <select name="verification" value={formData.verification} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold shadow-inner">
                <option>Verified</option><option>Pending</option>
              </select>
            </div>
            <FormInput label="Storage Hubs" name="warehouses" type="number" value={formData.warehouses} onChange={handleInputChange} />
            <FormInput label="Current SKU Volume" name="suppliesQuantity" type="number" value={formData.suppliesQuantity} onChange={handleInputChange} />
          </div>
        </div>

        {/* SECTION 3: ADDITIONAL INFO */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><Layers className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Contractual Notes</h2>
          </div>
          <textarea 
            name="details" 
            value={formData.details} 
            onChange={handleInputChange} 
            rows={4} 
            placeholder="Enter additional vendor info, performance history, or contract terms..."
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* FORM ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-green-500 hover:bg-green-600 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={24} /> {formData.id ? "Update Partner Record" : "Finalize Registration"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
      <input 
        required={required} 
        name={name} 
        value={value} 
        onChange={onChange} 
        type={type} 
        placeholder={placeholder} 
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner" 
      />
    </div>
  );
}