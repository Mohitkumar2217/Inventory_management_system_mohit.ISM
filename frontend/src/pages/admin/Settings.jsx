import React, { useState, useMemo, useRef } from "react";
import PageTitle from "../../components/PageTitle";
import SettingsForm from "../../components/Forms/SettingsFrom.jsx";
import { 
  Settings as SettingsIcon, Shield, Bell, 
  Globe, Database, Save, User, CheckCircle, 
  Camera, Clock, Activity, ChevronRight,
  UserCheck, ShieldCheck, Cpu
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Advanced state with Profile Photo
  const [settingsData, setSettingsData] = useState({
    userName: "Mohit Kumar",
    businessName: "Mohit Logistics Corp",
    adminEmail: "admin@mohit.com",
    phoneNumber: "+91 98765-43210",
    address: "Jaipur, Rajasthan, India",
    currency: "INR",
    timezone: "IST (UTC+5:30)",
    twoFactor: true,
    emailNotifications: true,
    lowStockAlerts: true,
    autoBackup: false,
    profileImage: "https://i.pravatar.cc/150?img=11" 
  });

  const completionStats = useMemo(() => {
    const requiredFields = ['userName', 'businessName', 'adminEmail', 'phoneNumber', 'address', 'profileImage'];
    const filledFields = requiredFields.filter(field => !!settingsData[field]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [settingsData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        setSettingsData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System configuration synced successfully!");
    }, 1000);
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
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <PageTitle>System Settings</PageTitle>
            <div className="flex items-center gap-3 mt-2">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                    <Activity size={12} /> System Healthy
                </span>
                <span className="text-slate-300">|</span>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> Last Sync: 2 mins ago
                </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm font-black text-[10px] text-slate-400 uppercase tracking-widest">
            <Cpu size={14} className="text-blue-500" /> Server Status: Optimal
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR: Navigation Tabs */}
          <div className="w-full lg:w-64 space-y-2 shrink-0">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm transition-all group ${
                  activeTab === tab.id 
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

              <SettingsForm 
                activeTab={activeTab} 
                formData={settingsData} 
                onChange={handleInputChange} 
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR: Profile & Meta Data */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            
            {/* User Profile Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-10"></div>
                <div className="relative">
                    <div className="relative inline-block mb-4 mt-2">
                        <img 
                            src={settingsData.profileImage} 
                            alt="Admin" 
                            className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl"
                        />
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-xl border-2 border-white hover:bg-slate-900 transition-all active:scale-90"
                        >
                            <Camera size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                    
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{settingsData.userName}</h4>
                    <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-1">
                      Super Admin
                    </span>

                    {/* Completion Tracker inside card */}
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                    <UserCheck size={18} className="text-emerald-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-black text-slate-800">Verified</p>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                    <ShieldCheck size={18} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security</p>
                    <p className="text-sm font-black text-slate-800">High</p>
                </div>
            </div>

            {/* Activity Log */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Security Log</p>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div>
                                <p className="text-xs font-black text-slate-200 leading-none">Login from Chrome</p>
                                <p className="text-[10px] text-slate-500 mt-1 font-bold">Today, 10:45 AM • Jaipur</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                            <div>
                                <p className="text-xs font-black text-slate-400 leading-none">Password Changed</p>
                                <p className="text-[10px] text-slate-500 mt-1 font-bold">4 days ago</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                        View Full History
                    </button>
                </div>
                <Shield className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}