import React, { useState } from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Navbar from './layout/main/Navbar.jsx';
import { Outlet } from 'react-router';

function StaffDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    // min-h-screen and bg-slate-50 ensures a consistent professional backdrop
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      
      {/* SIDEBAR: Pass collapse state to handle width and logo visibility */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* CONTENT WRAPPER: Handles the dynamic width of the dashboard */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR: Pass searchQuery for the smart navigation logic we built */}
        <Navbar 
          isCollapsed={isCollapsed} 
          searchQuery={globalSearch} 
          setSearchQuery={setGlobalSearch} 
        />
        
        
        <main 
          className={`
            flex-1 pt-20 p-6 transition-all duration-300 ease-in-out
            ${isCollapsed ? 'ml-20' : 'ml-64'}
          `}
        >
           
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet context={{ searchQuery: globalSearch }} />
          </div>
        </main>

      </div>
    </div>
  );
}

export default StaffDashboard;