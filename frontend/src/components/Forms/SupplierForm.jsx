import React, { useRef, useState } from "react";
import { 
  Truck, ShieldCheck, Globe, Save, 
  MapPin, Mail, Layers, Info, Camera, 
  FileCheck, UploadCloud, X, FileText, Briefcase
} from "lucide-react";

export default function SupplierForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const contractInputRef = useRef(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [docName, setDocName] = useState("");
  const [contractName, setContractName] = useState("");

  // --- HANDLERS ---
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        handleInputChange({ target: { name: "logo", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setter(file.name);
      handleInputChange({ target: { name: fieldName, value: file } });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: BRAND IDENTITY & INFO */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-green-50 rounded-xl"><Truck className="text-green-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Partner Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LOGO UPLOAD */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block text-center">Vendor Logo</label>
              <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
              <div 
                onClick={() => logoInputRef.current.click()}
                className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group hover:border-green-400 transition-all overflow-hidden relative shadow-inner"
              >
                {logoPreview || formData.logo ? (
                  <img src={logoPreview || formData.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-slate-300 group-hover:text-green-500 mb-2 transition-transform" size={32} />
                    <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">Upload Brand Mark</span>
                  </>
                )}
              </div>
            </div>

            {/* IDENTITY FIELDS */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Vendor Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. A1 Logistics" required />
              <FormInput label="Official Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contact@vendor.com" type="email" />
              <FormInput label="Physical Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Suite, City, Country" required />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner Hierarchy</label>
                <select name="hierarchy" value={formData.hierarchy} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold shadow-inner cursor-pointer">
                  <option>Level 1 (Standard)</option><option>Level 2 (Strategic)</option><option>Level 3 (Priority)</option><option>Tier 1 (Critical)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LEGAL & COMPLIANCE VAULT (DOCS) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl"><ShieldCheck className="text-blue-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Legal & Compliance Vault</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DOC 1: Verification */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileCheck size={14} className="text-blue-500"/> Verification Document (GST/Trade License) *
                </label>
                <input type="file" ref={docInputRef} className="hidden" onChange={(e) => handleFileUpload(e, setDocName, "verificationFile")} />
                <div onClick={() => docInputRef.current.click()} className="p-6 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-white hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-3">
                        <UploadCloud className="text-slate-300 group-hover:text-blue-500" size={24} />
                        <span className="text-xs font-bold text-slate-500">{docName || "Upload PDF or Image"}</span>
                    </div>
                    {docName && <X size={16} className="text-rose-400 hover:text-rose-600" onClick={(e) => {e.stopPropagation(); setDocName("")}}/>}
                </div>
            </div>

            {/* DOC 2: Contract */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-indigo-500"/> Legal Service Contract (Signed PDF)
                </label>
                <input type="file" ref={contractInputRef} className="hidden" onChange={(e) => handleFileUpload(e, setContractName, "contractFile")} />
                <div onClick={() => contractInputRef.current.click()} className="p-6 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-white hover:border-indigo-300 transition-all">
                    <div className="flex items-center gap-3">
                        <FileText className="text-slate-300 group-hover:text-indigo-500" size={24} />
                        <span className="text-xs font-bold text-slate-500">{contractName || "Attach Digital Contract"}</span>
                    </div>
                    {contractName && <X size={16} className="text-rose-400" onClick={(e) => {e.stopPropagation(); setContractName("")}}/>}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10 border-t border-slate-50 pt-8">
            <SelectField label="Partner Status" name="status" value={formData.status} onChange={handleInputChange} options={["Active", "Inactive"]} />
            <SelectField label="KYC Verification" name="verification" value={formData.verification} onChange={handleInputChange} options={["Verified", "Pending"]} />
            <FormInput label="Assigned Hubs" name="warehouses" type="number" value={formData.warehouses} onChange={handleInputChange} />
            <FormInput label="SKU Capacity" name="suppliesQuantity" type="number" value={formData.suppliesQuantity} onChange={handleInputChange} />
          </div>
        </div>

        {/* SECTION 3: CONTRACTUAL NOTES */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><Layers className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Procurement Directives</h2>
          </div>
          <textarea 
            name="details" 
            value={formData.details} 
            onChange={handleInputChange} 
            rows={4} 
            placeholder="Outline performance SLAs, return policies, or specialized procurement terms..."
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* FORM ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
            <Save size={20} /> {formData.id ? "Synchronize Network Data" : "Finalize Partner Onboarding"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
            Abort
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-green-600">{label} {required && "*"}</label>
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

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-green-50/50 transition-all text-sm font-bold shadow-inner cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}