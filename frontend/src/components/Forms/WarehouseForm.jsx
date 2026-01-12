import React, { useRef, useState } from "react";
import {
  Package, MapPin, Layers, Save, FileText,
  ChevronDown, Activity, Camera, Hash,
  AlertTriangle, Navigation, Box
} from "lucide-react";

export default function WarehouseForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        handleInputChange({ target: { name: "img", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 mt-6">

        {/* SECTION 1: VISUALS & IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-xl"><Box className="text-orange-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Asset Registration</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* PRODUCT PHOTO */}
            <div className="lg:col-span-3 flex flex-col items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Stock Visual</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group hover:border-orange-400 transition-all overflow-hidden relative shadow-inner"
              >
                {preview || formData.img ? (
                  <img src={preview || formData.img} alt="Stock" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-slate-300 group-hover:text-orange-500 mb-2 transition-transform" size={32} />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Upload Image</span>
                  </>
                )}
              </div>
            </div>

            {/* IDENTITY FIELDS */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Warehouse Title"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleInputChange}
                placeholder="e.g. Main Distribution Center"
                required
              />
              <FormInput label="Internal SKU / barcode" name="sku" value={formData.sku || ""} onChange={handleInputChange} placeholder="SKU-WARE-100" icon={<Hash size={14} />} />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inventory Status</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="In Stock">In Stock (Available)</option>
                    <option value="In Stock">In Stock (Available)</option>
                    <option value="Out of Stock">Out of Stock (Alert)</option>
                    <option value="Reserved">Reserved (On Hold)</option>
                    <option value="Damaged">Damaged (Quarantine)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Handling Priority</label>
                <div className="relative">
                  <select name="priority" value={formData.priority || "Standard"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="Standard">Standard Flow</option>
                    <option value="Express">Express / Perishable</option>
                    <option value="Fragile">Fragile / Sensitive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: STORAGE LOGISTICS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><MapPin className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Storage Logistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FormInput label="Primary Zone" name="zone" value={formData.zone || ""} onChange={handleInputChange} placeholder="Zone A" icon={<Navigation size={14} />} />
            <FormInput label="Rack / Bin Location" name="subZone" value={formData.subZone || ""} onChange={handleInputChange} placeholder="Rack 04 - B1" />
            <FormInput label="Current Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="0" required />
            <FormInput label="Current Capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="0" required />
          </div>
        </div>

        {/* SECTION 3: SYSTEM INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-xl"><AlertTriangle className="text-amber-500" size={18} /></div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Threshold Alerts</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Minimum Safety Stock" name="minStock" type="number" value={formData.minStock || "10"} onChange={handleInputChange} />
              <FormInput label="Maximum Capacity" name="maxStock" type="number" value={formData.maxStock || "500"} onChange={handleInputChange} />
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 italic">"System will trigger a notification when stock falls below safety levels."</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl"><Activity className="text-cyan-400" size={18} /></div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Deployment Info</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-white/40 uppercase">Warehouse Code</span>
                  <span className="text-xs font-bold uppercase text-cyan-400">WH-JAIPUR-01</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-white/40 uppercase">Last Audit Date</span>
                  <span className="text-xs font-bold uppercase text-slate-300">Jan 07, 2026</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mt-2">
                  <p className="text-[10px] font-bold text-white/60 leading-relaxed italic">"Logistical directives: This item requires climate-controlled storage in Zone A."</p>
                </div>
              </div>
            </div>
            <Layers className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />
          </div>
        </div>

        {/* SECTION 4: PRODUCT SPECIFICATIONS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><FileText className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Detailed Logistics Note</h2>
          </div>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={4}
            placeholder="Technical specs, batch numbers, expiry dates, or handling instructions..."
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* FORM ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
            <Save size={20} /> {formData.id ? "Synchronize Stock Records" : "Commit to Global Registry"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false, icon }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">{label} {required && "*"}</label>
      <div className="relative">
        <input
          required={required}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner"
        />
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      </div>
    </div>
  );
}