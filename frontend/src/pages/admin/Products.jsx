import React, { useState, useRef, useEffect } from "react";
import ProductSummaryCard from "../../components/Summerys/ProductSummaryCard.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, Package, IndianRupee, X, ChevronLeft, ChevronRight,
  Layers
} from "lucide-react";
import ProductForm from "../../components/Forms/ProductForm.jsx"; 

export default function Products({ searchQuery }) {
  
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
  const [localSearch, setLocalSearch] = useState(""); // local table search
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
  
  // AUTO-RESET PAGINATION ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, activeFilters]);
  
  const handleOpenDetails = (product) => { setView("view-details"); setFormData(product); };
  const handleEditDetails = (product) => { setFormData({ ...product }); setView("edit"); };
  const handleDeleteProduct = (id) => {
    if (!window.confirm("Remove this product?")) return;
    setProducts(products.filter(p => p.id !== id));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/products",
        { email, password }
      );

      if (response.data.success) {
        const { token, user } = response.data;
        await login(token, user);

        // Comprehensive Role-Based Redirection
        const roleRedirects = {
          admin: "/admin/dashboard",
          client: "/client/dashboard",
          staff: "/staff/dashboard",
          manager: "/manager/dashboard",
          supplier: "/supplier/dashboard",
          warehouse: "/warehouse/dashboard",
          accountant: "/accountant/dashboard",
        };

        const redirectPath = roleRedirects[user.role] || "/login";
        navigate(redirectPath);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Internal server error. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
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

  // --- FILTER & SEARCH LOGIC ---
  const filteredProducts = products.filter((p) => {
    // Combine Global Search Query and Local Table Search
    const finalSearch = (searchQuery || localSearch).toLowerCase();
    
    const matchesSearch = 
        p.name.toLowerCase().includes(finalSearch) || 
        p.code.toLowerCase().includes(finalSearch) ||
        p.brand.toLowerCase().includes(finalSearch);

    const matchesCategory = activeFilters.category === "All" || p.category === activeFilters.category;
    const matchesStock = activeFilters.stockStatus === "All" || (activeFilters.stockStatus === "Low Stock" ? p.stock < 20 : p.stock >= 20);
    
    let matchesPrice = true;
    if (activeFilters.priceRange === "Under ₹500") matchesPrice = p.price < 500;
    else if (activeFilters.priceRange === "₹500 - ₹2000") matchesPrice = p.price >= 500 && p.price <= 2000;
    else if (activeFilters.priceRange === "Above ₹2000") matchesPrice = p.price > 2000;
    
    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  });

  // --- SUMMARY MAPPING ---
  const itemsSummary = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalOrders: products.filter(p => p.stock < 20).length,
    totalCancelled: new Set(products.map(p => p.category)).size,
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const categoriesList = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in duration-500">
          <ProductSummaryCard items={itemsSummary} nameSum="Inventory" />

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Products Inventory</h1>
              <p className="text-slate-500 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                <Layers size={14} className="text-indigo-500" /> {filteredProducts.length} Match Found
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-visible">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-3">Show</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={products.length}>All</option>
                </select>
              </div>

              <div className="flex flex-1 gap-3 w-full md:max-w-2xl justify-end">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search inside results..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all placeholder:text-slate-300" 
                    value={localSearch} 
                    onChange={(e) => setLocalSearch(e.target.value)} 
                  />
                </div>

                <div className="relative" ref={filterRef}>
                  <button onClick={() => setShowFilterPopup(!showFilterPopup)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${showFilterPopup ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                    <Filter size={16} /> Filter
                  </button>
                  {showFilterPopup && (
                    <div className="absolute right-0 top-14 z-[100] w-72 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 animate-in zoom-in-95 duration-200">
                      <div className="grid gap-5">
                        <FilterSelect label="Category" value={activeFilters.category} options={categoriesList} onChange={(v) => setActiveFilters({ ...activeFilters, category: v })} />
                        <FilterSelect label="Stock Status" value={activeFilters.stockStatus} options={["All", "In Stock", "Low Stock"]} onChange={(v) => setActiveFilters({ ...activeFilters, stockStatus: v })} />
                        <FilterSelect label="Price Range" value={activeFilters.priceRange} options={["All", "Under ₹500", "₹500 - ₹2000", "Above ₹2000"]} onChange={(v) => setActiveFilters({ ...activeFilters, priceRange: v })} />
                        <button onClick={() => setActiveFilters({ category: "All", stockStatus: "All", priceRange: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-95">
                  <Plus size={18} /> Product
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                    <th className="p-6">Product Item</th>
                    <th className="p-6">ID Code</th>
                    <th className="p-6">Department</th>
                    <th className="p-6">Retail Price</th>
                    <th className="p-6">Stock Status</th>
                    <th className="p-6 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100">{item.img}</div>
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">{item.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.brand}</span>
                        </div>
                      </td>
                      <td className="p-6 text-slate-500 font-mono text-xs">{item.code}</td>
                      <td className="p-6"><span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase text-[9px] font-black shadow-sm">{item.category}</span></td>
                      <td className="p-6 text-slate-800 font-black flex items-center gap-1 mt-3"><IndianRupee size={12} />{item.price.toFixed(2)}</td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${item.stock < 20 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.stock < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {item.stock} Units
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2 transition-all">
                          <ActionBtn onClick={() => handleOpenDetails(item)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(item)} icon={<Edit2 size={14} />} color="bg-slate-50 text-slate-500 hover:bg-slate-800" />
                          <ActionBtn onClick={() => handleDeleteProduct(item.id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs italic">
                  No matching products found.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} / {filteredProducts.length} entries
              </p>
              <div className="flex items-center gap-2">
                <NavBtn onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} icon={<ChevronLeft size={18} />} />
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-cyan-400 text-white shadow-xl shadow-cyan-100' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <NavBtn onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} icon={<ChevronRight size={18} />} />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Back
          </button>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <div className="w-48 h-48 bg-slate-50 rounded-[3rem] flex items-center justify-center text-8xl shadow-inner border border-slate-100">{formData.img}</div>
              <div className="flex-1">
                <span className="text-cyan-500 font-black text-xs uppercase tracking-[0.3em] mb-2 block">{formData.brand}</span>
                <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-6">{formData.name}</h1>
                <div className="grid grid-cols-2 gap-8 max-w-sm">
                  <DetailBox label="Identifier" val={formData.code} />
                  <DetailBox label="Retail Price" val={`₹${formData.price}`} highlight />
                  <DetailBox label="Stock Level" val={`${formData.stock} Units`} />
                  <DetailBox label="Department" val={formData.category} />
                </div>
              </div>
            </div>
            <div className="mt-16 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
              <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Product Description</div>
              <p className="text-slate-600 font-bold leading-relaxed italic text-lg opacity-80">"{formData.details}"</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in duration-500">
          <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm"><ArrowLeft size={18} /></div> Cancel
          </button>
          <ProductForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleAddProduct} onCancel={() => setView("list")} />
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ActionBtn = ({ onClick, icon, color }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm ${color} hover:text-white hover:scale-110 active:scale-90`}>{icon}</button>
);

const NavBtn = ({ onClick, disabled, icon }) => (
  <button onClick={onClick} disabled={disabled} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95">{icon}</button>
);

const DetailBox = ({ label, val, highlight }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
    <p className={`text-xl font-black ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{val}</p>
  </div>
);