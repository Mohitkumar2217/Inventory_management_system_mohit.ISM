import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaHome, FaBox, FaBoxOpen, FaTags, FaUsers,
    FaChartBar, FaShoppingCart,
    FaTruck, FaCog, FaBars, FaSignOutAlt
} from 'react-icons/fa';
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // Manage which dropdowns are open
    const [openMenus, setOpenMenus] = useState({});
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuItems = [
        { name: 'Dashboard', link: '/warehouse/dashboard', icon: <FaHome />, hasSub: false },
        {
            name: 'Inventory',
            icon: <FaBoxOpen />,
            hasSub: true,
            subItems: [
                { name: 'Products', link: '/warehouse/products', icon: <FaBox /> },
                { name: 'Orders List', link: '/warehouse/orders', icon: <FaShoppingCart /> },
                { name: 'Out Of Stock', link: '/warehouse/stocks', icon: <FaShoppingCart /> },
                { name: 'Damage', link: '/warehouse/damages', icon: <FaShoppingCart /> },
            ]
        },
        {
            name: 'Suppliers',
            icon: <FaTruck />,
            hasSub: true,
            subItems: [
                { name: 'Active on Order', link: '/warehouse/suppliers', icon: <FaTruck /> },
                { name: 'Offline Suppliers', link: '/warehouse/offline-suppliers', icon: <FaTruck /> },
                { name: 'Remote Suppliers', link: '/warehouse/remote-suppliers', icon: <FaTruck /> },
            ]
        },
        {
            name: 'Management',
            icon: <FaUsers />,
            hasSub: true,
            subItems: [
                { name: 'Stock Managers', link: '/warehouse/stock-manager', icon: <FaUsers /> },
                { name: 'Labour Managers', link: '/warehouse/labour-manager', icon: <FaUsers /> },
                { name: 'Staff List', link: '/warehouse/staff', icon: <FaUsers /> },
            ]
        },
        { name: 'Categories', link: '/warehouse/categories', icon: <FaTags />, hasSub: false },
        { name: 'Reports', link: '/warehouse/reports', icon: <FaChartBar />, hasSub: false },
        { name: 'Settings', link: '/warehouse/settings', icon: <FaCog />, hasSub: false },
    ];

    // Check if any sub-item of a menu is active
    const isChildActive = (subItems) => subItems?.some(sub => location.pathname === sub.link);

    // Auto-open menus if a child is active on page load
    useEffect(() => {
        const initialOpenState = {};
        menuItems.forEach(item => {
            if (item.hasSub && isChildActive(item.subItems)) {
                initialOpenState[item.name] = true;
            }
        });
        setOpenMenus(initialOpenState);
    }, []);

    const toggleMenu = (name) => {
        if (isCollapsed) setIsCollapsed(false);
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 bg-[#1a1c23] border-r border-gray-800 text-gray-400 flex flex-col z-[60] overflow-hidden ${isCollapsed ? 'w-20' : 'w-64'}`}>

                {/* HEADER SECTION */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800/50 min-h-[80px] shrink-0">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 ml-2 animate-in fade-in duration-500">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FaBoxOpen className="text-white text-xs" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">Inventory<span className="text-blue-500">MS</span></span>
                        </div>
                    )}
                    <button onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2.5 hover:bg-gray-800 rounded-xl mx-auto text-gray-500 hover:text-white transition-all outline-none">
                        <FaBars size={18} />
                    </button>
                </div>

                {/* NAVIGATION SECTION */}
                <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden no-scrollbar min-h-0">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const activeChild = isChildActive(item.subItems);
                            const isOpen = openMenus[item.name];

                            return (
                                <li key={item.name} className="relative group">
                                    {item.hasSub ? (
                                        <div className="flex flex-col">
                                            <button onClick={() => toggleMenu(item.name)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full group outline-none ${isOpen || activeChild ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800/50 hover:text-white'}`}>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-lg transition-colors ${isOpen || activeChild ? 'text-white' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                                                    {!isCollapsed && <span className="font-semibold text-sm whitespace-nowrap">{item.name}</span>}
                                                </div>
                                                {!isCollapsed && (isOpen ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />)}
                                            </button>

                                            {!isCollapsed && isOpen && (
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

                {/* FOOTER SECTION */}
                <div className="p-4 mt-auto border-t border-gray-800/50 shrink-0 bg-[#1a1c23]">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-400/10 transition-all group mb-4 outline-none ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <FaSignOutAlt size={18} className="shrink-0" />
                        {!isCollapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">Logout System</span>}
                    </button>

                    {!isCollapsed && (
                        <div className="bg-gray-800/20 rounded-2xl p-4 border border-gray-800/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">v2.4.0 Secure</span>
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
                            <button onClick={handleLogout} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-900/20">
                                Confirm Logout
                            </button>
                            <button onClick={() => setShowLogoutModal(false)} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
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