import React from "react";
import { Store, Truck, IndianRupee, Save, FileText, Package } from "lucide-react";

export default function OrderForm({ purchaseOrder, handleFormChange, handleSubmit, onCancel }) {
  // Real-time calculation for Order Value preview
  const totalOrderValue = (parseFloat(purchaseOrder.unitPrice || 0) * parseInt(purchaseOrder.quantity || 0)).toLocaleString('en-IN');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION 1: PROCUREMENT DETAILS */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <Store size={18} className="text-indigo-400" /> Procurement Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Vendor Name" name="vendorName" value={purchaseOrder.vendorName} onChange={handleFormChange} required />
            <FormInput label="Item Name" name="itemName" value={purchaseOrder.itemName} onChange={handleFormChange} required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select name="category" value={purchaseOrder.category} onChange={handleFormChange} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none shadow-inner">
                <option>Electronics</option><option>Beauty</option><option>Home</option><option>Grocery</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DESCRIPTION & NOTES */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <FileText size={18} className="text-cyan-400" /> Order Specifications
          </h2>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Instructions</label>
            <textarea 
              name="notes" 
              value={purchaseOrder.notes} 
              onChange={handleFormChange} 
              rows={4} 
              placeholder="Enter internal procurement notes or vendor instructions..."
              className="w-full p-5 bg-slate-50 border-none rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-600 shadow-inner resize-none"
            />
          </div>
        </div>

        {/* SECTION 3: LOGISTICS */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <Truck size={18} className="text-emerald-400" /> Logistics & Warehouse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Warehouse Location</label>
              <select name="warehouse" value={purchaseOrder.warehouse} onChange={handleFormChange} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner">
                <option>Main Warehouse</option><option>Hub A</option><option>North Dock</option>
              </select>
            </div>
            <FormInput label="Expected Delivery Date" name="expectedDate" value={purchaseOrder.expectedDate} onChange={handleFormChange} type="date" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Terms</label>
              <select name="paymentTerms" value={purchaseOrder.paymentTerms} onChange={handleFormChange} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner">
                <option>Due on Receipt</option><option>Net 15</option><option>Net 30</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: COSTING & VALUATION */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <IndianRupee size={18} className="text-amber-500" /> Costing & Valuation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <FormInput label="Quantity (Units)" name="quantity" value={purchaseOrder.quantity} onChange={handleFormChange} type="number" required />
            <FormInput label="Unit Price (₹)" name="unitPrice" value={purchaseOrder.unitPrice} onChange={handleFormChange} type="number" required />
          </div>

          {/* Dynamic Order Value Card */}
          <div className="bg-slate-900 rounded-[2rem] p-6 flex items-center justify-between group overflow-hidden relative">
            <div className="z-10">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Procurement Value</p>
              <h3 className="text-white text-2xl font-black">₹ {totalOrderValue}</h3>
            </div>
            <Package className="text-white/10 absolute -right-4 -bottom-4 rotate-12 group-hover:scale-125 transition-transform duration-700" size={100} />
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex gap-4">
          <button type="submit" className="flex-[2] bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Save size={22} /> {purchaseOrder.id ? 'Update Purchase Order' : 'Save Purchase Order'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label} {required && "*"}</label>
      <input 
        required={required} 
        name={name} 
        value={value} 
        onChange={onChange} 
        type={type} 
        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner" 
      />
    </div>
  );
}