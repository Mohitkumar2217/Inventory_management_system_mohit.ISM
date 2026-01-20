import React, { useRef, useState, useEffect } from "react";
import JsBarcode from "jsbarcode";

import {
  Package, IndianRupee, Truck, Layers, Save, Barcode,
  Camera, FileText, ChevronDown, Warehouse,
  ArrowRightLeft, ShoppingCart, AlertCircle, X,
  MapPin, Calendar, Percent, ShieldCheck, Tag, Globe, Activity, Plus, Trash2, Image as ImageIcon, Loader2
} from "lucide-react";

export default function ProductForm({ formData, handleInputChange, handleSubmit, onCancel, categories = [], warehouses = [], zones = [], suppliers = [] }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic images array from formData
  const images = formData?.images || [];

  // --- CLOUDINARY CONFIGURATION ---
  const CLOUD_NAME = "dicvozonw";
  const UPLOAD_PRESET = "mohitkumawat";

  // --- CLOUDINARY UPLOAD LOGIC ---
  const uploadToCloudinary = async (files) => {
    const uploadedUrls = [];
    setIsUploading(true);

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );
        const fileData = await res.json();
        if (fileData.secure_url) {
          uploadedUrls.push(fileData.secure_url);
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
      }
    }
    setIsUploading(false);
    return uploadedUrls;
  };

  // --- BARCODE PREVIEW COMPONENT ---
  const BarcodePreview = ({ value }) => {
    const barcodeRef = useRef(null);
    useEffect(() => {
      if (barcodeRef.current && value) {
        try {
          JsBarcode(barcodeRef.current, value, {
            format: "CODE128", lineColor: "#0f172a", width: 2, height: 40, displayValue: false, background: "transparent"
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

  // --- MULTI-IMAGE HANDLERS ---
  const handleImageClick = () => {
    if (images.length < 4) fileInputRef.current?.click();
    else alert("Maximum 4 images allowed");
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = 4 - images.length;
    const filesToProcess = selectedFiles.slice(0, availableSlots);

    if (filesToProcess.length > 0) {
      const newUrls = await uploadToCloudinary(filesToProcess);
      const updatedImages = [...images, ...newUrls];
      // Trigger the standard input change handler for the array
      handleInputChange({ target: { name: "images", value: updatedImages } });
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    handleInputChange({ target: { name: "images", value: updatedImages } });
  };

  // --- VARIANT HANDLERS ---
  const variants = formData?.variants || [];
  const addVariant = () => {
    const newVariant = { id: Date.now(), name: "", sku: "", price: "", stock: "" };
    handleInputChange({ target: { name: "variants", value: [...variants, newVariant] } });
  };
  const removeVariant = (id) => {
    handleInputChange({ target: { name: "variants", value: variants.filter(v => v.id !== id) } });
  };
  const updateVariant = (id, field, value) => {
    const updated = variants.map(v => v.id === id ? { ...v, [field]: value } : v);
    handleInputChange({ target: { name: "variants", value: updated } });
  };

  // --- CALCULATIONS ---
  const price = Number(formData?.price || 0);
  const cost = Number(formData?.cost || 0);
  const stock = Number(formData?.stock || 0);
  const marginVal = (price - cost).toFixed(2);
  const stockValuation = (price * stock).toLocaleString('en-IN');
  const isInWarehouse = stock > 0;

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

        {/* SECTION 1: VISUALS & IDENTITY (Cloudinary Uploads) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-cyan-50 rounded-xl">
              {isUploading ? <Loader2 className="text-cyan-500 animate-spin" size={18} /> : <ImageIcon className="text-cyan-500" size={18} />}
            </div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Product Media ({images.length}/4)</h2>
            {isUploading && <span className="text-[10px] font-black text-cyan-500 animate-pulse uppercase tracking-widest ml-auto">Syncing to Cloud...</span>}
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="w-full">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-3 right-3 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {images.length < 4 && !isUploading && (
                  <div
                    onClick={handleImageClick}
                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-cyan-400 transition-all cursor-pointer shadow-inner"
                  >
                    <Camera className="text-slate-300 group-hover:text-cyan-400 mb-2 transition-transform group-hover:scale-110" size={32} />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Media</p>
                  </div>
                )}

                {isUploading && (
                  <div className="aspect-square bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="text-cyan-400 animate-spin mb-2" size={32} />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Uploading...</p>
                  </div>
                )}
              </div>
              {images.length === 0 && <p className="text-rose-500 text-[10px] font-bold mt-3 ml-1">* Min 1 image required</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              <FormInput label="Asset Name" name="name" value={formData?.name} onChange={handleInputChange} placeholder="e.g. UltraFit Smartwatch" required />
              <FormInput label="System Code" name="code" value={formData?.code} onChange={handleInputChange} placeholder="SYS-PROD-001" required />
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
            {variants.length === 0 && <p className="text-center text-xs font-bold text-slate-400 py-4 uppercase tracking-widest">No variants added.</p>}
            {variants.map((v) => (
              <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative group">
                <FormInput label="Variant Name" value={v.name} onChange={(e) => updateVariant(v.id, "name", e.target.value)} placeholder="Red / XL" />
                <FormInput label="Variant SKU" value={v.sku} onChange={(e) => updateVariant(v.id, "sku", e.target.value)} placeholder="SKU-001" />
                <FormInput label="Price Override" type="number" value={v.price} onChange={(e) => updateVariant(v.id, "price", e.target.value)} placeholder="₹" />
                <FormInput label="Stock" type="number" value={v.stock} onChange={(e) => updateVariant(v.id, "stock", e.target.value)} placeholder="Qty" />
                <button type="button" onClick={() => removeVariant(v.id)} className="mb-2 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all w-fit"><Trash2 size={18} /></button>
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
            <div className="md:col-span-3 space-y-2">
              <SelectField label="Warehouse Location *" name="warehouse" value={formData?.warehouse} onChange={handleInputChange} options={warehouses} />
            </div>
            <div className="md:col-span-3 space-y-2">
              <SelectField label="Warehouse zone *" name="zone" value={formData?.zone} onChange={handleInputChange} options={zones} />
            </div>

            <div className="md:col-span-4 space-y-2 group">
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

            <div className="md:col-span-2 space-y-2">
              <SelectField label="Unit (UOM)" name="unit" value={formData?.unit} onChange={handleInputChange} options={["Pieces (pcs)", "Kilograms (kg)", "Box (Units)", "Liters (L)"]} />
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL INTELLIGENCE */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-amber-50 rounded-xl"><IndianRupee className="text-amber-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Financial Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FormInput label="Global Selling Price" name="price" value={formData?.price} onChange={handleInputChange} type="number" required />
            <FormInput label="Procurement Cost" name="cost" value={formData?.cost} onChange={handleInputChange} type="number" />
            {/* <FormInput label="Tax Rate (%)" name="taxPercentage" value={formData?.taxPercentage || "18"} onChange={handleInputChange} type="number" icon={<Percent size={14} />} /> */}
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
              <FormInput label="Material" name="material" value={formData?.material} onChange={handleInputChange} placeholder="e.g. Aluminum" />
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
                <div className="grid grid-cols-2 gap-4">
                  <FormInputDark label="Warranty Details" name="warranty" value={formData?.warranty} onChange={handleInputChange} placeholder="e.g. 12 Months Support" />
                  <FormInputDark label="Manufacturing Date" name="manufacturingDate" type="date" value={formData?.manufacturingDate} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField1 label="Current Condition" name="condition" value={formData?.condition || "New"} onChange={handleInputChange} options={["Brand New", "Refurbished"]} />
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
            <FormInput label="SEO Slug" name="slug" value={formData?.slug} onChange={handleInputChange} placeholder="product-url-slug" />
            <SelectField label="Primary Supplier *" name="supplier" value={formData?.supplier} onChange={handleInputChange} options={suppliers} />
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
            <textarea name="details" value={formData?.details} onChange={handleInputChange} rows={3} placeholder="Technical notes..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none text-sm font-medium text-slate-600 shadow-inner" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-8 p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl z-50">
          <button
            type="submit"
            disabled={images.length === 0 || isUploading}
            className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 tracking-widest uppercase text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <><Loader2 className="animate-spin" /> Syncing Media...</> : <><Save size={20} /> Finalize Asset Registration</>}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-200 text-slate-400 py-6 rounded-[2rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-widest active:scale-95 text-center">
            Discard Changes
          </button>
        </div>
      </form >
    </div >
  );
}

// --- SUB-COMPONENTS (Defined once) ---
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
    <div className="space-y-2 w-full text-left">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:ring-4 focus:ring-cyan-50/50 transition-all"
        >
          <option value="">Select Option</option>
          {/* SAFE CHECK: Filter out null/undefined before mapping */}
          {options && options.filter(opt => opt !== null).map((opt, index) => {
            const val = typeof opt === 'object' ? (opt._id || opt.id || index) : opt;
            const lbl = typeof opt === 'object' ? (opt.name || opt.warehouse || opt.zone) : opt;
            return <option key={index} value={val}>{lbl}</option>;
          })}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}
function SelectField1({ label, name, value, onChange, options = [] }) {
  return (
    <div className="space-y-2 w-full text-left">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
        >
          <option value="" className="bg-black">Select Option</option>
          {options && options.filter(opt => opt !== null).map((opt, index) => {
            const val = typeof opt === 'object' ? (opt._id || opt.id || index) : opt;
            const lbl = typeof opt === 'object' ? (opt.name || opt.warehouse || opt.zone) : opt;
            return <option key={index} value={val} className="bg-black">{lbl}</option>;
          })}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}