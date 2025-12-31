import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import SettingsForm from "../../components/Forms/SettingsFrom.jsx";
import { 
  Settings as SettingsIcon, Shield, Bell, 
  Globe, Database, Save, ArrowLeft 
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Mock initial state for settings
  const [settingsData, setSettingsData] = useState({
    businessName: "Mohit Logistics Corp",
    adminEmail: "admin@mohit.com",
    currency: "INR",
    timezone: "IST (UTC+5:30)",
    twoFactor: true,
    emailNotifications: true,
    lowStockAlerts: true,
    autoBackup: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Configuration updated successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "system", label: "System", icon: <Database size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <PageTitle>System Settings</PageTitle>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <SettingsIcon size={14} className="text-blue-500" /> Global Configuration
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                  activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10 relative overflow-hidden">
              <SettingsForm 
                activeTab={activeTab} 
                formData={settingsData} 
                onChange={handleInputChange} 
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}