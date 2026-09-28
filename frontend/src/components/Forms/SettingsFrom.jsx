import { Save, Loader2, ChevronDown, Lock, Download, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";

export default function SettingsForm({
  activeTab, formData, onChange, onSave, onChangePassword,
  onExport, onClearCache, isSaving, isChangingPassword, isExporting
}) {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const submitPasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) return;
    const changed = await onChangePassword(passwords);
    if (changed) setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <form onSubmit={onSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* --- PROFILE SETTINGS --- */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="name" value={formData.name || ""} onChange={onChange} />
            <FormInput label="Account Role" name="role" value={formData.role || ""} readOnly />
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
            <FormSelect label="Gender" name="gender" value={formData.gender || "not specified"} onChange={onChange} options={["male", "female", "not specified"]} />
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
            <FormInput label="Account Phone" name="phone" value={formData.phone || ""} onChange={onChange} />
            <FormInput label="Account Email" name="email" value={formData.email || ""} type="email" readOnly />
            <FormInput label="Secondary Contact Email" name="secondaryEmail" value={formData.secondaryEmail || ""} onChange={onChange} type="email" />
            <div className="md:col-span-2">
              <FormInput label="Account Address" name="address" value={formData.address || ""} onChange={onChange} />
            </div>
            <FormSelect label="Base Currency" name="currency" value={formData.currency || "INR"} onChange={onChange} options={["INR", "USD", "EUR", "GBP"]} />
            <FormSelect label="System Timezone" name="timezone" value={formData.timezone || "IST (UTC+5:30)"} onChange={onChange} options={["IST (UTC+5:30)", "GMT (UTC+0)", "EST (UTC-5)"]} />
            <FormSelect label="Language" name="language" value={formData.language || "English"} onChange={onChange} options={["English", "Hindi"]} />
          </div>
        </div>
      )}

      {/* --- SECURITY SETTINGS --- */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Current Password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={event => setPasswords(prev => ({ ...prev, currentPassword: event.target.value }))}
            />
            <FormInput
              label="New Password (8+ characters)"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={event => setPasswords(prev => ({ ...prev, newPassword: event.target.value }))}
            />
            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={event => setPasswords(prev => ({ ...prev, confirmPassword: event.target.value }))}
            />
          </div>
          {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <p className="text-sm font-bold text-rose-600">New passwords do not match.</p>
          )}
          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={submitPasswordChange}
              disabled={isChangingPassword || passwords.newPassword.length < 8 || !passwords.currentPassword || passwords.newPassword !== passwords.confirmPassword}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50"
            >
              {isChangingPassword ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS (Alerts) --- */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <ToggleInput label="Email Notifications" name="emailNotifications" checked={formData.emailNotifications || false} onChange={onChange} description="Save your preference for inventory email updates." />
          <ToggleInput label="Low Stock Alerts" name="lowStockAlerts" checked={formData.lowStockAlerts || false} onChange={onChange} description="Save your preference for low-stock alerts." />
          <ToggleInput label="Push Notifications" name="pushNotifications" checked={formData.pushNotifications || false} onChange={onChange} description="Save your preference for browser notifications." />
        </div>
      )}

      {/* --- SYSTEM & DATA --- */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-black text-slate-700">Inventory data export</p>
                <p className="text-xs text-slate-400 mt-1">Download products, categories, suppliers, orders, and warehouses as JSON.</p>
              </div>
              <button type="button" onClick={onExport} disabled={isExporting} title="Download inventory export" className="p-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-700">Application cache</p>
                <p className="text-xs text-slate-400 mt-1">Clear locally cached app data without signing out.</p>
              </div>
              <button type="button" onClick={onClearCache} title="Clear application cache" className="p-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Section */}
      {["profile", "general", "notifications"].includes(activeTab) && (
        <div className="pt-8 border-t border-slate-50 flex justify-end">
          <button
            type="submit"
            disabled={isSaving || isChangingPassword || isExporting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "Synchronizing..." : "Save Changes"}
          </button>
        </div>
      )}
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
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 shadow-inner disabled:opacity-50 read-only:bg-slate-100"
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