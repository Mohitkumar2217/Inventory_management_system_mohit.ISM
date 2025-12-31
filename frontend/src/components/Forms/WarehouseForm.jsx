import React from "react";
import { Package, MapPin, Layers, Save, FileText, ChevronDown, Activity } from "lucide-react";

export default function WarehouseForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: STOCK IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-xl"><Package className="text-orange-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Stock Identity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Product Title" name="product" value={formData.product} onChange={handleInputChange} placeholder="e.g. Wireless Headphones" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
              <div className="relative">
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Reserved">Reserved</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: STORAGE LOGISTICS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><MapPin className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Storage Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Zone / Aisle" name="zone" value={formData.zone || ""} onChange={handleInputChange} placeholder="Zone A-12" />
            <FormInput label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="0" required />
            <FormInput label="SKU Code" name="sku" value={formData.sku || ""} onChange={handleInputChange} placeholder="SKU-XXXX" />
          </div>
        </div>

        {/* SECTION 3: PRODUCT DETAILS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><FileText className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Product Details</h2>
          </div>
          <textarea 
            name="details" 
            value={formData.details} 
            onChange={handleInputChange} 
            rows={4} 
            placeholder="Technical specs, handling instructions, or batch numbers..."
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* FORM ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
            <Save size={24} /> {formData.id ? "Update Stock" : "Log New Stock"}
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
      <input required={required} name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
    </div>
  );
}