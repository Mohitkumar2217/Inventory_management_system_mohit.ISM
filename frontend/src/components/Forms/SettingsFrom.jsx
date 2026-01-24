import { Save, Loader2, ChevronDown, Lock } from "lucide-react";

export default function SettingsForm({ activeTab, formData, onChange, onSave, isSaving }) {
  return (
    <form onSubmit={onSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* --- PROFILE SETTINGS --- */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="name" value={formData.name || ""} onChange={onChange} />
            <FormInput label="Job Title" name="role" value={formData.role || ""} onChange={onChange} />
            <div className="relative group">
              <FormInput
                label="Employee ID (System Generated)"
                name="employeeId"
                value={formData.employeeId || "NOT-ASSIGNED"}
                onChange={onChange}
                disabled={true} // Prevents editing
                className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none text-sm font-black text-slate-400 shadow-inner cursor-not-allowed italic"
              />
              <div className="absolute right-4 top-[38px] text-slate-300">
                <Lock size={14} />
              </div>
            </div>
            <FormSelect label="Gender" name="gender" value={formData.gender || "Not Set"} onChange={onChange} options={["male", "female", "not specified"]} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Biography</label>
            <textarea
              name="works"
              value={formData.works || ""}
              onChange={onChange}
              rows={3}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner resize-none"
            />
          </div>
        </div>
      )}

      {/* --- GENERAL SETTINGS (Business Info) --- */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Business Name" name="businessName" value={formData.businessName || ""} onChange={onChange} />
            <FormInput label="Official Phone" name="phone" value={formData.phone} onChange={onChange} />
            <FormInput label="Primary Email" name="email" value={formData.email || ""} onChange={onChange} type="email" />
            <FormInput label="Secondary Email" name="secondaryEmail" value={formData.secondaryEmail || ""} onChange={onChange} type="email" />
            <div className="md:col-span-2">
              <FormInput label="Hub Address" name="address" value={formData.address || ""} onChange={onChange} />
            </div>
            <FormSelect label="Base Currency" name="currency" value={formData.currency || "INR"} onChange={onChange} options={["INR", "USD", "EUR", "GBP"]} />
            <FormSelect label="System Timezone" name="timezone" value={formData.timezone || "IST (UTC+5:30)"} onChange={onChange} options={["IST (UTC+5:30)", "GMT (UTC+0)", "EST (UTC-5)"]} />
          </div>
        </div>
      )}

      {/* --- SECURITY SETTINGS --- */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <ToggleInput label="Two-Factor Authentication" name="twoFactor" checked={formData.twoFactor || false} onChange={onChange} description="Add an extra layer of security by requiring a mobile OTP during login." />
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mt-4">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Security Status</p>
            <p className="text-xs font-bold text-blue-800/60">Your account is currently protected by 256-bit encryption.</p>
          </div>
          <div className="pt-4">
            <button type="button" className="text-xs font-black text-rose-500 uppercase tracking-widest hover:underline">Request Admin Password Reset</button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS (Alerts) --- */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <ToggleInput label="Email Notifications" name="emailNotifications" checked={formData.emailNotifications || false} onChange={onChange} description="Receive automated summary reports of warehouse activity via email." />
          <ToggleInput label="Low Stock Alerts" name="lowStockAlerts" checked={formData.lowStockAlerts || false} onChange={onChange} description="Get real-time browser notifications when inventory drops below safety thresholds." />
          <ToggleInput label="Push Notifications" name="pushNotifications" checked={formData.pushNotifications || false} onChange={onChange} description="Enable desktop notifications for critical system updates." />
        </div>
      )}

      {/* --- SYSTEM & DATA --- */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <ToggleInput label="Automatic Cloud Backup" name="autoBackup" checked={formData.autoBackup || false} onChange={onChange} description="Securely sync and backup all inventory data every 24 hours to the master server." />
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 mt-4">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Advanced Operations</p>
            <div className="flex gap-3">
              <button type="button" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase hover:bg-white/10 transition-all">Download Data Export</button>
              <button type="button" className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 uppercase hover:bg-rose-500/20 transition-all">Clear Local Cache</button>
            </div>
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
          {isSaving ? "Synchronizing..." : "Commit Configuration"}
        </button>
      </div>
    </form>
  );
}


function FormInput({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        {...props}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner disabled:opacity-50"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner appearance-none cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
      </div>
    </div>
  );
}

function ToggleInput({ label, name, checked, onChange, description }) {
  return (
    <div className="flex items-start justify-between p-6 hover:bg-slate-50/50 border border-transparent hover:border-slate-100 rounded-[2.5rem] transition-all group">
      <div className="max-w-md">
        <p className="text-sm font-black text-slate-700 mb-1">{label}</p>
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-1">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
      </label>
    </div>
  );
}