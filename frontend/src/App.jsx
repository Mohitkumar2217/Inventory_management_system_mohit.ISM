import { BrowserRouter as Router, Routes, Route } from "react-router";
import DashboardHome from "./pages/admin/DashboardHome.jsx";
import Categories from "./pages/admin/Categories.jsx";
import Products from "./pages/admin/Products.jsx";
import Suppliers from "./pages/admin/Suppliers.jsx";
import Staff from "./pages/admin/Staff.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Warehouse from "./pages/admin/Warehouse.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
// import Clients from "./pages/admin/Clients.jsx";
// import Root from "./components/Root.jsx";
// import Login from "./pages/Login.jsx";
// import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path="" element={<DashboardHome />} />
        </Route>
        <Route path="/" element={<Dashboard />}>
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
        {/* <Route path='/login' element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
