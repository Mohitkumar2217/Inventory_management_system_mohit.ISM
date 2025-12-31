import React, { useState } from "react";
import { FaFilter, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export default function OutOfStockCard() {
  const [items, setItems] = useState([
    { name: "Organic Cream", category: { name: "Beauty" }, image: "🧴" },
    { name: "Rain Umbrella", category: { name: "Grocery" }, image: "⛱️" },
    { name: "Serum Bottle", category: { name: "Beauty" }, image: "🧪" },
    { name: "Coffee Beans", category: { name: "Food" }, image: "🫘" },
    { name: "Wireless Mouse", category: { name: "Electronics" }, image: "🖱️" },
    { name: "Smart Watch", category: { name: "Electronics" }, image: "⌚" },
    { name: "Yoga Mat", category: { name: "Home" }, image: "🧘" },
    { name: "Green Tea", category: { name: "Food" }, image: "🍵" },
    { name: "Desk Lamp", category: { name: "Home" }, image: "💡" },
    { name: "Bluetooth Speaker", category: { name: "Electronics" }, image: "🔊" },
    { name: "Face Wash", category: { name: "Beauty" }, image: "🧼" },
    { name: "Running Shoes", category: { name: "Home" }, image: "👟" },
    { name: "Milk Carton", category: { name: "Grocery" }, image: "🥛" },
    { name: "Dark Chocolate", category: { name: "Food" }, image: "🍫" },
    { name: "Headphones", category: { name: "Electronics" }, image: "🎧" },
    { name: "Water Bottle", category: { name: "Grocery" }, image: "🍼" },
    { name: "Hand Sanitizer", category: { name: "Grocery" }, image: "🧴" },
    { name: "Laptop Stand", category: { name: "Electronics" }, image: "💻" },
    { name: "Olive Oil", category: { name: "Food" }, image: "🫒" },
    { name: "Backpack", category: { name: "Home" }, image: "🎒" },
  ]);

  const [openFilter, setOpenFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredItems = items.filter(item => {
    return categoryFilter ? item.category?.name === categoryFilter : true;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 flex flex-col h-[500px] relative overflow-hidden">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-rose-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
            <FaBoxOpen className="text-rose-500 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Out of Stock</h2>
            <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.15em] mt-0.5">Critical Inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deficit</span>
            <span className="text-sm font-black text-rose-600">{filteredItems.length} SKU</span>
          </div>

          <button
            onClick={() => setOpenFilter(!openFilter)}
            className={`p-3 rounded-xl border transition-all ${openFilter ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            <FaFilter size={14} />
          </button>

          {/* Filter Dropdown */}
          {openFilter && (
            <div className="absolute right-6 top-20 bg-white shadow-2xl border border-slate-100 rounded-2xl p-5 w-64 z-50 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Filter By Category</h4>
              <select
                className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {[...new Set(items.map(i => i.category?.name).filter(Boolean))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all rounded-[1.5rem] p-4 flex justify-between items-center group relative overflow-hidden"
            >
              {/* Animated subtle background on hover */}
              <div className="absolute inset-0 bg-rose-50/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>

              <div className="flex flex-col justify-between h-full min-w-0 relative z-10">
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-sm group-hover:text-rose-600 transition-colors truncate mb-0.5">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                    {item.category.name}
                  </p>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <button className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-rose-600 transition-colors shadow-sm">
                    <FaShoppingCart size={10} /> Restock
                  </button>
                </div>
              </div>

              {/* Product Visual */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-50 border border-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                {item.image}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Blur Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
}