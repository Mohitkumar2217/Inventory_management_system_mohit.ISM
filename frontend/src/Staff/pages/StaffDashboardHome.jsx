import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowRight, Loader2 } from "lucide-react";

const Metric = ({ label, value }) => (
  <div className="border-l-2 border-emerald-700 pl-4">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
  </div>
);

export default function StaffDashboardHome() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        if (active) setSummary(data.summary || {});
      })
      .catch(() => {
        if (active) setError("Inventory summary could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-700">Operations overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Inventory status for your workspace.</p>
        </div>
        <Link to="inventory" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white">
          View inventory <ArrowRight size={16} />
        </Link>
      </header>

      {loading ? <div className="flex min-h-40 items-center"><Loader2 className="animate-spin text-emerald-700" /></div> : error ? (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid gap-6 border-y border-slate-200 py-6 sm:grid-cols-3">
          <Metric label="Products" value={summary?.totalProducts ?? 0} />
          <Metric label="Units in stock" value={summary?.totalStock ?? 0} />
          <Metric label="Low stock items" value={summary?.lowStockCount ?? 0} />
        </div>
      )}
    </section>
  );
}