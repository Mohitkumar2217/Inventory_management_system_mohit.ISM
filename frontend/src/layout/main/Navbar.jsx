import React from 'react';
import { FaSearch, FaRegEnvelope, FaBarcode } from 'react-icons/fa'; 
import { HiOutlineBell, HiOutlineOfficeBuilding } from 'react-icons/hi'; 
import { FiPlus, FiChevronDown } from 'react-icons/fi';

export default function Navbar({ isCollapsed }) {
  return (
    <nav 
      className={`fixed top-0 right-0 h-20 bg-[#1a1c23] text-white z-40 transition-all duration-300 flex items-center border-b border-gray-800
      ${isCollapsed ? 'left-20' : 'left-64'}`} 
    >
      <div className="w-full px-6 flex items-center justify-between">

        {/* LEFT: Location & Search Group */}
        <div className="flex items-center gap-6 flex-1">
          
          {/* Firm Scalability: Branch/Warehouse Selector */}
          <div className="hidden xl:flex items-center gap-2 bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all">
            <HiOutlineOfficeBuilding className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 leading-none">Main Warehouse</span>
              <span className="text-xs font-semibold">Jaipur Branch</span>
            </div>
            <FiChevronDown className="text-gray-500 ml-1" />
          </div>

          {/* Search Section - Enhanced with Scanner Toggle */}
          <div className="flex items-center bg-[#24262d] border border-gray-700 rounded-xl px-4 py-2.5 w-full max-w-md transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search products, SKU or suppliers..."
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
            {/* Visual Indicator for Barcode Scanning Capability */}
            <div className="flex items-center gap-2 border-l border-gray-700 ml-2 pl-3 group cursor-pointer">
              <FaBarcode className="text-gray-500 group-hover:text-blue-400" title="Scan Barcode" />
              <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-400 hidden sm:block">F1</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Action Center */}
        <div className="flex items-center gap-3">
          
          {/* Multi-Action Button Group */}
          <div className="flex items-center bg-[#24262d] rounded-xl border border-gray-700 p-1 mr-2">
             <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all text-xs font-bold shadow-lg shadow-blue-900/20">
              <FiPlus />
              <span>STOCK IN</span>
            </button>
            <button className="px-3 text-gray-400 hover:text-white text-xs font-medium">
              Report
            </button>
          </div>

          {/* Messages */}
          <button className="p-2.5 bg-gray-800/30 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
            <FaRegEnvelope size={18} />
          </button>

          {/* Notifications with Pulse Effect */}
          <button className="relative p-2.5 bg-gray-800/30 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
            <HiOutlineBell size={20} />
            <span className="absolute top-2 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-gray-700 mx-2"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-200">Mohit Kumar</span>
              <span className="text-[10px] text-green-400 font-medium bg-green-400/10 px-1.5 rounded">Admin</span>
            </div>
            <img
              src="https://i.pravatar.cc/40?img=11"
              alt="Profile"
              className="w-10 h-10 rounded-xl border-2 border-gray-700 group-hover:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}