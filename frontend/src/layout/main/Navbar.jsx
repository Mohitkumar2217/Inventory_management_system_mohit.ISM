import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { FaSearch, FaRegEnvelope } from 'react-icons/fa'; 
import { HiOutlineBell, HiOutlineOfficeBuilding } from 'react-icons/hi'; 
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';

export default function Navbar({ isCollapsed, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState({
    name: "Jaipur Branch",
    label: "Main Warehouse",
    id: 1
  });

  const dropdownRef = useRef(null);

  const warehouses = [
    { id: 1, name: "Jaipur Branch", label: "Main Warehouse", capacity: "85%" },
    { id: 2, name: "Delhi Hub", label: "Logistics Center", capacity: "40%" },
    { id: 3, name: "Mumbai Port", label: "Import Unit", capacity: "12%" },
  ];

  // --- SMART NAVIGATION MAP ---
  // Maps every single important word to its respective route
  const pageSignatures = [
    { route: "/products", keys: ["product", "item", "inventory", "stock", "sku", "brand", "electronics", "beauty", "food", "lakme", "sony", "apple", "nike", "cream", "serum", "watch"] },
    { route: "/orders", keys: ["order", "purchase", "bill", "invoice", "price", "pending", "completed", "cancelled", "gst", "vendor", "valuation"] },
    { route: "/staff", keys: ["staff", "employee", "team", "member", "admin", "manager", "worker", "role", "email", "security"] },
    { route: "/warehouse", keys: ["warehouse", "zone", "location", "storage", "pallet", "bay", "ledger", "out of stock"] },
    { route: "/suppliers", keys: ["supplier", "dealer", "distributor", "network", "partner", "verified"] },
    { route: "/categories", keys: ["category", "dept", "group", "class", "department", "tax", "slug"] },
    { route: "/reports", keys: ["report", "analytics", "chart", "forecast", "revenue", "data", "roi", "velocity"] },
    { route: "/settings", keys: ["settings", "config", "profile", "password", "setup", "business"] },
    { route: "/dashboard", keys: ["dash", "home", "main", "overview"] }
  ];

  // --- HANDLE ENTER KEY ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      const input = searchQuery.toLowerCase().trim();
      const inputWords = input.split(/\s+/); // Split sentence into words

      let targetRoute = null;

      // Scan every word against every page signature
      for (const page of pageSignatures) {
        const isMatch = inputWords.some(word => 
          page.keys.some(key => key.includes(word) || word.includes(key))
        );
        
        if (isMatch) {
          targetRoute = page.route;
          break; // Take the first best match
        }
      }

      if (targetRoute) {
        navigate(targetRoute);
      } else {
        console.log("No specific page match, filtering current page for:", input);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 right-0 h-20 bg-[#1a1c23] text-white z-40 transition-all duration-300 flex items-center border-b border-gray-800 ${isCollapsed ? 'left-20' : 'left-64'}`}>
      <div className="w-full px-6 flex items-center justify-between">

        {/* LEFT: Location & Search */}
        <div className="flex items-center gap-6 flex-1">
          <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className={`hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${isOpen ? 'bg-gray-700 border-blue-500' : 'bg-gray-800/40 border-gray-700 hover:bg-gray-700'}`}>
              <HiOutlineOfficeBuilding className={isOpen ? "text-blue-400" : "text-blue-500"} />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 leading-none">{selectedWarehouse.label}</span>
                <span className="text-xs font-semibold">{selectedWarehouse.name}</span>
              </div>
              <FiChevronDown className={`text-gray-500 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#24262d] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                {warehouses.map((wh) => (
                  <div key={wh.id} onClick={() => { setSelectedWarehouse(wh); setIsOpen(false); }} className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer transition-colors group">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{wh.name}</span>
                      <span className="text-[10px] text-gray-500">{wh.label}</span>
                    </div>
                    {selectedWarehouse.id === wh.id && <FiCheck className="text-blue-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEARCH BAR WITH ENTER TRIGGER */}
          <div className="flex items-center bg-[#24262d] border border-gray-700 rounded-xl px-4 py-2.5 w-full max-w-md transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 relative">
            <FaSearch className="text-gray-500 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} 
              placeholder="Search word (e.g. 'Pending', 'Zone', 'Sony')..."
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="ml-2 text-gray-500 hover:text-white transition-colors">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-200">Mohit Kumar</span>
              <span className="text-[10px] text-green-400 font-medium bg-green-400/10 px-1.5 rounded uppercase">Admin</span>
            </div>
            <img src="https://i.pravatar.cc/40?img=11" alt="Profile" className="w-10 h-10 rounded-xl border-2 border-gray-700 group-hover:border-blue-500 transition-all" />
          </div>
        </div>
      </div>
    </nav>
  );
}