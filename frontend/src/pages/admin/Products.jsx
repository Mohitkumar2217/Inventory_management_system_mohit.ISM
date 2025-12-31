import React, { useState, useRef, useEffect } from "react";
import ProductSummaryCard from "../../components/Summerys/ProductSummaryCard.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Save, Package, IndianRupee, Layers, X, ChevronDown, Printer, Share2,
  ChevronLeft, ChevronRight
} from "lucide-react";
import ProductForm from "../../components/Forms/ProductForm.jsx";

export default function Products() {
  const initialProducts = [
    { id: 1, name: "Organic Cream", code: "CREM01", category: "Beauty", price: 250.0, cost: 100.0, stock: 10, brand: "Lakme", img: "🧴", details: "Premium organic skin cream." },
    { id: 2, name: "Rain Umbrella", code: "UM01", category: "Grocery", price: 300.0, cost: 200.0, stock: 15, brand: "Sun", img: "⛱️", details: "Heavy-duty windproof umbrella." },
    { id: 3, name: "Serum Bottle", code: "SEM01", category: "Beauty", price: 500.0, cost: 250.0, stock: 50, brand: "Blushing", img: "🧪", details: "Vitamin C facial serum." },
    { id: 4, name: "Coffee Beans", code: "COF01", category: "Food", price: 320.0, cost: 200.0, stock: 50, brand: "Nescafe", img: "🫘", details: "Arabica dark roast beans." },
    { id: 5, name: "Wireless Mouse", code: "MOU05", category: "Electronics", price: 450.0, cost: 150.0, stock: 120, brand: "Logitech", img: "🖱️", details: "Ergonomic 2.4GHz wireless mouse." },
    { id: 6, name: "Smart Watch", code: "WAT06", category: "Electronics", price: 1999.0, cost: 850.0, stock: 30, brand: "Apple", img: "⌚", details: "Fitness tracking and notifications." },
    { id: 7, name: "Yoga Mat", code: "YOG07", category: "Home", price: 200.0, cost: 80.0, stock: 45, brand: "FitLife", img: "🧘", details: "Non-slip extra thick exercise mat." },
    { id: 8, name: "Green Tea", code: "TEA08", category: "Food", price: 120.0, cost: 45.0, stock: 200, brand: "Lipton", img: "🍵", details: "Antioxidant-rich organic green tea." },
    { id: 9, name: "Desk Lamp", code: "LAM09", category: "Home", price: 350.0, cost: 120.0, stock: 25, brand: "IKEA", img: "💡", details: "Adjustable LED eye-protection lamp." },
    { id: 10, name: "Bluetooth Speaker", code: "SPE10", category: "Electronics", price: 850.0, cost: 400.0, stock: 60, brand: "JBL", img: "🔊", details: "Waterproof portable bass speaker." },
    { id: 11, name: "Face Wash", code: "WAS11", category: "Beauty", price: 150.0, cost: 60.0, stock: 85, brand: "Neutrogena", img: "🧼", details: "Deep cleansing oil-free wash." },
    { id: 12, name: "Running Shoes", code: "SHO12", category: "Home", price: 1200.0, cost: 550.0, stock: 40, brand: "Nike", img: "👟", details: "Lightweight breathable marathon shoes." },
    { id: 13, name: "Milk Carton", code: "MIL13", category: "Grocery", price: 45.0, cost: 20.0, stock: 300, brand: "Amul", img: "🥛", details: "Full cream homogenized milk." },
    { id: 14, name: "Dark Chocolate", code: "CHO14", category: "Food", price: 80.0, cost: 35.0, stock: 150, brand: "Lindt", img: "🍫", details: "85% Cocoa intense dark chocolate." },
    { id: 15, name: "Headphones", code: "HEA15", category: "Electronics", price: 2500.0, cost: 1100.0, stock: 20, brand: "Sony", img: "🎧", details: "Noise-canceling over-ear headphones." },
    { id: 16, name: "Water Bottle", code: "BOT16", category: "Grocery", price: 250.0, cost: 100.0, stock: 110, brand: "Milton", img: "🍼", details: "Insulated stainless steel bottle." },
    { id: 17, name: "Hand Sanitizer", code: "SAN17", category: "Grocery", price: 50.0, cost: 15.0, stock: 500, brand: "Dettol", img: "🧴", details: "Kills 99.9% of germs instantly." },
    { id: 18, name: "Laptop Stand", code: "STA18", category: "Electronics", price: 400.0, cost: 180.0, stock: 55, brand: "Portronics", img: "💻", details: "Aluminum foldable laptop riser." },
    { id: 19, name: "Olive Oil", code: "OLI19", category: "Food", price: 180.0, cost: 90.0, stock: 75, brand: "Figaro", img: "🫒", details: "Extra virgin cold-pressed olive oil." },
    { id: 20, name: "Backpack", code: "BAC20", category: "Home", price: 550.0, cost: 220.0, stock: 40, brand: "Wildcraft", img: "🎒", details: "Water-resistant travel backpack." },
    { id: 21, name: "Mechanical Keyboard", code: "KEY21", category: "Electronics", price: 4500.0, cost: 2200.0, stock: 35, brand: "Razer", img: "⌨️", details: "RGB backlit mechanical switches." },
    { id: 22, name: "Sunscreen SPF50", code: "SUN22", category: "Beauty", price: 850.0, cost: 320.0, stock: 95, brand: "L'Oreal", img: "☀️", details: "Non-greasy broad spectrum protection." },
    { id: 23, name: "Cereal Box", code: "CER23", category: "Food", price: 450.0, cost: 210.0, stock: 180, brand: "Kellogg's", img: "🥣", details: "Corn flakes with real honey." },
    { id: 24, name: "Power Bank", code: "POW24", category: "Electronics", price: 2200.0, cost: 1100.0, stock: 65, brand: "Anker", img: "🔋", details: "20000mAh fast-charging portable power." },
    { id: 25, name: "Electric Kettle", code: "KET25", category: "Home", price: 1800.0, cost: 950.0, stock: 40, brand: "Philips", img: "🫖", details: "1.5L rapid boil stainless steel kettle." }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: "All", stockStatus: "All", priceRange: "All" });
  const filterRef = useRef(null);

  const initialFormState = {
    id: null, name: "", code: "", category: "Beauty", price: "", cost: "",
    stock: "", brand: "", details: "", sku: "", supplier: "", minStock: "",
    weight: "", dimensions: "", color: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ACTIONS: EYE, EDIT, DELETE ---
  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setView("view-details");
  };

  const handleEditDetails = (product) => {
    setFormData({ ...product });
    setView("edit");
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  //--- ACTIONS: FORMS DETAILS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      img: formData.img || "📦"
    };

    if (formData.id) {
      setProducts(products.map(p => p.id === formData.id ? productData : p));
    } else {
      setProducts([{ ...productData, id: Date.now() }, ...products]);
    }

    setFormData(initialFormState);
    setView("list");
  };

  // --- FILTER LOGIC ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilters.category === "All" || p.category === activeFilters.category;
    const matchesStock = activeFilters.stockStatus === "All" || (activeFilters.stockStatus === "Low Stock" ? p.stock < 20 : p.stock >= 20);

    let matchesPrice = true;
    if (activeFilters.priceRange === "Under ₹500") matchesPrice = p.price < 500;
    else if (activeFilters.priceRange === "₹500 - ₹2000") matchesPrice = p.price >= 500 && p.price <= 2000;
    else if (activeFilters.priceRange === "Above ₹2000") matchesPrice = p.price > 2000;

    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  });
  // --- CORRECTED SUMMARY CALCULATION ---
  const itemsSummary = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalOrders: products.filter(p => p.stock < 20).length, // Mapped as Low Stock Alerts
    totalCancelled: new Set(products.map(p => p.category)).size, // Mapped as Categories
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.stock), 0), // Inventory Valuation
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div className="p-2 md:p-4 min-h-screen bg-slate-50/50 font-sans text-slate-900">

      {view === "list" ? (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
          <ProductSummaryCard items={itemsSummary} nameSum="Inventory" />

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* show page */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                Show
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-slate-200 rounded-xl px-3 py-1 bg-slate-50 outline-none">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={initialProducts.length}>all</option>
                </select>
                Entries
              </div>

              <div className="flex gap-3 w-full md:w-auto relative">
                {/* search section */}
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-cyan-100" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                </div>
                {/* filter section */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilterPopup(!showFilterPopup)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all border ${showFilterPopup
                      ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200'
                      : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                  >
                    <Filter size={18} />
                    Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-50 w-72 bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 origin-top-right animate-in zoom-in-95 duration-200">
                      <div className="grid gap-5">
                        {/* Category Filter */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                          <select
                            value={activeFilters.category}
                            onChange={(e) => setActiveFilters({ ...activeFilters, category: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>

                        {/* Stock Status Filter */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability</label>
                          <select
                            value={activeFilters.stockStatus}
                            onChange={(e) => setActiveFilters({ ...activeFilters, stockStatus: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
                          >
                            <option value="All">All Items</option>
                            <option value="In Stock">In Stock Only</option>
                            <option value="Low Stock">Low Stock Alert</option>
                          </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                          <select
                            value={activeFilters.priceRange}
                            onChange={(e) => setActiveFilters({ ...activeFilters, priceRange: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
                          >
                            <option value="All">Any Price</option>
                            <option value="Under ₹500">Under ₹500</option>
                            <option value="₹500 - ₹2000">₹500 - ₹2000</option>
                            <option value="Above ₹2000">Above ₹2000</option>
                          </select>
                        </div>

                        {/* Reset Action */}
                        <button
                          onClick={() => setActiveFilters({ category: "All", stockStatus: "All", priceRange: "All" })}
                          className="w-full py-2 mt-2 text-rose-500 hover:bg-rose-50 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* add product */}
                <button
                  onClick={() => { setFormData(initialFormState); setView("add"); }}
                  className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-95"
                >
                  <Plus size={20} /> Product
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="p-5">Product Info</th>
                    <th className="p-5">Identifier</th>
                    <th className="p-5">Department</th>
                    <th className="p-5">M.R.P</th>
                    <th className="p-5">Availability</th>
                    <th className="p-5 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 flex items-center gap-3">
                        <span className="text-2xl">{item.img}</span>
                        <div className="flex flex-col">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.brand}</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 font-mono text-xs">{item.code}</td>
                      <td className="p-5"><span className="bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-500 uppercase text-[9px] shadow-sm">{item.category}</span></td>
                      <td className="p-5 text-slate-800">₹{item.price.toFixed(2)}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black ${item.stock < 20 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          {item.stock} Units
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2 transition-opacity">
                          <button onClick={() => handleOpenDetails(item)} className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleEditDetails(item)} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- PAGINATION FOOTER --- */}
            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={activePage === 1}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${activePage === i + 1
                        ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-100'
                        : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={activePage === totalPages || totalPages === 0}
                  className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" && selectedProduct ? (
        /* ================= DETAILS VIEW ================= */
        <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold group">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Back to List
            </button>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="w-40 h-40 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-7xl border border-slate-100">
                {selectedProduct.img}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{selectedProduct.name}</h1>
                <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-6">{selectedProduct.brand}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p><p className="text-xl font-black text-slate-800">₹{selectedProduct.price}</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</p><p className="text-xl font-black text-slate-800">{selectedProduct.stock} Units</p></div>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-slate-600 font-medium leading-relaxed italic">"{selectedProduct.details}"</p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ADD / EDIT FORM ================= */
        <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold group">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all"><ArrowLeft size={20} /></div>
              Go Back
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formData.id ? "Edit Product" : "New Entry"}</h1>
            </div>
          </div>

          <ProductForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleAddProduct}
            onCancel={() => setView("list")}
          />
        </div>
      )}
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