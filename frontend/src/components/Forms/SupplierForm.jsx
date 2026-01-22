import React, { useRef, useState } from "react";
import {
  Truck, ShieldCheck, Globe, Save, MapPin, Mail, Layers, Info, Camera,
  FileCheck, UploadCloud, X, FileText, Briefcase, Landmark, IndianRupee,
  BarChart3, History, CheckCircle2, AlertCircle, Package, Phone, Plus, Trash2, User
} from "lucide-react";

export default function SupplierForm({
  formData,
  handleInputChange,
  handleSubmit,
  onCancel,
  warehouses = {},
  categories = []
}) {
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [fileNames, setFileNames] = useState({});

  // --- 1. NESTED STATE HANDLERS ---
  const handleNestedChange = (section, field, value) => {
    handleInputChange({
      target: {
        name: section,
        value: { ...formData[section], [field]: value }
      }
    });
  };

  // --- 2. DYNAMIC LIST HANDLERS ---
  const handleListChange = (section, index, field, value) => {
    const updatedList = [...formData[section]];
    updatedList[index][field] = value;
    handleInputChange({ target: { name: section, value: updatedList } });
  };

  const addListItem = (section, template) => {
    handleInputChange({ target: { name: section, value: [...formData[section], template] } });
  };

  const removeListItem = (section, index) => {
    const updatedList = formData[section].filter((_, i) => i !== index);
    handleInputChange({ target: { name: section, value: updatedList } });
  };

  // --- 3. ACTIVATED FILE UPLOAD LOGIC (FIXED FOR BACKEND FILE TRANSPORT) ---
  const onFileSelect = (e, fieldName, section = "documents") => {
    const file = e.target.files[0];
    if (file) {
      // Store real filename for UI
      setFileNames(prev => ({ ...prev, [fieldName]: file.name }));

      // IMPORTANT: Pass the real 'file' object (binary) to state
      if (section === "root") {
        handleInputChange({ target: { name: fieldName, value: file } });
      } else {
        handleInputChange({
          target: {
            name: section,
            value: { ...formData[section], [fieldName]: file }
          }
        });
      }
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        // Root level photo field
        handleInputChange({ target: { name: "photo", value: file } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">

        {/* SECTION 1: IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <SectionHeader icon={<Truck className="text-green-500" />} title="1. Partner Basic Details" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 flex flex-col items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Partner Photo</label>
              <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
              <div onClick={() => logoInputRef.current.click()} className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group shadow-inner">
                {logoPreview || formData.photo ? (
                  <img src={logoPreview || (typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo))} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <><Camera className="text-slate-300 group-hover:text-green-500 mb-2 transition-colors" size={32} />
                    <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">Upload Photo</span></>
                )}
              </div>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Full Name *" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Business or Individual Name" />
              <FormInput label="Official Email *" name="email" value={formData.email} onChange={handleInputChange} type="email" required placeholder="contact@supplier.com" />
              <FormInput label="Contact Phone *" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91..." />
              <FormInput label="Physical Address *" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Full business address" />
              <SelectField label="Availability Status" name="status" value={formData.status} onChange={handleInputChange} options={["Active", "Inactive", "Suspended"]} />
              <FileUploadField label="ID Card Upload" fileName={fileNames.idCard} onSelect={(e) => onFileSelect(e, "idCard", "root")} />
            </div>
          </div>
        </div>

        {/* SECTION 2: GOODS CATALOG */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
            <SectionHeader icon={<Package className="text-indigo-500" />} title="2. Goods Providing Details" />
            <button type="button" onClick={() => addListItem("itemsDetails", { itemName: "", category: "", unitPrice: 0, brand: "", Mop: 0, itemid: "", itemDescription: "" })} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Plus size={20} /></button>
          </div>
          <div className="space-y-4 mb-6">
            {formData.itemsDetails?.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="md:col-span-3">
                  <FormInput label="Item Name" value={item.itemName} onChange={(e) => handleListChange("itemsDetails", idx, "itemName", e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <FormInput label="Item SKU ID" value={item.itemSKUid} onChange={(e) => handleListChange("itemsDetails", idx, "itemSKUid", e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <FormInput label="Item Brand" value={item.itembrand} onChange={(e) => handleListChange("itemsDetails", idx, "itembrand", e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <SelectField label="Category" value={item.category} onChange={(e) => handleListChange("itemsDetails", idx, "category", e.target.value)} options={categories} />
                </div>

                {/* Row 2: Pricing & Descriptions */}
                <div className="md:col-span-4">
                  <FormInput label="Unit Price (₹)" type="number" value={item.unitPrice} onChange={(e) => handleListChange("itemsDetails", idx, "unitPrice", e.target.value)} />
                </div>
                <div className="md:col-span-4">
                  <FormInput label="Min Order Product (MOP)" type="number" value={item.mop} onChange={(e) => handleListChange("itemsDetails", idx, "mop", e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  {/* Placeholder for alignment or additional small field */}
                  <div className="hidden md:block"></div>
                </div>
                <div className="md:col-span-11">
                  <FormInput label="Item Description" value={item.itemDescription} onChange={(e) => handleListChange("itemsDetails", idx, "itemDescription", e.target.value)} placeholder="Provide specific material or quality details..." />
                </div>
                <div className="md:col-span-1 pb-1 text-center"><button type="button" onClick={() => removeListItem("itemsDetails", idx)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
              <input type="checkbox" name="isCurrentlyActiveForDelivery" checked={formData.isCurrentlyActiveForDelivery} onChange={(e) => handleInputChange({ target: { name: "isCurrentlyActiveForDelivery", value: e.target.checked } })} className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Active for Delivery</label>
            </div>
            <FormInput label="Supply Limit (Units)" name="itemLimit" type="number" value={formData.itemLimit} onChange={handleInputChange} />
          </div>
        </div>

        {/* SECTION 3 & 4: LOGISTICS & DOCUMENTS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
          <SectionHeader icon={<ShieldCheck className="text-blue-500" />} title="3 & 4. Status & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <FileUploadField label="Business Licence" fileName={fileNames.licence} onSelect={(e) => onFileSelect(e, "licence")} />
            <FileUploadField label="Contract" fileName={fileNames.contract} onSelect={(e) => onFileSelect(e, "contract")} />
            <FileUploadField label="ID Proof" fileName={fileNames.idProof} onSelect={(e) => onFileSelect(e, "idProof")} />
            <FileUploadField label="Address Proof" fileName={fileNames.addressProof} onSelect={(e) => onFileSelect(e, "addressProof")} />
          </div>
          <div className="border-t border-slate-50 pt-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Hub Links</p>
              <button type="button" onClick={() => addListItem("connectedWarehouses", { warehouseId: "", warehouseName: "", itemCountSupplied: 0 })} className="text-xs font-black text-blue-500 flex items-center gap-1 hover:text-blue-700 transition-colors"><Plus size={14} /> Add Hub</button>
            </div>
            {formData.connectedWarehouses?.map((wh, idx) => (
              <div key={idx} className="flex gap-4 mb-3 items-end bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <SelectField label="Target Hub" value={wh.warehouseId} onChange={(e) => {
                    const selectedWh = warehouses.find(w => w._id === e.target.value);
                    handleListChange("connectedWarehouses", idx, "warehouseId", e.target.value);
                    handleListChange("connectedWarehouses", idx, "warehouseName", selectedWh?.warehouseName || "");
                  }} options={warehouses.map(w => ({ val: w._id, lbl: w.warehouseName }))}
                  />
                </div>
                <div className="w-32"><FormInput label="Load" type="number" value={wh.itemCountSupplied} onChange={(e) => handleListChange("connectedWarehouses", idx, "itemCountSupplied", e.target.value)} /></div>
                <button type="button" onClick={() => removeListItem("connectedWarehouses", idx)} className="mb-2 p-3 text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: BANKING */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
          <SectionHeader icon={<Landmark className="text-amber-500" />} title="5. Treasury & Bank Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <FormInput label="Bank" value={formData.bankDetails?.bankName} onChange={(e) => handleNestedChange("bankDetails", "bankName", e.target.value)} />
            <FormInput label="A/C No" value={formData.bankDetails?.accountNumber} onChange={(e) => handleNestedChange("bankDetails", "accountNumber", e.target.value)} />
            <FormInput label="IFSC" value={formData.bankDetails?.ifscCode} onChange={(e) => handleNestedChange("bankDetails", "ifscCode", e.target.value)} />
            <FormInput label="Branch" value={formData.bankDetails?.bankBranch} onChange={(e) => handleNestedChange("bankDetails", "bankBranch", e.target.value)} />
          </div>
          <FileUploadField label="Bank Passbook Proof" fileName={fileNames.bankPassbookProof} onSelect={(e) => onFileSelect(e, "bankPassbookProof", "bankDetails")} />
        </div>

        {/* SECTION 8: DESCRIPTION */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
          <SectionHeader icon={<Layers className="text-indigo-500" />} title="8. Strategic Ranking" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <FormInput label="Internal Score" type="number" value={formData.description?.ranking} onChange={(e) => handleNestedChange("description", "ranking", e.target.value)} />
          </div>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={4}
            placeholder="Procurement notes..."
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
            <Save size={20} /> Synchronize Profile
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Abort</button>
        </div>
      </form>
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 rounded-xl shadow-inner">{icon}</div>
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
      <input
        required={required}
        name={name}
        value={value || ""}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options = [] }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner cursor-pointer appearance-none"
        >
          <option value="">Select Option</option>
          {options.map((o, i) => {
            const val = typeof o === 'object' ? o.val : o;
            const lbl = typeof o === 'object' ? o.lbl : o;
            return <option key={i} value={val}>{lbl}</option>;
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
        </div>
      </div>
    </div>
  );
}

function FileUploadField({ label, onSelect, fileName }) {
  const inputRef = useRef(null);
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input type="file" ref={inputRef} className="hidden" onChange={onSelect} />
      <div onClick={() => inputRef.current.click()} className="p-6 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-inner">
        <div className="flex items-center gap-3">
          <UploadCloud className="text-slate-300 group-hover:text-blue-500 transition-colors" size={24} />
          <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{fileName || "Attach File"}</span>
        </div>
        {fileName && <CheckCircle2 size={16} className="text-emerald-500 animate-in zoom-in" />}
      </div>
    </div>
  );
}