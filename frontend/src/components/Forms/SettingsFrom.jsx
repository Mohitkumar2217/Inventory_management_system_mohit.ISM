import React from "react";
import { Save, Loader2 } from "lucide-react";

export default function SettingsForm({ activeTab, formData, onChange, onSave, isSaving }) {
  return (
    <form onSubmit={onSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* --- PROFILE SETTINGS --- */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <SectionHeader title="Profile Information" subtitle="Update your personal details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="userName" value={formData.userName} onChange={onChange} />
            <FormInput label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={onChange} />
            <FormInput label="Employee ID" name="employeeId" value={formData.employeeId} onChange={onChange} />
            <FormSelect label="Gender" name="gender" value={formData.gender} onChange={onChange} options={["Male", "Female", "Non-Binary"]} />
          </div>
        </div>
      )}
      {/* --- GENERAL SETTINGS --- */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <SectionHeader title="Business Identity" subtitle="Basic company information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Business Name" name="businessName" value={formData.businessName} onChange={onChange} />
            <FormInput label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={onChange} type="email" />
            <FormSelect label="Base Currency" name="currency" value={formData.currency} onChange={onChange} options={["INR", "USD", "EUR", "GBP"]} />
            <FormSelect label="System Timezone" name="timezone" value={formData.timezone} onChange={onChange} options={["IST (UTC+5:30)", "GMT (UTC+0)", "EST (UTC-5)"]} />
          </div>
        </div>
      )}

      {/* --- SECURITY SETTINGS --- */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <SectionHeader title="Access & Privacy" subtitle="Manage account security protocols" />
          <ToggleInput label="Two-Factor Authentication" name="twoFactor" checked={formData.twoFactor} onChange={onChange} description="Add an extra layer of security to your admin account." />
          <div className="pt-4">
            <button type="button" className="text-xs font-black text-rose-500 uppercase tracking-widest hover:underline">Change Admin Password</button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS --- */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <SectionHeader title="Alert Preferences" subtitle="Configure system-generated emails" />
          <ToggleInput label="Email Notifications" name="emailNotifications" checked={formData.emailNotifications} onChange={onChange} description="Receive summary reports via email." />
          <ToggleInput label="Low Stock Alerts" name="lowStockAlerts" checked={formData.lowStockAlerts} onChange={onChange} description="Get notified when items drop below threshold." />
        </div>
      )}

      {/* --- SYSTEM --- */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <SectionHeader title="Core System" subtitle="Database and backup management" />
          <ToggleInput label="Automatic Cloud Backup" name="autoBackup" checked={formData.autoBackup} onChange={onChange} description="Securely backup all data every 24 hours." />
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Data Management</p>
            <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">Clear System Cache</button>
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="pt-8 border-t border-slate-50 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? "Saving..." : "Update Configuration"}
        </button>
      </div>
    </form>
  );
}

// --- SUB-COMPONENTS ---
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input name={name} value={value} onChange={onChange} type={type} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner" />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner appearance-none">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ToggleInput({ label, name, checked, onChange, description }) {
  return (
    <div className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors group">
      <div className="max-w-md">
        <p className="text-sm font-black text-slate-700 mb-1">{label}</p>
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-1">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
      </label>
    </div>
  );
}