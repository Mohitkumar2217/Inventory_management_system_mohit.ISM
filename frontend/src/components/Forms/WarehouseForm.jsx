import React, { useState } from "react";
import {
  Layers, Save, FileText, ChevronDown, Activity, Hash,
  AlertTriangle, Box, DollarSign, Users, ShieldCheck,
  MapPin, Plus, X, Navigation, Truck, Package
} from "lucide-react";

export default function WarehouseForm({ formData, handleInputChange, handleSubmit, onCancel, users = [], productList = [] }) {
  const [zoneInput, setZoneInput] = useState("");

  // Temporary state for the Product sub-form
  const [productEntry, setProductEntry] = useState({
    productName: "",
    sku: "",
    quantity: 0,
    unitCost: 0,
    sellingPrice: 0,
    expiryDate: ""
  });

  // --- MULTI-ZONE HANDLERS ---
  const zones = formData.zone || [];

  const addZone = () => {
    if (zoneInput.trim()) {
      const exists = zones.find(z => z.name.toLowerCase() === zoneInput.trim().toLowerCase());
      if (!exists) {
        const newZoneObject = {
          id: `ZONE-${Date.now()}`, // Unique ID required by schema
          name: zoneInput.trim()
        };
        const updatedZones = [...zones, newZoneObject];
        handleInputChange({ target: { name: "zone", value: updatedZones } });
        setZoneInput("");
      }
    }
  };

  const removeZone = (indexToRemove) => {
    const updatedZones = zones.filter((_, index) => index !== indexToRemove);
    handleInputChange({ target: { name: "zone", value: updatedZones } });
  };

  // --- PRODUCT INVENTORY HANDLERS ---
  const inventory = formData.inventory || [];

  const handleProductSubChange = (e) => {
    const { name, value, type } = e.target;
    setProductEntry(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === "" ? 0 : Number(value)) : value
    }));
  };

  const addProductToInventory = () => {
    if (productEntry.productName) {
      const updatedInventory = [...inventory, { ...productEntry, id: Date.now() }];
      handleInputChange({ target: { name: "inventory", value: updatedInventory } });
      // Reset sub-form
      setProductEntry({ productName: "", sku: "", quantity: 0, unitCost: 0, sellingPrice: 0, expiryDate: "" });
    }
  };

  const removeProduct = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    handleInputChange({ target: { name: "inventory", value: updatedInventory } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addZone();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 mt-6">

        {/* SECTION 1: VISUALS & IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-xl"><Box className="text-orange-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Asset Registration</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-9 gap-10">
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Warehouse Title"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="e.g. Main Distribution Center"
                required
              />
              <FormInput label="Warehouse ID" name="warehouseId" value={formData.warehouseId || ""} onChange={handleInputChange} placeholder="WH-XYZ-01" icon={<Hash size={14} />} required />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Storage Type</label>
                <div className="relative">
                  <select name="storageType" value={formData.storageType || "solid"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="solid">Solid Storage</option>
                    <option value="liquid">Liquid Chemical</option>
                    <option value="air">Gaseous / Air</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <FormInput label="Ranking (0-5)" name="ranking" type="number" value={formData.ranking || ""} onChange={handleInputChange} placeholder="4.5" />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hierarchy Level</label>
                <div className="relative">
                  <select name="hierarchyLevel" value={formData.hierarchyLevel || 1} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="1">Level 1: Main Hub</option>
                    <option value="2">Level 2: Regional</option>
                    <option value="3">Level 3: Local Shop</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Status</label>
                <div className="relative">
                  <select name="statusWarehouse" value={formData.statusWarehouse || "active"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="active">Active Operational</option>
                    <option value="inactive">Inactive / Closed</option>
                    <option value="maintenance">Maintenance Mode</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT STOCK ENTRY (ADDED) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><Package className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Product Stock Entry</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Product</label>
                <select
                  name="productName"
                  value={productEntry.productName}
                  onChange={handleProductSubChange}
                  className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none text-sm font-bold shadow-inner cursor-pointer"
                >
                  <option value="">Choose Product</option>
                  {productList.map((p, i) => <option key={i} value={p.name || p}>{p.name || p}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={addProductToInventory}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add to Stock List
              </button>
            </div>

            <div className="lg:col-span-8 overflow-hidden border border-slate-100 rounded-[2rem]">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
                  <tr><th className="p-4">Item Details</th><th className="p-4">Qty</th><th className="p-4">Financials</th><th className="p-4 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.map((item, idx) => (
                    <tr key={idx} className="text-xs font-bold text-slate-600 hover:bg-slate-50/50">
                      <td className="p-4"><div className="flex flex-col"><span>{item.productName}</span><span className="text-[10px] text-slate-400">{item.sku}</span></div></td>
                      <td className="p-4">{item.quantity} Units</td>
                      <td className="p-4"><span className="text-emerald-600">${item.unitCost}</span> / <span className="text-blue-600">${item.sellingPrice}</span></td>
                      <td className="p-4 text-center"><button type="button" onClick={() => removeProduct(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><X size={16} /></button></td>
                    </tr>
                  ))}
                  {inventory.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-300 italic text-xs">No products in list</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: STORAGE LOGISTICS (NEW MULTI-ZONE ADDITION) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="p-2 bg-indigo-50 rounded-xl"><MapPin className="text-indigo-500" size={18} /></div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Storage Mapping</h2>
            </div>
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500">Add Operational Zones</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={zoneInput}
                      onChange={(e) => setZoneInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Zone A-1"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner"
                    />
                    <Navigation className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  </div>
                  <button
                    type="button"
                    onClick={addZone}
                    className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-100"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Display List of Zones */}
              <div className="flex flex-wrap gap-2 pt-2">
                {zones.map((z, index) => (
                  <div key={z.id || index} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl group transition-all hover:bg-indigo-100">
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{z.name}</span>
                    <button
                      type="button"
                      onClick={() => removeZone(index)}
                      className="text-indigo-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {zones.length === 0 && <p className="text-[10px] font-bold text-slate-300 uppercase italic ml-1">No zones assigned yet</p>}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 rounded-xl"><AlertTriangle className="text-amber-500" size={18} /></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Threshold Alerts</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Min Safety Stock" name="minStock" type="number" value={formData.minStock || 10} onChange={handleInputChange} />
                <FormInput label="Max Safety Cap" name="maxStock" type="number" value={formData.maxStock || 500} onChange={handleInputChange} />
              </div>
            </div>
            {/* SECTION 3: FINANCE & PERSONNEL */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl"><Users className="text-blue-500" size={18} /></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Human Resources</h2>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Warehouse Admin *</label>
                <div className="relative">
                  <select
                    name="admin"
                    value={formData.admin || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="">Select an Admin</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                  <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* SECTION 5: ADDRESS & NOTES */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 ">
            <div className="p-2 bg-blue-50 rounded-xl"><FileText className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Location & Instructions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput label="Zone *" name="address.zone" value={formData.address?.zone || ""} onChange={handleInputChange} placeholder="eg. Zone-2" />
            <FormInput label="City *" name="address.city" value={formData.address?.city || ""} onChange={handleInputChange} placeholder="Jaipur" />
            <FormInput label="State *" name="address.state" value={formData.address?.state || ""} onChange={handleInputChange} placeholder="Rajasthan" />
            <FormInput label="Pin Code *" name="address.pin" type="number" value={formData.address?.pin || 0} onChange={handleInputChange} placeholder="XXXXXX" />
          </div>
          <textarea
            name="details"
            value={formData.details || ""}
            onChange={handleInputChange}
            rows={4}
            placeholder="Technical specs, batch numbers, or specific instructions..."
            className="w-full p-6 mt-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 flex items-center justify-center gap-3 tracking-widest uppercase text-xs transition-all">
            <Save size={20} /> Deploy Warehouse Record
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Discard</button>
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