import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar.jsx';
import Navbar from '../layout/main/Navbar.jsx';
import { Outlet } from 'react-router';

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Pass state and setter to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1">
        {/* Pass state to Navbar */}
        <Navbar isCollapsed={isCollapsed} />
        
        {/* Main Content Area */}
        <main className={`pt-20 transition-all duration-300 m-0 ${isCollapsed ? 'ml-24' : 'ml-64'}`}>
           <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;