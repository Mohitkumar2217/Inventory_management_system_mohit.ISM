import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRegEnvelope } from 'react-icons/fa';
import { HiOutlineBell, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx'; // Import your Auth Context

export default function Navbar({ isCollapsed, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Destructure user from context
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState({
    name: "Jaipur Branch",
    label: "Main Warehouse",
    id: 1
  });

  const dropdownRef = useRef(null);

  // ... (Keep warehouses and pageSignatures constant as they were)
  const warehouses = [
    { id: 1, name: "Jaipur Branch", label: "Main Warehouse", capacity: "85%" },
    { id: 2, name: "Delhi Hub", label: "Logistics Center", capacity: "40%" },
    { id: 3, name: "Mumbai Port", label: "Import Unit", capacity: "12%" },
  ];

  const pageSignatures = [ 
    { route: "/dashboard", keys: ["dash", "home", "main", "overview"] },
    { route: "/my-account", keys: ["staff", "employee", "team", "member", "admin", "manager", "worker", "role", "email", "security"] },  
    { route: "/reports", keys: ["report", "analytics", "chart", "forecast", "revenue", "data", "roi", "velocity"] },
    { route: "/settings", keys: ["settings", "config", "profile", "password", "setup", "business"] },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      const input = searchQuery.toLowerCase().trim();
      const inputWords = input.split(/\s+/);

      let targetRoute = null;
      for (const page of pageSignatures) {
        const isMatch = inputWords.some(word =>
          page.keys.some(key => key.includes(word) || word.includes(key))
        );
        if (isMatch) {
          targetRoute = page.route;
          break;
        }
      }

      if (targetRoute) {
        navigate(targetRoute);
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

        {/* LEFT: Location & Search (No Changes) */}
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

          <div className="flex items-center bg-[#24262d] border border-gray-700 rounded-xl px-4 py-2.5 w-full max-w-md transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 relative">
            <FaSearch className="text-gray-500 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search (e.g. 'Orders', 'Stock')..."
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="ml-2 text-gray-500 hover:text-white transition-colors">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Action Center & Updated User Profile */}
        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-gray-800/30 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all relative">
            <FaRegEnvelope size={18} />
          </button>

          <button className="relative p-2.5 bg-gray-800/30 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
            <HiOutlineBell size={20} />
            <span className="absolute top-2 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          <div className="h-8 w-[1px] bg-gray-700 mx-1"></div>

          {/* DYNAMIC USER PROFILE */}
          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="hidden md:flex flex-col items-end">
              {/* Display user name or fallback to Guest */}
              <span className="text-sm font-semibold text-gray-200">
                {user ? user.name : "Guest User"}
              </span>
              {/* Display user role with dynamic styling */}
              <span className="text-[10px] text-green-400 font-medium bg-green-400/10 px-1.5 rounded uppercase tracking-wider">
                {user ? user.role : "No Role"}
              </span>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=2563eb&color=fff`}
              alt="Profile"
              className="w-10 h-10 rounded-xl border-2 border-gray-700 group-hover:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}