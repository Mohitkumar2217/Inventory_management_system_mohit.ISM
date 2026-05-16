import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = useMemo(() => axios.create({
    baseURL: `${process.env.URL}/api`, // NO SLASH AT END
    // withCredentials: true
  }), []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/reset-password/${token}`, { password });
      alert("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      setError("Link expired or invalid. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc]">
      <div className="w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-2">New Password</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Set a secure password for your account.</p>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;