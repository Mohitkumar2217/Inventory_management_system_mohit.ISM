import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FaHome, FaBox, FaBoxOpen, FaTags, FaUsers,
    FaWarehouse, FaChartBar, FaShoppingCart,
    FaTruck, FaCog, FaBars
} from 'react-icons/fa';
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', link: '/dashboard', icon: <FaHome />, hasSub: false },
        {
            name: 'Inventory',
            icon: <FaBoxOpen />,
            hasSub: true,
            subItems: [
                { name: 'Products', link: '/products', icon: <FaBox /> },
                { name: 'Orders List', link: '/orders', icon: <FaShoppingCart /> },
            ]
        },
        { name: 'Suppliers', link: '/suppliers', icon: <FaTruck />, hasSub: false },
        { name: 'Staff', link: '/staff', icon: <FaUsers />, hasSub: false },
        { name: 'Warehouse', link: '/warehouse', icon: <FaWarehouse />, hasSub: false },
        { name: 'Categories', link: '/categories', icon: <FaTags />, hasSub: false },
        { name: 'Reports', link: '/reports', icon: <FaChartBar />, hasSub: false },
        { name: 'Settings', link: '/settings', icon: <FaCog />, hasSub: false },
    ];

    const isChildActive = (subItems) => subItems?.some(sub => location.pathname === sub.link);

    return (
        /* Updated background to #1a1c23 to match Navbar precisely */
        <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 bg-[#1a1c23] border-r border-gray-800 text-gray-400 flex flex-col z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>

            {/* Header Section matching Navbar height and border style */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50 min-h-[80px]">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 ml-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FaBoxOpen className="text-white text-xs" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Inventory<span className="text-blue-500">MS</span></span>
                    </div>
                )}
                <button onClick={() => { setIsCollapsed(!isCollapsed); setIsInventoryOpen(false); }}
                    className="p-2.5 hover:bg-gray-800 rounded-xl mx-auto text-gray-500 hover:text-white transition-all">
                    <FaBars size={18} />
                </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const activeChild = isChildActive(item.subItems);
                        const isActiveParent = location.pathname === item.link;

                        return (
                            <li key={item.name}>
                                {item.hasSub ? (
                                    <div className="flex flex-col">
                                        <button onClick={() => { if (isCollapsed) setIsCollapsed(false); setIsInventoryOpen(!isInventoryOpen); }}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full group ${isInventoryOpen || activeChild ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800/50 hover:text-white'}`}>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-lg transition-colors ${isInventoryOpen || activeChild ? 'text-white' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                                                {!isCollapsed && <span className="font-semibold text-sm">{item.name}</span>}
                                            </div>
                                            {!isCollapsed && (isInventoryOpen ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />)}
                                        </button>

                                        {!isCollapsed && isInventoryOpen && (
                                            <ul className="mt-2 ml-6 space-y-1 border-l border-gray-800 pl-4 transition-all">
                                                {item.subItems.map((sub) => (
                                                    <li key={sub.name}>
                                                        <NavLink to={sub.link} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-200'}`}>
                                                            {sub.name}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink to={item.link} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800/50 hover:text-white'}`}>
                                        <span className={`text-lg transition-colors ${location.pathname === item.link ? 'text-white' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                                        {!isCollapsed && <span className="font-semibold text-sm">{item.name}</span>}
                                    </NavLink>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Scalable Footer Section */}
            {!isCollapsed && (
                <div className="p-6 border-t border-gray-800/50">
                    <div className="bg-gray-800/30 rounded-2xl p-3 flex items-center gap-3 border border-gray-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Online</span>
                    </div>
                    <p className="mt-4 text-[9px] font-medium text-gray-600 text-center uppercase tracking-widest leading-relaxed">
                        Firm Edition v2.0 <br /> © 2025 IMS
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;