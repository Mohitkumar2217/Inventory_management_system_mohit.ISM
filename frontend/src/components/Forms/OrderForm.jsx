import React from "react";
import { 
  Store, Truck, IndianRupee, Save, FileText, 
  Package, ChevronDown, Calendar, CreditCard,
  Hash, Tag
} from "lucide-react";

export default function OrderForm({ purchaseOrder, handleFormChange, handleSubmit, onCancel }) {
  // Real-time calculation for Order Value preview
  const totalOrderValue = (parseFloat(purchaseOrder.unitPrice || 0) * parseInt(purchaseOrder.quantity || 0)).toLocaleString('en-IN');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 mt-8">
        
        {/* SECTION 1: PROCUREMENT IDENTITY */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Store size={20} className="text-indigo-500" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Procurement Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <FormInput label="Vendor / Supplier Name" name="vendorName" value={purchaseOrder.vendorName} onChange={handleFormChange} placeholder="Search or enter vendor..." required />
            </div>
            <div className="md:col-span-4">
              <FormInput label="Item Specification" name="itemName" value={purchaseOrder.itemName} onChange={handleFormChange} placeholder="Product name or SKU..." required />
            </div>
            <div className="md:col-span-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Tag size={10}/> Category Group
                </label>
                <div className="relative">
                  <select name="category" value={purchaseOrder.category} onChange={handleFormChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-bold appearance-none shadow-inner cursor-pointer">
                    <option>Electronics</option><option>Beauty</option><option>Home</option><option>Grocery</option><option>Food</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOGISTICS & TIMELINE */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Truck size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Logistics & Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Warehouse</label>
              <div className="relative">
                <select name="warehouse" value={purchaseOrder.warehouse} onChange={handleFormChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none shadow-inner outline-none focus:ring-4 focus:ring-emerald-50/50 transition-all cursor-pointer">
                  <option>Main Hub - New Delhi</option><option>North Dock - Jaipur</option><option>South Unit - Mumbai</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            <FormInput label="ETA / Expected Arrival" name="expectedDate" value={purchaseOrder.expectedDate} onChange={handleFormChange} type="date" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <CreditCard size={10}/> Payment Terms
              </label>
              <div className="relative">
                <select name="paymentTerms" value={purchaseOrder.paymentTerms} onChange={handleFormChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none shadow-inner outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all cursor-pointer">
                  <option>Due on Receipt</option><option>Net 15</option><option>Net 30</option><option>Advance 50%</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: COSTING & FINANCIALS */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="p-2 bg-amber-50 rounded-xl">
              <IndianRupee size={20} className="text-amber-500" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Financial Valuation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <FormInput label="Order Quantity" name="quantity" value={purchaseOrder.quantity} onChange={handleFormChange} type="number" placeholder="0" required />
            <FormInput label="Unit Cost (₹)" name="unitPrice" value={purchaseOrder.unitPrice} onChange={handleFormChange} type="number" placeholder="0.00" required />
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Notes</label>
               <textarea 
                name="notes" 
                value={purchaseOrder.notes} 
                onChange={handleFormChange} 
                rows={1} 
                placeholder="Quality checks, etc..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-50/50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
              />
            </div>
          </div>

          {/* Dynamic Order Value Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between group overflow-hidden relative shadow-2xl">
            <div className="z-10">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Transaction Value</p>
              <h3 className="text-white text-4xl font-black tracking-tighter">₹ {totalOrderValue}</h3>
              <p className="text-white/40 text-[9px] font-bold mt-2 uppercase tracking-widest italic">* Including standard system tax calculations</p>
            </div>
            <Package className="text-white/5 absolute -right-6 -bottom-6 rotate-12 group-hover:scale-110 group-hover:text-white/10 transition-all duration-1000" size={180} />
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]">
            <Save size={20} /> {purchaseOrder.id ? 'Commit Updates' : 'Generate Order'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-[0.2em]">
            Abort Entry
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input 
        required={required} 
        name={name} 
        value={value} 
        onChange={onChange} 
        type={type} 
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner placeholder:text-slate-300" 
      />
    </div>
  );
}