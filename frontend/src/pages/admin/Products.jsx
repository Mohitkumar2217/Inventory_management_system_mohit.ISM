import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ProductSummaryCard from "../../components/Summerys/ProductSummaryCard.jsx";
import ProductForm from "../../components/Forms/ProductForm.jsx";
import VisualBarCode from "../../components/Lists/VisualBarCode.jsx";

import {
  Eye, Edit2, Trash2, Plus, Search, Filter,
  ArrowLeft, IndianRupee, ChevronLeft, ChevronRight,
  Layers, Loader2, Truck, Activity, Hash, MapPin, Calendar, Percent, Tag, Box
} from "lucide-react";

export default function Products({ searchQuery = "" }) {
  const { token } = useAuth();

  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [liveNotices, setLiveNotices] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["All"]);
  const [warehousesList, setWarehousesList] = useState(["All"]);
  const [zonesList, setZonesList] = useState(["All"]);
  const [suppliersList, setSuppliersList] = useState(["All"]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: "All", stockStatus: "All", priceRange: "All" });
  const filterRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carousel State for Detail View
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Schema-aligned initial state
  const initialFormState = {
    _id: null, name: "", code: "", category: "", price: "", cost: "",
    stock: "", brand: "", details: "", sku: "", supplier: "", minStock: 20,
    weight: "", dimensions: "", color: "", images: [], // Array for multiple images
    warehouse: "", barcode: "", unit: "pcs", taxPercentage: 18,
    status: "Active", condition: "New", expiryDate: "", totalSold: 0,
    variants: []
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- API CONFIGURATION ---
  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      if (res.data.success) {
        setProducts(res.data.products || []);
        setSummaryData(res.data.summary || {});
        setCategoriesList(["All", ...(res.data.availableCategories || [])]);
        setWarehousesList(["All", ...(res.data.availableWarehouses || [])]);
        setZonesList(["All", ...(res.data.availableZones || [])]);
        setSuppliersList(["All", ...(res.data.availableSuppliers || [])]);
        setLiveNotices(res.data.notices || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, localSearch, activeFilters]);

  // --- IMAGE NAVIGATION HANDLERS ---
  const handleNextImg = () => {
    if (formData.images?.length > 0) {
      setCurrentImgIndex((prev) => (prev + 1) % formData.images.length);
    }
  };

  const handlePrevImg = () => {
    if (formData.images?.length > 0) {
      setCurrentImgIndex((prev) => (prev - 1 + formData.images.length) % formData.images.length);
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDetails = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData(product);
    setCurrentImgIndex(0); // Reset carousel
    setView("view-details");
  };

  const handleEditDetails = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData({ ...product });
    setView("add");
  };


  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = formData._id
        ? await api.put(`/products/${formData._id}`, formData)
        : await api.post("/products", formData);

      if (res.data.success) {
        alert(res.data.message);
        await fetchInventory();
        setView("list");
        setFormData(initialFormState);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Sync failed. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from live inventory?")) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        fetchInventory();
        if (view === "view-details") setView("list");
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  const filteredProducts = (products || []).filter((p) => {
    const finalSearch = (searchQuery || localSearch || "").toLowerCase();
    const matchesSearch =
      (p.name || "").toLowerCase().includes(finalSearch) ||
      (p.code || "").toLowerCase().includes(finalSearch) ||
      (p.brand || "").toLowerCase().includes(finalSearch);

    const matchesCategory = activeFilters.category === "All" || p.category === activeFilters.category;
    const matchesStock = activeFilters.stockStatus === "All" ||
      (activeFilters.stockStatus === "Low Stock" ? p.stock < (p.minStock || 20) : p.stock >= (p.minStock || 20));

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const activePage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden">
      {view === "list" ? (
        <div className="max-w-7xl mx-auto p-2 md:p-4 animate-in fade-in slide-in-from-left-6 duration-500 ease-out">
          <ProductSummaryCard items={summaryData} nameSum="Inventory" notices={liveNotices} />

          <div className="flex justify-between items-center mt-6">
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
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border-none rounded-xl px-4 py-1.5 text-xs font-black shadow-sm outline-none cursor-pointer">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
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
                        <button onClick={() => setActiveFilters({ category: "All", stockStatus: "All", priceRange: "All" })} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-rose-100">Reset Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-95 whitespace-nowrap">
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
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100 overflow-hidden">
                          {item.images?.length > 0 ? (
                            <img src={item.images[0]} className="w-full h-full object-cover" alt="thumb" />
                          ) : "📦"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">{item.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.brand}</span>
                        </div>
                      </td>
                      <td className="p-6 text-slate-500 font-mono text-xs">{item.code}</td>
                      <td className="p-6"><span className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase text-[9px] font-black shadow-sm">{item.category}</span></td>
                      <td className="p-6 text-slate-800 font-black flex items-center gap-1 mt-3"><IndianRupee size={12} />{Number(item.price).toFixed(2)}</td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${item.stock < (item.minStock || 20) ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.stock < (item.minStock || 20) ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {item.stock} {item.unit || 'Units'}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2 transition-all">
                          <ActionBtn onClick={() => handleOpenDetails(item)} icon={<Eye size={14} />} color="bg-cyan-50 text-cyan-500 hover:bg-cyan-500" />
                          <ActionBtn onClick={() => handleEditDetails(item)} icon={<Edit2 size={14} />} color="bg-slate-50 text-slate-500 hover:bg-slate-800" />
                          <ActionBtn onClick={() => handleDeleteProduct(item._id)} icon={<Trash2 size={14} />} color="bg-rose-50 text-rose-500 hover:bg-rose-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-[2.5rem] gap-4">
              {/* Left: Info Text */}
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Showing {currentItems.length} of {filteredProducts.length} items
              </p>

              {/* Middle: Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Arrow */}
                <NavBtn
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft size={18} />}
                />

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1
                        ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-100'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-cyan-500'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Next Arrow */}
                <NavBtn
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  icon={<ChevronRight size={18} />}
                />
              </div>
            </div>
          </div>
        </div>
      ) : view === "view-details" ? (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 ease-out pb-20 mt-10">
          <div className="flex items-center justify-between mb-8 px-4">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div> Back
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteProduct(formData._id)} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20} /></button>
              <button onClick={() => handleEditDetails(formData)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"><Edit2 size={16} /> Update Registry</button>
            </div>
          </div>

          <div className="bg-white p-8 md:p-14 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10 border-b border-slate-50 pb-12">

              {/* --- IMAGE SLIDER SECTION --- */}
              <div className="w-full lg:w-[450px] shrink-0">
                <div className="relative group aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center">
                  {formData.images && formData.images.length > 0 ? (
                    <>
                      <img
                        src={formData.images[currentImgIndex]}
                        alt="Product"
                        className="w-full h-full object-contain p-8 animate-in fade-in zoom-in-95 duration-300"
                      />
                      {formData.images.length > 1 && (
                        <>
                          <button onClick={handlePrevImg} className="absolute left-4 p-3 bg-white/80 backdrop-blur rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"><ChevronLeft size={24} /></button>
                          <button onClick={handleNextImg} className="absolute right-4 p-3 bg-white/80 backdrop-blur rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"><ChevronRight size={24} /></button>
                        </>
                      )}
                    </>
                  ) : (
                    <Box size={80} className="text-slate-200" />
                  )}
                </div>
                {/* Thumbnails */}
                <div className="flex justify-center gap-3 mt-6">
                  {formData.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden bg-white ${currentImgIndex === idx ? 'border-cyan-500 scale-110 shadow-lg' : 'border-slate-100 opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumb" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                  <span className="bg-cyan-50 text-cyan-600 font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{formData.brand}</span>
                  <span className="bg-slate-900 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">SKU: {formData.sku}</span>
                  <span className="bg-indigo-50 text-indigo-600 font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{formData.condition}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.stock <= formData.minStock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {formData.status}
                  </span>
                </div>
                <h1 className="text-7xl font-black text-slate-800 tracking-tighter mb-4">{formData.name}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DetailBox label="System Code" val={formData.code} />
                  <DetailBox label="Retail Price" val={`₹${formData.price}`} highlight />
                  <DetailBox label="Stock Level" val={`${formData.stock} ${formData.unit}`} alert={formData.stock <= formData.minStock} />
                  <DetailBox label="Total Sold" val={`${formData.totalSold || 0} Units`} />
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest"><MapPin size={14} className="text-indigo-500" /> Logistics</div>
                <div className="space-y-4">
                  <DetailItem label="Warehouse Location" value={formData.warehouse || "Not Assigned"} />
                  <div className="group border-b border-slate-50 pb-3">
                    <DetailItem
                      label="Barcode (EAN/UPC)"
                      value={formData.barcode || "No Barcode"}
                    />
                    <VisualBarCode value={formData.barcode} />
                  </div>
                  <DetailItem label="Physical Weight" value={formData.weight} />
                  <DetailItem label="Box Dimensions" value={formData.dimensions} />
                </div>
              </div>

              <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest"><IndianRupee size={14} className="text-emerald-500" /> Financials</div>
                <div className="space-y-4">
                  <DetailItem label="Unit Cost" value={`₹${formData.cost}`} />
                  <DetailItem label="Projected Margin" value={`₹${formData.margin || (formData.price - formData.cost)}`} />
                  <DetailItem label="Discounted Price" value={formData.discountPrice ? `₹${formData.discountPrice}` : "No Sale"} />
                  <DetailItem label="Taxation Rate" value={`${formData.taxPercentage}% Applied`} />
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6 text-slate-500 uppercase font-black text-[10px] tracking-widest"><Truck size={14} className="text-cyan-400" /> Procurement</div>
                  <div className="space-y-5">
                    <DetailItemDark label="Strategic Supplier" value={formData.supplier} />
                    <DetailItemDark label="Product Warranty" value={formData.warranty || "Standard 1-Year"} />
                    <DetailItemDark label="Category Dept" value={formData.category} />
                    <DetailItemDark label="Expiry Date" value={formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : "Non-Perishable"} />
                  </div>
                </div>
                <Hash className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />
              </div>
            </div>

            <div className="mt-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative">
              <div className="absolute -top-3 left-10 bg-indigo-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Logistical Directives</div>
              <p className="text-slate-600 font-bold leading-relaxed italic text-xl opacity-80">"{formData.details || 'No additional directives provided.'}"</p>
            </div>

            {/* --- VARIANTS DISPLAY --- */}
            {formData.variants && formData.variants.length > 0 && (
              <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase font-black text-[10px] tracking-widest">
                  <Layers size={14} className="text-indigo-500" /> Asset Variants ({formData.variants.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                          <Tag size={14} className="text-indigo-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase">SKU: {v.sku || 'N/A'}</span>
                      </div>
                      <h4 className="font-black text-slate-800 text-lg mb-1">{v.name}</h4>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                          <span className="text-sm font-black text-slate-900">₹{v.price || formData.price}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock</span>
                          <span className={`text-sm font-black ${v.stock < 5 ? 'text-rose-500' : 'text-emerald-600'}`}>{v.stock} {formData.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out mt-10">
          <div className="flex items-center justify-between mb-8 px-4">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all group">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform"><ArrowLeft size={18} /></div> Cancel
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">{formData._id ? "Update Product" : "New Registration"}</h1>
          </div>
          <div className="px-2 pb-20">
            <ProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleAddProduct}
              onCancel={() => setView("list")}
              categories={categoriesList.filter(c => c !== "All")}
              warehouses={warehousesList.filter(w => w !== "All")}
              zones={zonesList.filter(w => w !== "All")}
              suppliers={suppliersList.filter(w => w !== "All")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- SHARED UI COMPONENTS ---
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

function DetailItem({ label, value }) {
  return (
    <div className="group">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest transition-colors group-hover:text-cyan-500">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || "N/A"}</p>
    </div>
  );
}

function DetailItemDark({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white">{value || "N/A"}</p>
    </div>
  );
}

function DetailBox({ label, val, highlight = false, alert = false }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${alert ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tight ${highlight ? 'text-cyan-600' : alert ? 'text-rose-600' : 'text-slate-800'}`}>
        {val}
      </p>
    </div>
  );
}