import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, MapPin, Loader2, UserPlus, Eye, EyeOff, ShieldCheck } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "staff",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { label: "", color: "bg-slate-200", width: "0%" };
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const levels = [
      { label: "Very Weak", color: "bg-red-500", width: "20%" },
      { label: "Weak", color: "bg-orange-500", width: "40%" },
      { label: "Fair", color: "bg-yellow-500", width: "60%" },
      { label: "Good", color: "bg-blue-500", width: "80%" },
      { label: "Strong", color: "bg-emerald-500", width: "100%" },
    ];
    return levels[Math.min(score - 1, 4)] || levels[0];
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("https://inventory-management-system-mohit-ism.onrender.com/api/auth/register", formData);
      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden py-12">
      {/* Background Blobs - Matching Login UI */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-2xl px-6 z-10 animate-in fade-in zoom-in duration-500">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 mb-4">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Inventory<span className="text-emerald-600">MS</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Enterprise Resource Planning v2.0</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Join our secure logistics network</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm"
                  placeholder="Mohit Kumar"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm"
                  placeholder="admin@firm.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                {formData.password && (
                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${passwordStrength.color.replace('bg-', 'text-')} bg-opacity-10 transition-all`}>
                     {passwordStrength.label}
                   </span>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength Meter Bar */}
              {formData.password && (
                <div className="px-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${passwordStrength.color}`} style={{ width: passwordStrength.width }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">System Role</label>
              <div className="relative group">
                 <select 
                   name="role" 
                   onChange={handleChange} 
                   value={formData.role} 
                   className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm appearance-none cursor-pointer"
                 >
                   <option value="staff">Staff</option>
                   <option value="manager">Manager</option>
                   <option value="warehouse">Warehouse Admin</option>
                   <option value="accountant">Accountant</option>
                   <option value="admin">Admin</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <UserPlus size={18} />
                 </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Location Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <textarea 
                  name="address" 
                  rows="2" 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm resize-none" 
                  placeholder="Primary Business Office..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Initialize Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs font-bold">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 font-black hover:underline ml-1 uppercase tracking-widest">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          © 2026 Secured by IMS Protocol
        </p>
      </div>
    </div>
  );
};

export default Register;