import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader2, PackageSearch } from "lucide-react";

export default function InventoryReadOnly() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (active) setProducts(response.data.products || []);
      })
      .catch(() => {
        if (active) setError("Inventory could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [token]);

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
        <p className="mt-1 text-sm text-slate-500">Read-only product and stock records.</p>
      </header>
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{product.sku || product.code || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{product.warehouse || "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{product.stock ?? 0}</td>
                  <td className="px-4 py-3 text-slate-600">{product.status || product.availability || "-"}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500"><PackageSearch className="mx-auto mb-2" size={20} />No inventory records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}