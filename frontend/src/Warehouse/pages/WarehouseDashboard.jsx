import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowRight, Box, Loader2, Warehouse } from "lucide-react";

const Stat = ({ label, value }) => (
  <div className="border-l-2 border-blue-700 pl-4">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
  </div>
);

export default function WarehouseDashboard() {
  const { token } = useAuth();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${import.meta.env.VITE_API_URL}/api/warehouse`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        if (active) setWarehouse(data.stocks?.[0] || null);
      })
      .catch(() => {
        if (active) setError("Warehouse data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  if (error || !warehouse) {
    return <p role="alert" className="rounded-md bg-slate-100 p-4 text-sm text-slate-700">{error || "No warehouse is assigned to this account. Contact the master admin."}</p>;
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-700">Assigned warehouse</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{warehouse.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{[warehouse.address?.city, warehouse.address?.state].filter(Boolean).join(", ") || "Location not set"}</p>
        </div>
        <Link to="/warehouse-portal/inventory" className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
          Update warehouse <ArrowRight size={16} />
        </Link>
      </header>

      <div className="grid gap-6 border-y border-slate-200 py-6 sm:grid-cols-3">
        <Stat label="Units" value={warehouse.quantity ?? 0} />
        <Stat label="Capacity" value={warehouse.capacity ?? 0} />
        <Stat label="Inventory lines" value={warehouse.inventory?.length ?? 0} />
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-700">
        <Warehouse size={18} className="text-blue-700" />
        <span>Warehouse ID: <strong className="font-mono">{warehouse.warehouseId}</strong></span>
        <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{warehouse.statusWarehouse}</span>
      </div>

      <div className="flex items-start gap-3 rounded-md bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        <Box size={18} className="mt-0.5 shrink-0 text-blue-700" />
        <p>{warehouse.details || "No warehouse notes have been added."}</p>
      </div>
    </section>
  );
}