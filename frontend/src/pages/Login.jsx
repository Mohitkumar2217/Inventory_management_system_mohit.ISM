import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ShieldCheck, ArrowLeft, Send } from "lucide-react";

const Login = () => {
  // View states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Success message for reset
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("https://inventory-management-system-mohit-ism.onrender.com/api/auth/login", { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        await login(token, user);
        const roleRedirects = {
          admin: "/admin/dashboard",
          manager: "/manager/dashboard",
          staff: "/staff/dashboard",
          warehouse: "/warehouse/dashboard",
          accountant: "/accounting/dashboard"
        };
        navigate(roleRedirects[user.role] || "/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Internal server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      // Replace with your actual forgot-password endpoint
      await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      setMessage("Reset link sent! Please check your email inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-md px-6 z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 mb-4">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Inventory<span className="text-emerald-600">MS</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Enterprise Resource Planning v2.0</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200">
          {!isForgotPassword ? (
            /* --- LOGIN VIEW --- */
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">Please enter your credentials to continue</p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6 animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mohit.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setIsForgotPassword(true); setError(null); }}
                      className="text-[11px] font-black text-emerald-600 uppercase hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Synchronizing...</> : "Authorize Access"}
                </button>
              </form>
            </div>
          ) : (
            /* --- FORGOT PASSWORD VIEW --- */
            <div className="animate-in slide-in-from-left-8 duration-300">
              <button 
                onClick={() => { setIsForgotPassword(false); setError(null); setMessage(null); }}
                className="flex items-center text-slate-400 hover:text-emerald-600 transition-colors mb-6 text-xs font-bold uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
              </button>
              
              <h2 className="text-xl font-bold text-slate-800 mb-2">Reset Password</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">Enter your email and we'll send you a reset link.</p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-bold mb-6">
                  {message}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold text-slate-700"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mohit.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || message}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Send Reset Link</>}
                </button>
              </form>
            </div>
          )}

          <div>
            {!isForgotPassword && (
              <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                Don't have an account?{" "}
                <button onClick={handleRegister} className="text-emerald-600 font-black hover:underline">Register</button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          © 2026 Secured by IMS Protocol
        </p>
      </div>
    </div>
  );
};

export default Login;