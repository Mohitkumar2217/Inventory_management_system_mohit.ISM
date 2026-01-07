import React, { useRef, useState } from "react"; // Added useRef and useState
import { 
  Package, IndianRupee, Truck, Layers, Save, 
  Camera, FileText, ChevronDown, Warehouse, 
  ArrowRightLeft, ShoppingCart, AlertCircle, X 
} from "lucide-react";

export default function ProductForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  const fileInputRef = useRef(null); // Reference to hidden file input
  const [imagePreview, setImagePreview] = useState(null); // Local preview state

  const stockValuation = (parseFloat(formData.price || 0) * parseInt(formData.stock || 0)).toLocaleString('en-IN');
  const isInWarehouse = parseInt(formData.stock || 0) > 0;

  // --- IMAGE UPLOAD HANDLERS ---
  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the hidden input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Manually update the formData via the existing handleInputChange pattern
        handleInputChange({
          target: { name: "img", value: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation(); // Prevent triggering the click handler
    setImagePreview(null);
    handleInputChange({ target: { name: "img", value: null } });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
      
      {/* HEADER: SMART PROCUREMENT LOGIC */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
             {formData.id ? "Edit Product Record" : "New Product Entry"}
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Asset Inventory</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className={`px-5 py-3 rounded-[1.5rem] border flex items-center gap-3 transition-all shadow-sm ${isInWarehouse ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                {isInWarehouse ? (
                    <>
                        <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100"><ArrowRightLeft size={16} /></div>
                        <div className="leading-tight">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Available in Stock</p>
                            <button type="button" className="text-xs font-black text-slate-800 uppercase hover:text-emerald-700 transition-colors">Allocate from Warehouse</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-2 bg-rose-500 rounded-xl text-white shadow-lg shadow-rose-100"><ShoppingCart size={16} /></div>
                        <div className="leading-tight">
                            <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Inventory Depleted</p>
                            <button type="button" className="text-xs font-black text-slate-800 uppercase hover:text-rose-700 transition-colors">Initiate Purchase Order</button>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: MEDIA & IDENTITY (Activated Upload) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-cyan-50 rounded-xl"><Package className="text-cyan-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Visuals & Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Product Image</label>
              
              {/* HIDDEN FILE INPUT */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div 
                onClick={handleImageClick}
                className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-cyan-400 transition-all cursor-pointer shadow-inner relative overflow-hidden"
              >
                {imagePreview || formData.img ? (
                  <div className="relative w-full h-full p-2">
                    <img src={imagePreview || formData.img} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                    <button 
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="text-slate-300 group-hover:text-cyan-400 mb-2 transition-transform group-hover:scale-110" size={32} />
                    <p className="text-[9px] font-black text-slate-400 uppercase group-hover:text-cyan-500">Upload Media</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Product Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Organic Cream" required />
              <FormInput label="SKU / Product Code" name="code" value={formData.code} onChange={handleInputChange} placeholder="CREM01" required />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option>Beauty</option><option>Electronics</option><option>Food</option><option>Home</option><option>Grocery</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
              <FormInput label="Brand / Manufacturer" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand Name" />
            </div>
          </div>
        </div>

        {/* WAREHOUSE SELECTION & ZONE MAPPING */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-xl"><Warehouse className="text-orange-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Warehouse & Storage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Select Target Warehouse" name="warehouse" value={formData.warehouse} onChange={handleInputChange} options={["Main Hub - Delhi", "North Wing - Jaipur", "South Warehouse - Bangalore"]} />
                <FormInput label="Storage Zone / Bin ID" name="zone" value={formData.zone || ""} onChange={handleInputChange} placeholder="e.g. Zone A-12" />
            </div>
            <div className="md:col-span-4">
                <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="text-orange-500" />
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Logistics Tip</p>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 leading-tight">Assigning a specific zone helps in faster order picking and optimized warehouse layout.</p>
                </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DESCRIPTION & LOGISTICS */}
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
                rows={3} 
                placeholder="Provide details..."
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Unit (UOM)" name="uom" value={formData.uom || ""} onChange={handleInputChange} placeholder="kg / pcs" />
              <FormInput label="Weight" name="weight" value={formData.weight || ""} onChange={handleInputChange} placeholder="0.00" />
              <FormInput label="Dimensions" name="dimensions" value={formData.dimensions || ""} onChange={handleInputChange} placeholder="10x10x10" />
            </div>
          </div>
        </div>

        {/* SECTION 3: SOURCE & LOGISTICS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl"><Truck className="text-emerald-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Source & Logistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SelectField label="Primary Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} options={["Global Tech PVT", "A1 Logistics", "Organic Farms Co."]} />
            <SelectField label="Fulfillment Branch" name="branch" value={formData.branch} onChange={handleInputChange} options={["City Center Mall", "Airport Road Outlet", "E-Commerce Fulfillment"]} />
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
            <FormInput label="Current Stock" name="stock" value={formData.stock} onChange={handleInputChange} type="number" required />
            <FormInput label="Min Level Alert" name="minStock" value={formData.minStock} onChange={handleInputChange} type="number" placeholder="5" />
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
          <button type="submit" className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
            <Save size={20} /> {formData.id ? "Update Product Record" : "Finalize Registration"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
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
        <select name={name} value={value || ""} onChange={onChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
          <option value="">Select Option</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}