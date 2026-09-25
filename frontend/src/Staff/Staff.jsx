import React from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Navbar from './layout/main/Navbar.jsx';
import PortalLayout from '../layout/PortalLayout.jsx';

function StaffDashboard() {
  return <PortalLayout Sidebar={Sidebar} Navbar={Navbar} />;
}

export default StaffDashboard;