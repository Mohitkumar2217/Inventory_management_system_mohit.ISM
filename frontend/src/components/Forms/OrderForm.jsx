import React from "react";
import {
  Store, Truck, IndianRupee, Save, FileText, Layers, Plus,
  Package, ChevronDown, Calendar, CreditCard,
  Hash, Tag, ShieldCheck, MapPin, Percent, Phone, Trash2, Search
} from "lucide-react";

export default function OrderForm({
  purchaseOrder,
  handleFormChange,
  handleSubmit,
  onCancel,
  suppliers = [],
  zones = [],
  categories = [],
  warehouses = [],
  allProducts = []
}) {

  // --- AUTO-FETCH LOGIC (LOCAL SEARCH) ---
  // const handleProductSearch = (productId) => {
  //   if (!productId) return;

  //   const matchedProduct = allProducts.find(
  //     (p) => p.code === productId || p.sku === productId
  //   );

  //   if (matchedProduct) {
  //     const updates = {
  //       itemName: matchedProduct.name,
  //       sku: matchedProduct.sku || matchedProduct.code,
  //       brand: matchedProduct.brand,
  //       category: matchedProduct.category,
  //       unitPrice: matchedProduct.price,
  //       images: matchedProduct.images || []
  //     };

  //     Object.entries(updates).forEach(([name, value]) => {
  //       handleFormChange({ target: { name, value } });
  //     });
  //   } else {
  //     alert("System Error: Product ID not found in inventory registry.");
  //   }
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault(); 
  //     handleProductSearch(purchaseOrder.productId);
  //   }
  // };

  // --- FINANCIAL CALCULATIONS ---
  const qty = parseInt(purchaseOrder.quantity || 0);
  const price = parseFloat(purchaseOrder.unitPrice || 0);
  const taxRate = parseFloat(purchaseOrder.taxRate || 0);
  const shipping = parseFloat(purchaseOrder.shippingCharges || 0);
  const discount = parseFloat(purchaseOrder.discount || 0);

  const subtotal = qty * price;
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = (subtotal + taxAmount + shipping - discount).toLocaleString('en-IN');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 mt-8">

        {/* SECTION 1: CORE IDENTITY & IDENTIFICATION */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <SectionHeader icon={<Hash className="text-blue-500" />} title="Order Identification" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FormInput label="Purchase Order #" name="poNumber" value={purchaseOrder.poNumber} onChange={handleFormChange} placeholder="PO-2024-001" required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Priority</label>
              <div className="relative">
                <select
                  name="priority"
                  value={purchaseOrder.priority ?? "standard"}
                  onChange={handleFormChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-50/50 transition-all"
                >
                  <option value="standard">Standard</option>
                  <option value="urgent">Urgent / Restock</option>
                  <option value="critical">Critical (Stock Out)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            <FormInput label="Reference / Quote ID" name="refId" value={purchaseOrder.refId} onChange={handleFormChange} placeholder="REF-9921" />
          </div>
        </div>

        {/* SECTION 2: VENDOR & PRODUCT DETAILS */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <SectionHeader icon={<Store className="text-indigo-500" />} title="Source Supplier & Specification" />

          {purchaseOrder.images?.length > 0 && (
            <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-in zoom-in-95">
              <div className="flex -space-x-6 overflow-hidden">
                {purchaseOrder.images.map((img, i) => (
                  <img key={i} src={img} className="inline-block h-20 w-20 rounded-3xl ring-4 ring-white object-cover shadow-lg" alt="registry-asset" />
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Matched Registry Asset</p>
                <p className="text-lg font-black text-slate-800 leading-none">{purchaseOrder.itemName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Meta Details Synchronized</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6">
              <SelectField label="Vendor / Supplier Name *" name="vendorName" value={purchaseOrder?.vendorName} onChange={handleFormChange} options={suppliers} />
            </div>
            <div className="md:col-span-6">
              <FormInput label="Vendor Contact Email" name="vendorEmail" type="email" value={purchaseOrder.vendorEmail} onChange={handleFormChange} placeholder="orders@supplier.com" required />
            </div>
            <div className="md:col-span-4">
              <FormInput label="Item Specification (Auto)" name="itemName" value={purchaseOrder.itemName} onChange={handleFormChange} placeholder="Product name..." required />
            </div>
            <div className="md:col-span-4">
              <FormInput label="SKU / Batch Code (Auto)" name="sku" value={purchaseOrder.sku} onChange={handleFormChange} placeholder="SKU-88-B" required />
            </div>
            <div className="md:col-span-4">
              <SelectField label="Category Group *" name="category" value={purchaseOrder?.category} onChange={handleFormChange} options={categories} />
            </div>
          </div>
        </div>

        {/* SECTION 3: LOGISTICS & WAREHOUSING */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <SectionHeader icon={<Truck className="text-emerald-500" />} title="Logistics & Destination" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <SelectField label="Destination Warehouse *" name="warehouse" value={purchaseOrder?.warehouse} onChange={handleFormChange} options={warehouses} />
            </div>
            <FormInput label="Ship Via (Method)" name="shippingMethod" value={purchaseOrder.shippingMethod} onChange={handleFormChange} placeholder="e.g. Air Freight" required />
            <FormInput label="ETA Date" name="expectedDate" value={purchaseOrder.expectedDate} onChange={handleFormChange} type="date" required />
            <FormInput label="Warehouse Contact #" name="whContact" value={purchaseOrder.whContact} onChange={handleFormChange} placeholder="+91..." required />
            <div className="md:col-span-1">
              <SelectField label="Warehouse Zone *" name="zone" value={purchaseOrder?.zone} onChange={handleFormChange} options={zones} />
            </div>
            <div className="md:col-span-2">
              <FormInput label="Full Delivery Address" name="deliveryAddress" value={purchaseOrder.deliveryAddress} onChange={handleFormChange} placeholder="Street, Building, Area..." required />
            </div>
          </div>
        </div>

        {/* SECTION 4: FINANCIAL VALUATION */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <SectionHeader icon={<IndianRupee className="text-amber-500" />} title="Financials & Tax" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <FormInput label="Quantity" name="quantity" value={purchaseOrder.quantity} onChange={handleFormChange} type="number" required />
            <FormInput label="Unit Cost (₹)" name="unitPrice" value={purchaseOrder.unitPrice} onChange={handleFormChange} type="number" required />
            <FormInput label="Tax Rate (%)" name="taxRate" value={purchaseOrder.taxRate} onChange={handleFormChange} type="number" />
            <FormInput label="Shipping Fees (₹)" name="shippingCharges" value={purchaseOrder.shippingCharges} onChange={handleFormChange} type="number" />
            <FormInput label="Discount (₹)" name="discount" value={purchaseOrder.discount} onChange={handleFormChange} type="number" />
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Terms</label>
                <div className="relative">
                  <select
                    name="paymentTerms"
                    value={purchaseOrder.paymentTerms ?? "Due on Receipt"}
                    onChange={handleFormChange}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-50/50 transition-all"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Advance 50%">Advance 50%</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
            <FormInput label="Target Stock Level" name="minStock" value={purchaseOrder.minStock} onChange={handleFormChange} type="number" placeholder="Reorder point" />
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between group overflow-hidden relative shadow-2xl">
            <div className="z-10">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Grand Total Amount</p>
              <h3 className="text-white text-4xl font-black tracking-tighter">₹ {grandTotal}</h3>
              <div className="flex gap-4 mt-2">
                <span className="text-white/40 text-[9px] font-bold uppercase italic tracking-widest">Sub: ₹{subtotal}</span>
                <span className="text-white/40 text-[9px] font-bold uppercase italic tracking-widest">Tax: ₹{taxAmount}</span>
              </div>
            </div>
            <Package className="text-white/5 absolute -right-6 -bottom-6 rotate-12 group-hover:scale-110 group-hover:text-white/10 transition-all duration-1000" size={180} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="submit" className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]">
            <Save size={20} /> {purchaseOrder._id ? 'Commit Updates' : 'Generate Order'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-white border border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-[0.2em]">
            Abort Entry
          </button>
        </div>
      </form>
    </div>
  );
}

// --- HELPER SUB-COMPONENTS ---
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">{title}</h2>
    </div>
  );
}

function FormInput({ label, name, value, onChange, onKeyDown, type = "text", required = false, placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 tracking-widest flex items-center gap-1">
        {label} {required && <span className="text-rose-500 text-xs">*</span>}
      </label>
      <input
        required={required}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        type={type}
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner placeholder:text-slate-300"
      />
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
          value={value ?? ""}
          onChange={onChange}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-50/50 transition-all"
        >
          <option value="">Select Option</option>
          {options && options.filter(opt => opt !== null).map((opt, index) => {
            const val = typeof opt === 'object' ? (opt._id || opt.id || opt.name || index) : opt;
            const lbl = typeof opt === 'object' ? (opt.name || opt.warehouse || opt.zone) : opt;
            return <option key={index} value={val}>{lbl}</option>;
          })}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}