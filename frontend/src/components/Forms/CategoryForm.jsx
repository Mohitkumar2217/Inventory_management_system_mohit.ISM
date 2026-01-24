import React, { useState } from "react";
import { 
    ArrowLeft, Save, Box, Zap, AlertTriangle, 
    ThermometerSnowflake, ShieldAlert, BarChart3,
    Award, Globe, Truck, DollarSign, Mail, Phone, ShieldCheck,
    Plus, X, Briefcase
} from "lucide-react";

export default function CategoryForm({ formData, handleInputChange, handleSubmit, onCancel, currentId }) {
    // Local state for the brand currently being typed (Staging Area)
    const [tempBrand, setTempBrand] = useState({
        name: "", code: "", originCountry: "India", leadTimeDays: 7,
        brandRating: 0, specialization: "general", website: "",
        supportContact: { email: "", phone: "" }, isPremium: false
    });

    const brands = formData.brand || [];

    // Handler to push staged brand into the main formData array
    const addBrandToRegistry = () => {
        if (!tempBrand.name || !tempBrand.code) {
            alert("Brand Name and Code are mandatory for registry.");
            return;
        }
        const updatedBrands = [...brands, { ...tempBrand, id: Date.now() }];
        handleInputChange({ target: { name: "brand", value: updatedBrands } });
        
        // Reset staging form
        setTempBrand({
            name: "", code: "", originCountry: "India", leadTimeDays: 7,
            brandRating: 0, specialization: "general", website: "",
            supportContact: { email: "", phone: "" }, isPremium: false
        });
    };

    const removeBrandFromRegistry = (index) => {
        const updatedBrands = brands.filter((_, i) => i !== index);
        handleInputChange({ target: { name: "brand", value: updatedBrands } });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 mt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <button onClick={onCancel} type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
                    <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={18} /></div>
                    Cancel
                </button>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">
                    {currentId ? "Update Category Registry" : "New Category Registration"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-8 space-y-8">
                        {/* SECTION 1: IDENTITY */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <SectionTitle icon={<Box size={16} className="text-orange-500"/>} title="Identity & SEO" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Display Name *" name="name" value={formData.name || ""} onChange={handleInputChange} required />
                                <FormInput label="Group Code *" name="code" value={formData.code || ""} onChange={handleInputChange} required />
                                {/* <FormInput label="URL Slug" name="slug" value={formData.slug || ""} onChange={handleInputChange} />
                                <FormInput label="Meta Title" name="metaTitle" value={formData.metaTitle || ""} onChange={handleInputChange} /> */}
                            </div>
                        </div>

                        {/* SECTION 2: DYNAMIC BRAND PARTNERS */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <SectionTitle icon={<Award size={16} className="text-blue-500"/>} title="Brand Partner Intelligence" />
                            
                            {/* Brand Staging Sub-Form */}
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8 space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Plus size={14} className="text-blue-500"/> Stage New Brand Partner
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Name</label>
                                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold shadow-sm" 
                                            value={tempBrand.name} onChange={(e) => setTempBrand({...tempBrand, name: e.target.value})} placeholder="e.g. Samsung" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Code</label>
                                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold shadow-sm" 
                                            value={tempBrand.code} onChange={(e) => setTempBrand({...tempBrand, code: e.target.value.toUpperCase()})} placeholder="SS-01" />
                                    </div>
                                    <div className="pt-6 col-span-2">
                                        <button type="button" onClick={addBrandToRegistry} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                                            <Plus size={18}/> Add to Registry
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Registered Brands List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {brands.map((brand, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[2rem] group hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500"><Briefcase size={20}/></div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{brand.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{brand.code} • {brand.specialization}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeBrandFromRegistry(index)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {brands.length === 0 && (
                                    <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">No brands linked to this category</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION 3: LOGISTICS & STORAGE RULES */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <SectionTitle icon={<Zap size={16} className="text-indigo-500"/>} title="Operational Storage Rules" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Storage Type</label>
                                    <select name="storageType" value={formData.storageType || "solid"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold shadow-inner">
                                        <option value="solid">Solid Storage</option>
                                        <option value="liquid">Liquid Chemical</option>
                                        <option value="air">Gaseous / Air</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hazard Level</label>
                                    <select name="hazardLevel" value={formData.hazardLevel || "None"} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold shadow-inner">
                                        <option value="None">None (Safe)</option>
                                        <option value="Low">Low Risk</option>
                                        <option value="High">High Risk / Flammable</option>
                                    </select>
                                </div>
                                <FormInput label="HSN Code (Tax)" name="hsnCode" value={formData.hsnCode || ""} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Global Thresholds & Configuration */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Thresholds */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                            <SectionTitle icon={<BarChart3 size={16} className="text-emerald-500"/>} title="Global Thresholds" />
                            <FormInput label="Default Min Stock" type="number" name="defaultMinStock" value={formData.defaultMinStock || 10} onChange={handleInputChange} />
                            <FormInput label="Default Max Stock" type="number" name="defaultMaxStock" value={formData.defaultMaxStock || 500} onChange={handleInputChange} />
                        </div>

                        {/* Registry Config */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                            <SectionTitle icon={<ShieldCheck size={16} className="text-rose-500"/>} title="Registry Config" />
                            <FormInput label="Tax Rate (%)" type="number" name="taxRate" value={formData.taxRate || 18} onChange={handleInputChange} />
                            <FormInput label="Priority Level" type="number" name="priority" value={formData.priority || 1} onChange={handleInputChange} />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Visual Label Color</label>
                                <input type="color" name="colorCode" value={formData.colorCode || "#3b82f6"} onChange={handleInputChange} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer" />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                                <input type="checkbox" name="isPrivate" checked={formData.isPrivate || false} onChange={handleInputChange} className="w-4 h-4 rounded text-blue-600" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal Restricted Category</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex gap-4">
                    <button type="submit" className="flex-[3] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                        <Save size={20} /> Finalize Category Records
                    </button>
                    <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                        Discard
                    </button>
                </div>
            </form>
        </div>
    );
}

const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
        {icon}
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const FormInput = ({ label, icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
        <div className="relative">
            <input {...props} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-700 shadow-inner text-sm" />
            {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        </div>
    </div>
);