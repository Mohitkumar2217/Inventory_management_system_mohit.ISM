import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar.jsx';
import Navbar from '../layout/main/Navbar.jsx';
import { Outlet } from 'react-router';

function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex m-0">
      {/* Pass state and setter to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1">
        {/* Pass state to Navbar */}
        <Navbar isCollapsed={isCollapsed} />
        
        {/* Main Content Area */}
        <main className={`pt-20 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
           <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;