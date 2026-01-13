import React, { useRef, useState, useEffect } from "react";
import JsBarcode from "jsbarcode"; // Import Barcode Library

import {
  Package, IndianRupee, Truck, Layers, Save, Barcode,
  Camera, FileText, ChevronDown, Warehouse,
  ArrowRightLeft, ShoppingCart, AlertCircle, X,
  MapPin, Calendar, Percent, ShieldCheck, Tag, Globe, Activity, Plus, Trash2
} from "lucide-react";


export default function ProductForm({ formData, handleInputChange, handleSubmit, onCancel, categories = [], warehouses = [] }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- STATE FOR SUPPLIERS --- 
  const [suppliers, setSuppliers] = useState([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);

  // --- DYNAMIC VARIANT LOGIC ---
  const variants = formData?.variants || [];

  // --- BARCODE PREVIEW COMPONENT ---
  const BarcodePreview = ({ value }) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
      if (barcodeRef.current && value) {
        try {
          JsBarcode(barcodeRef.current, value, {
            format: "CODE128",
            lineColor: "#0f172a",
            width: 2,
            height: 40,
            displayValue: false, 
            background: "transparent"
          });
        } catch (e) { }
      }
    }, [value]);

    return (
      <div className="flex justify-center items-center bg-white rounded-xl p-2 h-12 border border-slate-100 shadow-inner overflow-hidden">
        {value ? <svg ref={barcodeRef}></svg> : <p className="text-[8px] font-black text-slate-300 uppercase">Waiting...</p>}
      </div>
    );
  };

  // --- DEPENDENT SUPPLIER LOGIC ---
  useEffect(() => {
    if (!formData?.warehouseId) {
      setSuppliers([]);
      return;
    }
    const fetchSuppliers = async () => {
      setIsLoadingSuppliers(true);
      // Mocking logic based on warehouse selection
      // This will trigger whenever the warehouseId in formData changes
      const mockSuppliers = formData.warehouseId === "wh-01"
        ? [{ id: "s-01", name: "Alpha Global Trading" }, { id: "s-02", name: "Primary Steel Co" }]
        : [{ id: "s-03", name: "Northern Electronics" }, { id: "s-04", name: "Rapid Logistics Ltd" }];
      setSuppliers(mockSuppliers);
      setIsLoadingSuppliers(false);
    };
    fetchSuppliers();
  }, [formData?.warehouseId]);

  // --- HANDLERS ---
  const addVariant = () => {
    const newVariant = { id: Date.now(), name: "", sku: "", price: "", stock: "" };
    handleInputChange({ target: { name: "variants", value: [...variants, newVariant] } });
  };

  const removeVariant = (id) => {
    const filtered = variants.filter(v => v.id !== id);
    handleInputChange({ target: { name: "variants", value: filtered } });
  };

  const updateVariant = (id, field, value) => {
    const updated = variants.map(v => v.id === id ? { ...v, [field]: value } : v);
    handleInputChange({ target: { name: "variants", value: updated } });
  };

  // --- CALCULATIONS ---
  const price = Number(formData?.price || 0);
  const stock = Number(formData?.stock || 0);
  const cost = Number(formData?.cost || 0);
  const stockValuation = (price * stock).toLocaleString('en-IN');
  const marginVal = (price - cost).toFixed(2);
  const isInWarehouse = stock > 0;

  // --- IMAGE HANDLERS ---
  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleInputChange({ target: { name: "img", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    handleInputChange({ target: { name: "img", value: null } });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 max-w-6xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            {formData?._id ? "Synchronize Asset Registry" : "New Asset Registration"}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Logistics v3.5</p>
        </div>

        <div className={`px-5 py-3 rounded-[1.5rem] border flex items-center gap-3 transition-all shadow-sm ${isInWarehouse ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
          <div className={`p-2 rounded-xl text-white shadow-lg ${isInWarehouse ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'}`}>
            {isInWarehouse ? <ArrowRightLeft size={16} /> : <ShoppingCart size={16} />}
          </div>
          <div className="leading-tight">
            <p className={`text-[9px] font-black uppercase tracking-widest ${isInWarehouse ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isInWarehouse ? 'Operational Asset' : 'Procurement Required'}
            </p>
            <p className="text-xs font-black text-slate-800 uppercase">Valuation: ₹ {stockValuation}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">

        {/* SECTION 1: VISUALS & IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-cyan-50 rounded-xl"><Package className="text-cyan-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Visuals & Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Product Media</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div onClick={handleImageClick} className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-cyan-400 transition-all cursor-pointer shadow-inner relative overflow-hidden">
                {imagePreview || formData?.img ? (
                  <div className="relative w-full h-full p-2">
                    <img src={imagePreview || formData.img} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                    <button type="button" onClick={removeImage} className="absolute top-4 right-4 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <Camera className="text-slate-300 group-hover:text-cyan-400 mb-2 transition-transform group-hover:scale-110" size={32} />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upload Media</p>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Asset Name" name="name" value={formData?.name} onChange={handleInputChange} placeholder="e.g. UltraFit Smartwatch" required />
              <FormInput label="System Code (Internal ID)" name="code" value={formData?.code} onChange={handleInputChange} placeholder="SYS-PROD-001" required />
              <SelectField label="Category Department" name="category" value={formData?.category} onChange={handleInputChange} options={categories} />
              <FormInput label="Brand / Manufacturer" name="brand" value={formData?.brand} onChange={handleInputChange} placeholder="Global Brand Name" icon={<Tag size={14} />} />
            </div>
          </div>
        </div>

        {/* SECTION: DYNAMIC VARIANTS */}
        <div className="bg-slate-50/50 p-8 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl"><Layers className="text-indigo-500" size={18} /></div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Product Variants</h2>
            </div>
            <button type="button" onClick={addVariant} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 shadow-indigo-100">
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.length === 0 && <p className="text-center text-xs font-bold text-slate-400 py-4 uppercase tracking-widest">No variants added. Using global values.</p>}
            {variants.map((v, idx) => (
              <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative group animate-in slide-in-from-right duration-300">
                <FormInput label="Variant Name" value={v.name} onChange={(e) => updateVariant(v.id, "name", e.target.value)} placeholder="Red / XL" />
                <FormInput label="Variant SKU" value={v.sku} onChange={(e) => updateVariant(v.id, "sku", e.target.value)} placeholder="SKU-001" />
                <FormInput label="Price Override" type="number" value={v.price} onChange={(e) => updateVariant(v.id, "price", e.target.value)} placeholder="₹" />
                <FormInput label="Stock" type="number" value={v.stock} onChange={(e) => updateVariant(v.id, "stock", e.target.value)} placeholder="Qty" />
                <button type="button" onClick={() => removeVariant(v.id)} className="mb-2 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all w-fit">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: LOGISTICS & LOCATION */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-xl"><Warehouse className="text-orange-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Logistics & Localization</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Warehouse Dropdown */}
            <div className="md:col-span-4 space-y-2">
              <SelectField 
                label="Warehouse Location *" 
                name="warehouseId" 
                value={formData?.warehouseId} 
                onChange={handleInputChange} 
                options={warehouses} 
              />
            </div>

            {/* Barcode Section */}
            <div className="md:col-span-5 space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                <span>EAN / UPC Barcode</span>
                <span className="text-orange-500 flex items-center gap-1 font-black uppercase text-[8px]"><Barcode size={10} /> Auto-Gen Active</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input name="barcode" value={formData?.barcode || ""} onChange={handleInputChange} placeholder="Scan or type string..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
                </div>
                <div className="w-32 shrink-0">
                  <BarcodePreview value={formData?.barcode} />
                </div>
              </div>
            </div>

            {/* UOM Select */}
            <div className="md:col-span-3">
              <SelectField label="Stocking Unit (UOM)" name="unit" value={formData?.unit} onChange={handleInputChange} options={["Pieces (pcs)", "Kilograms (kg)", "Box (Units)", "Liters (L)"]} />
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL INTELLIGENCE */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-amber-50 rounded-xl"><IndianRupee className="text-amber-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Financial Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormInput label="Global Selling Price" name="price" value={formData?.price} onChange={handleInputChange} type="number" required />
            <FormInput label="Procurement Cost" name="cost" value={formData?.cost} onChange={handleInputChange} type="number" />
            <FormInput label="Tax Rate (%)" name="taxPercentage" value={formData?.taxPercentage || "18"} onChange={handleInputChange} type="number" icon={<Percent size={14} />} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Projected Margin</label>
              <div className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-black text-sm shadow-inner flex items-center gap-2">₹ {marginVal}</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PHYSICAL SPECS & QUALITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="p-2 bg-indigo-50 rounded-xl"><Activity className="text-indigo-500" size={18} /></div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Physical Specifications</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormInput label="Mass / Weight" name="weight" value={formData?.weight} onChange={handleInputChange} placeholder="e.g. 1.2kg" />
              <FormInput label="Dimensions" name="dimensions" value={formData?.dimensions} onChange={handleInputChange} placeholder="LxWxH (cm)" />
              <FormInput label="Global Material" name="material" value={formData?.material} onChange={handleInputChange} placeholder="e.g. Aluminum" />
              <FormInput label="Base Color" name="color" value={formData?.color} onChange={handleInputChange} placeholder="Base Theme" />
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="p-2 bg-white/10 rounded-xl"><ShieldCheck className="text-cyan-400" size={18} /></div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Quality Assurance</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <FormInputDark label="Warranty Details" name="warranty" value={formData?.warranty} onChange={handleInputChange} placeholder="e.g. 12 Months Support" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Condition</label>
                    <select name="condition" value={formData?.condition || "New"} onChange={handleInputChange} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer">
                      <option value="New">Brand New</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                  <FormInputDark label="Asset Expiry" name="expiryDate" type="date" value={formData?.expiryDate} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <Layers className="text-white/5 absolute -right-8 -bottom-8 rotate-12" size={150} />
          </div>
        </div>

        {/* SECTION 5: DISCOVERY & SEO */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-rose-50 rounded-xl"><Globe className="text-rose-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Performance & SEO</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormInput label="SEO Slug (URL Key)" name="slug" value={formData?.slug} onChange={handleInputChange} placeholder="product-url-slug" />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Supplier *</label>
              <div className="relative">
                <select
                  name="supplierId"
                  value={formData?.supplierId || ""}
                  onChange={handleInputChange}
                  disabled={!formData?.warehouseId}
                  className={`w-full p-4 border rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer transition-all ${!formData?.warehouseId ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400' : 'bg-slate-50 border-slate-100 focus:ring-4 focus:ring-rose-50'}`}
                >
                  <option value="">
                    {!formData?.warehouseId ? "Select warehouse first" : (isLoadingSuppliers ? "Loading Suppliers..." : "Select Supplier")}
                  </option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          <textarea name="metaDescription" value={formData?.metaDescription} onChange={handleInputChange} rows={2} placeholder="Meta description for search..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none text-sm font-medium text-slate-600 shadow-inner resize-none" />
        </div>

        {/* SECTION 6: OPERATIONAL TRACKING */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl"><Activity className="text-emerald-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Operational Tracking</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Global Stock Count" name="stock" value={formData?.stock} onChange={handleInputChange} type="number" required />
            <FormInput label="Min Stock Alert" name="minStock" value={formData?.minStock || "20"} onChange={handleInputChange} type="number" />
            <FormInput label="Internal SKU" name="sku" value={formData?.sku} onChange={handleInputChange} placeholder="SKU-XXX-000" />
          </div>
          <div className="mt-8">
            <textarea name="details" value={formData?.details} onChange={handleInputChange} rows={3} placeholder="Technical notes or handling instructions..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none text-sm font-medium text-slate-600 shadow-inner" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-8 p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl z-50">
          <button type="submit" className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 tracking-widest uppercase text-xs active:scale-95">
            <Save size={20} /> Finalize Asset Registration
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-200 text-slate-400 py-6 rounded-[2rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-widest active:scale-95 text-center text-xs">
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// --- SUB-COMPONENTS (Fixed for Prop Mapping) ---
function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false, icon }) {
  return (
    <div className="space-y-2 group w-full">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-cyan-500">{label}</label>
      <div className="relative">
        <input required={required} name={name} value={value || ""} onChange={onChange} type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      </div>
    </div>
  );
}

function FormInputDark({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 group w-full text-white">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-cyan-400">{label}</label>
      <input name={name} value={value || ""} onChange={onChange} type={type} placeholder={placeholder} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-bold text-white shadow-inner" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options = [] }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select 
          name={name} 
          value={value || ""} 
          onChange={onChange} 
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none shadow-inner cursor-pointer focus:ring-4 focus:ring-cyan-50/50 transition-all"
        >
          <option value="">Select Option</option>
          {options.map((opt, index) => {
            // 1. Identify if it's an object or string
            const isObject = typeof opt === 'object' && opt !== null;
            
            // 2. Extract Value: Prioritize unique ID to prevent the "Duplicate Key" error
            const val = isObject ? (opt._id || opt.id || index) : opt;
            
            // 3. Extract Label for display
            const lbl = isObject ? (opt.name || opt.warehouselocation) : opt;

            // 4. Use the unique ID (val) as the key
            return (
              <option key={`${name}-${val}-${index}`} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}