import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function PortalLayout(props) {
  const PortalSidebar = props.Sidebar;
  const PortalNavbar = props.Navbar;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      <PortalSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalNavbar
          isCollapsed={isCollapsed}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
        />
        <main className={`flex-1 pt-20 p-6 transition-all duration-300 ease-in-out ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet context={{ searchQuery: globalSearch }} />
          </div>
        </main>
      </div>
    </div>
  );
}