import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const apiUrl = `${import.meta.env.VITE_API_URL}/api/warehouse`;

export default function WarehouseProducts() {
  const { token } = useAuth();
  const [warehouse, setWarehouse] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const assignedWarehouse = data.stocks?.[0];
        if (!active) return;
        if (!assignedWarehouse) {
          setError("No warehouse is assigned to this account. Contact the master admin.");
          return;
        }
        setWarehouse(assignedWarehouse);
        setForm({
          name: assignedWarehouse.name || "",
          quantity: assignedWarehouse.quantity ?? 0,
          details: assignedWarehouse.details || "",
          capacity: assignedWarehouse.capacity ?? 0,
          statusWarehouse: assignedWarehouse.statusWarehouse || "active",
          inventory: assignedWarehouse.inventory || [],
          address: {
            zone: assignedWarehouse.address?.zone || "",
            city: assignedWarehouse.address?.city || "",
            state: assignedWarehouse.address?.state || "",
            pin: assignedWarehouse.address?.pin ?? "",
          },
        });
      })
      .catch(() => {
        if (active) setError("Assigned warehouse data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  const updateField = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("address.")) {
      const field = name.slice("address.".length);
      setForm((current) => ({ ...current, address: { ...current.address, [field]: value } }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateInventoryQuantity = (index, quantity) => {
    setForm((current) => ({
      ...current,
      inventory: current.inventory.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity } : item
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!warehouse?._id) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const { data } = await axios.put(`${apiUrl}/${warehouse._id}`, {
        ...form,
        quantity: Number(form.quantity),
        capacity: Number(form.capacity),
        address: { ...form.address, pin: Number(form.address.pin) },
      }, { headers: { Authorization: `Bearer ${token}` } });
      setWarehouse(data.stock);
      setMessage("Warehouse data saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Warehouse changes could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase text-blue-700">Assigned warehouse</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{warehouse?.name || "Warehouse details"}</h1>
        <p className="mt-1 text-sm text-slate-500">You can update this warehouse only.</p>
      </header>

      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      {warehouse && (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Warehouse name
              <input name="name" value={form.name || ""} onChange={updateField} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Warehouse ID
              <input value={warehouse.warehouseId || ""} readOnly className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Quantity
              <input name="quantity" type="number" min="0" value={form.quantity ?? 0} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Capacity
              <input name="capacity" type="number" min="0" value={form.capacity ?? 0} onChange={updateField} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Operational status
              <select name="statusWarehouse" value={form.statusWarehouse || "active"} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              City
              <input name="address.city" value={form.address?.city || ""} onChange={updateField} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Address zone
              <input name="address.zone" value={form.address?.zone || ""} onChange={updateField} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              State
              <input name="address.state" value={form.address?.state || ""} onChange={updateField} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              PIN code
              <input name="address.pin" type="number" min="0" value={form.address?.pin ?? ""} onChange={updateField} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </label>
          </div>
          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Notes
            <textarea name="details" value={form.details || ""} onChange={updateField} rows="4" className="w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-800">Warehouse stock</h2>
            {form.inventory.length ? (
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">SKU</th><th className="px-3 py-2">Quantity</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {form.inventory.map((item, index) => (
                      <tr key={item._id || item.sku || index}>
                        <td className="px-3 py-2">{item.productName || "Inventory item"}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{item.sku || "-"}</td>
                        <td className="px-3 py-2">
                          <input type="number" min="0" value={item.quantity ?? 0} onChange={(event) => updateInventoryQuantity(index, event.target.value)} className="w-28 rounded-md border border-slate-300 px-2 py-1" aria-label={`Quantity for ${item.productName || item.sku || `item ${index + 1}`}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-sm text-slate-500">No inventory rows are linked to this warehouse yet.</p>}
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save warehouse
          </button>
        </form>
      )}
    </section>
  );
}