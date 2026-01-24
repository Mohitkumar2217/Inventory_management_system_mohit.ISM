import React, { useRef, useState } from "react";
import {
  User, Mail, Phone, MapPin,
  Save, FileText, ChevronDown,
  Camera, ShieldCheck, UploadCloud, X,
  BadgeCheck, Landmark, Eye, EyeOff
} from "lucide-react";

export default function StaffForm({ formData, handleInputChange, handleSubmit, onCancel }) {
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [docName, setDocName] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        handleInputChange({ target: { name: "img", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) setDocName(file.name);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">

        {/* SECTION 1: IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><User className="text-indigo-600" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Personnel Identity</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 flex flex-col items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block w-full text-center">Profile Photograph</label>
              <input type="file" ref={photoInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
              <div
                onClick={() => photoInputRef.current.click()}
                className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-400 transition-all overflow-hidden relative shadow-inner"
              >
                {photoPreview || formData.img ? (
                  <img src={photoPreview || formData.img} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-slate-300 group-hover:text-indigo-500 mb-2 transition-transform group-hover:scale-110" size={32} />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Capture / Upload</span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Full Name" name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="Enter legal name" required />
              <FormInput
                label="Employee ID"
                name="employeeId" // This must match your state key exactly
                value={formData.employeeId || ""}
                onChange={handleInputChange}
                placeholder="EMP-2025-XXXX"
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Department</label>
                <div className="relative">
                  <select name="department" value={formData.department || "Logistics & Warehouse"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="Logistics & Warehouse">Logistics & Warehouse</option>
                    <option value="Inventory Control">Inventory Control</option>
                    <option value="Administration">Administration</option>
                    <option value="Quality Assurance Staff">Quality Assurance Staff</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Level</label>
                <div className="relative">
                  <select name="role" value={formData.role || "staff"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option value="admin">System Administrator</option>
                    <option value="manager">System Manager</option>
                    <option value="warehouse">Warehouse Lead</option>
                    <option value="staff">Junior Staff</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl"><Phone className="text-emerald-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Contact & Reach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Official Email" name="email" value={formData.email || ""} onChange={handleInputChange} placeholder="name@company.com" icon={<Mail size={14} />} />
            <PasswordInput label="System Password" name="password" value={formData.password || ""} onChange={handleInputChange} />
            <FormInputNumber label="Phone Number" name="phone" value={formData.phone || ""} onChange={handleInputChange} placeholder="XXXXX XXXXX" icon={<Phone size={14} />} required />
            <FormInput label="Address" name="address" value={formData.address || ""} onChange={handleInputChange} placeholder="Hub A, Jaipur" icon={<MapPin size={14} />} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Status</label>
              <div className="relative">
                <select name="status" value={formData.status || "Active"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender *</label>
              <div className="relative">
                <select name="gender" value={formData.gender || "male"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="not specified">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DOCUMENTATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-xl"><BadgeCheck className="text-amber-500" size={18} /></div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Identity Verification</h2>
            </div>
            <p className="text-[11px] text-slate-400 mb-6 leading-tight font-medium uppercase tracking-wider">Please upload a scanned copy of Govt Issued ID (Aadhar/PAN/Passport).</p>
            <input type="file" ref={docInputRef} onChange={handleDocChange} className="hidden" />
            <div
              onClick={() => docInputRef.current.click()}
              className="w-full p-8 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2.5rem] flex flex-col items-center justify-center group hover:bg-white hover:border-amber-400 transition-all cursor-pointer"
            >
              {docName ? (
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                  <FileText className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-700">{docName}</span>
                  <X className="text-slate-300 hover:text-rose-500 cursor-pointer" size={16} onClick={(e) => { e.stopPropagation(); setDocName(""); }} />
                </div>
              ) : (
                <>
                  <UploadCloud className="text-slate-300 group-hover:text-amber-500 mb-2 transition-bounce" size={40} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Select Verification PDF/JPG</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl"><ShieldCheck className="text-cyan-400" size={18} /></div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">System Privileges</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Access Token Type</label>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold border border-white/10">BIO-METRIC</span>
                    <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold border border-white/10">RFID CARD</span>
                    <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-[10px] font-black border border-cyan-500/30">MOBILE OTP</span>
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-white/60 leading-relaxed italic">"Access to financial reports and payroll modules is restricted to Admin and Manager roles only."</p>
                </div>
              </div>
            </div>
            <Landmark className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />
          </div>
        </div>

        {/* SECTION 4: ASSIGNMENTS */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl"><FileText className="text-indigo-500" size={18} /></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Core Assignments</h2>
          </div>
          <textarea
            name="works"
            value={formData.works || ""}
            onChange={handleInputChange}
            rows={4}
            placeholder="Outline specialized roles, specific zone assignments, or key performance indicators (KPIs)..."
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
            <Save size={22} /> {formData._id ? "Synchronize Updates" : "Commit to Registry"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Discard Changes</button>
        </div>
      </form>
    </div>
  );
}

function PasswordInput({ label, name, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          value={value || ""}
          onChange={onChange}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-700 shadow-inner text-sm"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false, icon }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-500">{label} {required && "*"}</label>
      <div className="relative">
        <input
          required={required}
          name={name}
          value={value || ""}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-bold text-slate-700 shadow-inner"
        />
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      </div>
    </div>
  );
}

function FormInputNumber({ label, name, value, onChange, placeholder, required = false, icon }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-500">{label} {required && "*"}</label>
      <div className="relative flex items-center w-full bg-slate-50 border border-slate-100 rounded-2xl shadow-inner focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all overflow-hidden">
        <span className="pl-4 pr-1 text-sm font-black text-slate-400 border-r border-slate-200">+91</span>
        <input
          required={required}
          name={name}
          value={value || ""}
          onChange={onChange}
          type="tel"
          placeholder={placeholder}
          className="w-full p-4 bg-transparent outline-none text-sm font-bold text-slate-700"
        />
        {icon && <div className="pr-4 text-slate-300">{icon}</div>}
      </div>
    </div>
  );
}