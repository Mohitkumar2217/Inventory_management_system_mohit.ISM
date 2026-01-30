import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Pages
import DashboardHome from "./pages/admin/DashboardHome.jsx";
import Categories from "./pages/admin/Categories.jsx";
import Products from "./pages/admin/Products.jsx";
import Suppliers from "./pages/admin/Suppliers.jsx";
import Staff from "./pages/admin/Staff.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Warehouse from "./pages/admin/Warehouse.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import WarehouseDashboard from "./Warehouse/Warehouse.jsx";
import StaffDashboard from "./Staff/Staff.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Helper component to redirect users from "/" to their specific portal
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin" || user.role === "manager") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "warehouse") return <Navigate to="/warehouse-portal" replace />;
  if (user.role === "staff") return <Navigate to="/staff-portal" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Root Redirector */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin & Manager Routes */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute requireRole={["admin", "manager"]}><Dashboard /></ProtectedRoute>}
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="orders" element={<Orders />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Warehouse Routes */}
        <Route 
          path="/warehouse-portal" 
          element={<ProtectedRoute requireRole={["warehouse"]}><WarehouseDashboard /></ProtectedRoute>}
        >
          {/* <Route index element={<WarehouseDashboard />} /> */}
          {/* Add warehouse sub-routes here if needed */}
        </Route>

        {/* Staff Routes */}
        <Route 
          path="/staff-portal" 
          element={<ProtectedRoute requireRole={["staff"]}><StaffDashboard /></ProtectedRoute>}
        >
          {/* <Route index element={<StaffDashboard />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;