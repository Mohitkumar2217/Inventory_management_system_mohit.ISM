import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    FaHome, FaBox, FaBoxOpen, FaTags, FaUsers,
    FaWarehouse, FaChartBar, FaShoppingCart,
    FaTruck, FaCog, FaBars, FaSignOutAlt
} from 'react-icons/fa';
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); //
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuItems = [
        { name: 'Dashboard', link: '/staff/dashboard', icon: <FaHome />, hasSub: false }, 
        { name: 'Staff', link: '/staff/my-account', icon: <FaUsers />, hasSub: false }, 
        { name: 'Reports', link: '/staff/reports', icon: <FaChartBar />, hasSub: false },
        { name: 'Settings', link: '/staff/settings', icon: <FaCog />, hasSub: false },
    ];

    const handleLogout = () => {
        logout(); //
        navigate('/login'); //
    };

    const isChildActive = (subItems) => subItems?.some(sub => location.pathname === sub.link);

    return (
        <>
            <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 bg-[#1a1c23] border-r border-gray-800 text-gray-400 flex flex-col z-50 overflow-hidden ${isCollapsed ? 'w-20' : 'w-64'}`}>

                {/* HEADER SECTION (Fixed) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800/50 min-h-[80px] shrink-0">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 ml-2 animate-in fade-in duration-500">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FaBoxOpen className="text-white text-xs" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">Inventory<span className="text-blue-500">MS</span></span>
                        </div>
                    )}
                    <button onClick={() => { setIsCollapsed(!isCollapsed); setIsInventoryOpen(false); }}
                        className="p-2.5 hover:bg-gray-800 rounded-xl mx-auto text-gray-500 hover:text-white transition-all outline-none">
                        <FaBars size={18} />
                    </button>
                </div>

                {/* NAVIGATION SECTION (Scrollable only if items overflow) */}
                <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden no-scrollbar min-h-0">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const activeChild = isChildActive(item.subItems);
                            const isActiveParent = location.pathname === item.link;

                            return (
                                <li key={item.name} className="relative group">
                                    {item.hasSub ? (
                                        <div className="flex flex-col">
                                            <button onClick={() => { if (isCollapsed) setIsCollapsed(false); setIsInventoryOpen(!isInventoryOpen); }}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full group outline-none ${isInventoryOpen || activeChild ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800/50 hover:text-white'}`}>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-lg transition-colors ${isInventoryOpen || activeChild ? 'text-white' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                                                    {!isCollapsed && <span className="font-semibold text-sm whitespace-nowrap">{item.name}</span>}
                                                </div>
                                                {!isCollapsed && (isInventoryOpen ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />)}
                                            </button>

                                            {!isCollapsed && isInventoryOpen && (
                                                <ul className="mt-2 ml-6 space-y-1 border-l border-gray-800 pl-4 animate-in slide-in-from-top-2 duration-300">
                                                    {item.subItems.map((sub) => (
                                                        <li key={sub.name}>
                                                            <NavLink to={sub.link} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'text-blue-400 bg-blue-400/5' : 'text-gray-500 hover:text-gray-200'}`}>
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
                                            {!isCollapsed && <span className="font-semibold text-sm whitespace-nowrap">{item.name}</span>}

                                            {/* Tooltip for Collapsed State */}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] border border-gray-800 shadow-xl">
                                                    {item.name}
                                                </div>
                                            )}
                                        </NavLink>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* FOOTER SECTION (Pinned & No Overflow) */}
                <div className="p-4 mt-auto border-t border-gray-800/50 shrink-0 overflow-hidden bg-[#1a1c23]">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-400/10 transition-all group mb-4 outline-none ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <FaSignOutAlt size={18} className="shrink-0" />
                        {!isCollapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">Logout System</span>}
                    </button>

                    {!isCollapsed && (
                        <div className="bg-gray-800/20 rounded-2xl p-4 border border-gray-800/50 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">v2.4.0 Secure</span>
                            </div>
                            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-tighter leading-relaxed">
                                Authorized Access Only <br />
                                Internal Firm Network
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#1a1c23] border border-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <FaSignOutAlt size={28} />
                        </div>

                        <h3 className="text-xl font-black text-white text-center tracking-tight mb-2">Terminate Session?</h3>
                        <p className="text-gray-400 text-sm text-center font-medium leading-relaxed mb-8 px-2">
                            Are you sure you want to logout? You will need to re-authenticate to access the management portal.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-900/20"
                            >
                                Confirm Logout
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;