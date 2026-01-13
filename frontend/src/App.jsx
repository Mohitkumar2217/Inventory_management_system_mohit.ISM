import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";  

// Inside your <Routes>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Protected Root: Every route below this point requires a valid session */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireRole={["admin", "manager", "staff", "supplier", "warehouse", "accountant"]}>
              {/* <CustomForm /> */}
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* 1. If you want to use your Root redirect logic: */}
          {/* <Route index element={<Root />} /> */}

          {/* OR 2. If you want to directly show DashboardHome at the / path: */}
          <Route index element={<DashboardHome />} />

          <Route path="admin">
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;