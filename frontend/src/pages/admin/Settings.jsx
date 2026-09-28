import React, { useState, useMemo, useRef, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import SettingsForm from "../../components/Forms/SettingsFrom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/client.js";
import {
  Shield, Bell, Globe, Database, User,
  Camera, UserCheck, ShieldCheck, Activity
} from "lucide-react";

export default function Settings() {
  const { token, user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const fileInputRef = useRef(null);

  const [settingsData, setSettingsData] = useState({
    name: user?.name || "",
    role: user?.role || "staff",
    works: user?.works || "",
    img: user?.img || "",
    employeeId: user?.employeeId || "",
    gender: user?.gender || "not specified",
    language: user?.language || "English",
    phone: user?.phone || "",
    email: user?.email || "",
    secondaryEmail: user?.secondaryEmail || "",
    address: user?.address || "",
    businessName: user?.businessName || "",
    department: user?.department || "",
    currency: user?.currency || "INR",
    timezone: user?.timezone || "IST (UTC+5:30)",
    emailNotifications: user?.emailNotifications || false,
    lowStockAlerts: user?.lowStockAlerts || false,
    pushNotifications: user?.pushNotifications || false
  });

  const api = apiClient;

  useEffect(() => {
    let isCurrent = true;
    api.get("/staffs/profile")
      .then(({ data }) => {
        if (isCurrent && data.success) {
          setSettingsData(prev => ({ ...prev, ...data.member }));
          setIsConnected(true);
        }
      })
      .catch(error => {
        if (isCurrent) {
          setIsConnected(false);
          setActionStatus({ type: "error", message: error.response?.data?.message || "Could not load account settings." });
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [api]);

  const completionStats = useMemo(() => {
    const requiredFields = ['name', 'email', 'phone', 'address'];
    const filledFields = requiredFields.filter(field => !!settingsData[field]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [settingsData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActionStatus(null);
    setSettingsData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsData(prev => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put("/staffs/settings", settingsData);
      if (res.data.success) {
        setSettingsData(prev => ({ ...prev, ...res.data.member }));
        login(token, { ...user, ...res.data.member });
        setLastSaved(new Date());
        setActionStatus({ type: "success", message: "Settings saved." });
      }
    } catch (err) {
      setActionStatus({ type: "error", message: err.response?.data?.message || "Could not save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    setIsChangingPassword(true);
    setActionStatus(null);
    try {
      await api.put("/staffs/change-password", { currentPassword, newPassword });
      setActionStatus({ type: "success", message: "Password changed successfully." });
      return true;
    } catch (err) {
      setActionStatus({ type: "error", message: err.response?.data?.message || "Could not change password." });
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

    const handleExport = async () => {
      setIsExporting(true);
      setActionStatus(null);
      try {
        const { data } = await api.get("/staffs/export");
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `inventory-export-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setActionStatus({ type: "success", message: "Inventory export downloaded." });
      } catch (err) {
        setActionStatus({ type: "error", message: err.response?.data?.message || "Could not export inventory data." });
      } finally {
        setIsExporting(false);
      }
    };

    const handleClearCache = async () => {
      if (!window.confirm("Clear cached application data? You will remain signed in.")) return;
      try {
        Object.keys(localStorage).forEach(key => {
          if (key !== "pos-token" && key !== "pos-user") localStorage.removeItem(key);
        });
        sessionStorage.clear();
        if ("caches" in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map(key => window.caches.delete(key)));
        }
        setActionStatus({ type: "success", message: "Application cache cleared." });
      } catch {
        setActionStatus({ type: "error", message: "Could not clear application cache." });
      }
    };

  const tabs = [
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
    { id: "general", label: "Business Info", icon: <Globe size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Alerts", icon: <Bell size={18} /> },
    { id: "system", label: "System & Data", icon: <Database size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <PageTitle>System Settings</PageTitle>
            <div className="flex items-center gap-3 mt-2">
              <span className={`${isConnected ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"} text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border flex items-center gap-1`}>
                <Activity size={12} /> {isLoading ? "Loading" : isConnected ? "Connected" : "Offline"}
              </span>
              <span className="text-slate-300">|</span>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Changes save when committed"}
              </p>
            </div>
          </div>

          {actionStatus && (
            <p role="status" className={`text-sm font-bold ${actionStatus.type === "error" ? "text-rose-600" : "text-emerald-700"}`}>
              {actionStatus.message}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT SIDEBAR: Navigation Tabs */}
          <div className="w-full lg:w-64 space-y-2 shrink-0">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm transition-all group ${activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-300"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.label}
                </div>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
            ))}
          </div>

          {/* CENTER: Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative min-h-[600px]">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight capitalize">{activeTab} Settings</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Configure your {activeTab} environment</p>
              </div>

              {isLoading ? (
                <div className="py-16 text-center text-sm font-bold text-slate-400">Loading saved settings...</div>
              ) : (
                <SettingsForm
                  activeTab={activeTab}
                  formData={settingsData}
                  onChange={handleInputChange}
                  onSave={handleSave}
                  onChangePassword={handleChangePassword}
                  onExport={handleExport}
                  onClearCache={handleClearCache}
                  isSaving={isSaving}
                  isChangingPassword={isChangingPassword}
                  isExporting={isExporting}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Profile & Meta Data */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-10"></div>
              <div className="relative">
                <div className="relative inline-block mb-4 mt-2">
                  <img
                    src={settingsData.img || "https://i.pravatar.cc/150?img=11"}
                    alt="Logged In User"
                    className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-xl border-2 border-white hover:bg-slate-900 transition-all active:scale-90"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <h4 className="text-xl font-black text-slate-800 tracking-tight">{settingsData.name}</h4>
                <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-1">
                  {settingsData.role}
                </span>

                <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Progress</p>
                    <p className="text-xs font-black text-slate-800">{completionStats}%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${completionStats}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <UserCheck size={18} className="text-emerald-500 mb-2" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-sm font-black text-slate-800 capitalize">{settingsData.status || "Active"}</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <ShieldCheck size={18} className="text-blue-500 mb-2" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security</p>
                <p className="text-sm font-black text-slate-800 capitalize">{settingsData.role || "Account"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}