import React from "react";
import { 
  Package, IndianRupee, Truck, Layers, Save, 
  Camera, FileText, ChevronDown 
} from "lucide-react";

export default function ProductForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  
  const stockValuation = (parseFloat(formData.price || 0) * parseInt(formData.stock || 0)).toLocaleString('en-IN');

  return (
    /* EXACT SAME TRANSITION AS YOUR LIST: animate-in fade-in slide-in-from-bottom-4 duration-700 */
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: MEDIA & IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-cyan-50 rounded-xl"><Package className="text-cyan-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Visuals & Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Product Image</label>
              <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-cyan-400 transition-all cursor-pointer shadow-inner">
                <Camera className="text-slate-300 group-hover:text-cyan-400 mb-2 transition-transform" size={32} />
                <p className="text-[9px] font-black text-slate-400 uppercase group-hover:text-cyan-500">Upload Media</p>
              </div>
            </div>
            
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Product Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Organic Cream" required />
              <FormInput label="SKU / Product Code" name="code" value={formData.code} onChange={handleInputChange} placeholder="CREM01" required />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold appearance-none shadow-inner">
                    <option>Beauty</option><option>Electronics</option><option>Food</option><option>Home</option><option>Grocery</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
              <FormInput label="Brand / Manufacturer" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand Name" />
            </div>
          </div>
        </div>

        {/* SECTION 2: DESCRIPTION & SPECS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><FileText className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Specifications</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Description</label>
              <textarea 
                name="details" 
                value={formData.details} 
                onChange={handleInputChange} 
                rows={4} 
                placeholder="Provide details..."
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Unit" name="uom" value={formData.uom || ""} onChange={handleInputChange} placeholder="kg" />
              <FormInput label="Weight" name="weight" value={formData.weight || ""} onChange={handleInputChange} placeholder="0.00" />
              <FormInput label="Dimensions" name="dimensions" value={formData.dimensions || ""} onChange={handleInputChange} placeholder="10x10x10" />
            </div>
          </div>
        </div>

        {/* SECTION 3: LOGISTICS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl"><Truck className="text-emerald-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Source & Logistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SelectField label="Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} options={["Global Tech PVT", "A1 Logistics", "Organic Farms Co."]} />
            <SelectField label="Warehouse" name="warehouse" value={formData.warehouse} onChange={handleInputChange} options={["Main Hub - Delhi", "North Wing - Jaipur", "South Warehouse - Bangalore"]} />
            <SelectField label="Branch" name="branch" value={formData.branch} onChange={handleInputChange} options={["City Center Mall", "Airport Road Outlet", "E-Commerce Fulfillment"]} />
          </div>
        </div>

        {/* SECTION 4: FINANCIALS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-amber-50 rounded-xl"><IndianRupee className="text-amber-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Financial Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <FormInput label="Selling Price" name="price" value={formData.price} onChange={handleInputChange} type="number" required />
            <FormInput label="Cost Price" name="cost" value={formData.cost} onChange={handleInputChange} type="number" />
            <FormInput label="Stock" name="stock" value={formData.stock} onChange={handleInputChange} type="number" required />
            <FormInput label="Min Alert" name="minStock" value={formData.minStock} onChange={handleInputChange} type="number" placeholder="5" />
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 flex items-center justify-between group overflow-hidden relative shadow-2xl">
              <div className="z-10">
                  <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">Live Asset Valuation</p>
                  <h3 className="text-white text-2xl font-black">₹ {stockValuation}</h3>
              </div>
              <Layers className="text-white/10 absolute -right-4 -bottom-4 rotate-12" size={100} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-cyan-400 hover:bg-cyan-500 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-cyan-100 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={24} /> {formData.id ? "Update Product Record" : "Finalize Registration"}
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
      <input required={required} name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select name={name} value={value || ""} onChange={onChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold appearance-none shadow-inner">
          <option value="">Select Option</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}