import { useEffect, useState } from "react";
import {
  FiSave,
  FiDollarSign,
  FiTag,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiPercent,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiSmartphone,
  FiEye,
  FiEyeOff,
  FiSettings as FiSettingsIcon,
} from "react-icons/fi";
import { getSettings, updateSettings } from "../../api/settings.api";
import { changePassword, updateProfile, getMe } from "../../api/auth.api";
import ThemeToggle from "../../components/settings/ThemeToggle";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getSettings();
      setSettings(
        data || {
          coursePrice: "",
          // whatsappNumber: "",
          discount: { enabled: false, type: "percentage", value: "" },
        },
      );
    } catch (err) {
      showToast(err?.message || "Failed to load settings", "error");
      setSettings({
        coursePrice: "",
        // whatsappNumber: "",
        discount: { enabled: false, type: "percentage", value: "" },
      });
    }

    try {
      const response = await getMe();
      const user = response?.data || JSON.parse(localStorage.getItem("user"));
      if (user?.email) setEmail(user.email);
      if (user?.whatsapp) setWhatsapp(user.whatsapp);
    } catch (e) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.email) setEmail(user.email);
        if (user?.whatsapp) setWhatsapp(user.whatsapp);
      } catch {}
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const payload = {
        ...settings,
        coursePrice: Number(settings.coursePrice) || 0,
        discount: {
          ...(settings.discount || {}),
          value: Number(settings.discount?.value) || 0,
        },
      };
      const updatedSettings = await updateSettings(payload);
      setSettings(updatedSettings);
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      showToast(
        err?.data?.message || err?.message || "Failed to save settings",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      showToast("Please fill in both password fields", "warning");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to update your password?",
    );
    if (!confirmed) return;

    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ oldPassword: "", newPassword: "" });
      showToast("Password updated successfully!", "success");
    } catch (err) {
      showToast(
        err?.data?.message || err?.message || "Error updating password",
        "error",
      );
    }
  };

  const handleChangeEmail = async () => {
    if (!email) {
      showToast("Please enter an email address", "warning");
      return;
    }
    try {
      await updateProfile({ email });
      showToast("Email updated successfully!", "success");
    } catch (err) {
      showToast(
        err?.data?.message || err?.message || "Error updating email",
        "error",
      );
    }
  };
  const handleChangeWhatsapp = async () => {
    const normalizedWhatsapp = String(whatsapp || "")
      .trim()
      .replace(/\s+/g, "");
    if (!normalizedWhatsapp) {
      showToast("Please enter a WhatsApp number", "warning");
      return;
    }
    if (!/^[0-9]+$/.test(normalizedWhatsapp)) {
      showToast("WhatsApp number must contain digits only", "warning");
      return;
    }
    try {
      const response = await updateProfile({ whatsapp: normalizedWhatsapp });
      if (response?.user?.whatsapp) {
        setWhatsapp(response.user.whatsapp);
      }
      showToast("WhatsApp updated successfully!", "success");
    } catch (err) {
      showToast(
        err?.data?.message || err?.message || "Error updating WhatsApp",
        "error",
      );
    }
  };

  if (!settings)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8FAF9A] dark:border-[var(--accent)] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-colors duration-200 ${
              toast.type === "success"
                ? "bg-[#2E8B57] dark:bg-[var(--accent)] text-white"
                : toast.type === "error"
                  ? "bg-[#DC2626] dark:bg-red-700 text-white"
                  : toast.type === "warning"
                    ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                    : "bg-[#8FAF9A] dark:bg-[var(--accent)] text-white"
            }`}
          >
            {toast.type === "success" && <FiCheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <FiXCircle className="w-5 h-5" />}
            {toast.type === "warning" && <FiAlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <FiInfo className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
            <FiSettingsIcon className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              Settings
            </h1>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Manage your platform configuration
            </p>
          </div>
        </div>
        <div className="w-12 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full transition-colors duration-200"></div>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiSettingsIcon className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Appearance
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Set admin theme preference
            </p>
          </div>
          <div className="p-5">
            <ThemeToggle />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Pricing Settings
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Configure course pricing and contact information
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                Course Price (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8FAF9A] dark:text-[var(--accent)]">
                  Rs.
                </span>
                <input
                  type="number"
                  value={settings.coursePrice ?? ""}
                  onChange={(e) =>
                    setSettings({ ...settings, coursePrice: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                  placeholder="Course Price"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                WhatsApp Number
              </label>
              <div className="relative">
                <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                  placeholder="WhatsApp number"
                />
              </div>
              <div className="mt-3">
                <button
                  onClick={handleChangeWhatsapp}
                  className="inline-flex items-center gap-2 bg-[#8FAF9A] dark:bg-[var(--accent)] hover:bg-[#7a9e86] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <FiSmartphone className="w-4 h-4" />
                  Update WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiTag className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Discount System
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Configure promotional discounts
            </p>
          </div>
          <div className="p-5 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.discount?.enabled ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    discount: {
                      ...settings.discount,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded border-[#E2E8E3] dark:border-[var(--border)] text-[#2E8B57] dark:text-[var(--accent)] focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] bg-white dark:bg-[var(--card)]"
              />
              <span className="text-sm text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Enable Discount
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                Discount Type
              </label>
              <select
                value={settings.discount?.type ?? "percentage"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    discount: { ...settings.discount, type: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (LKR)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                {settings.discount?.type === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount (LKR)"}
              </label>
              <div className="relative">
                {settings.discount?.type === "percentage" && (
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                )}
                <input
                  type="number"
                  value={settings.discount?.value ?? ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      discount: { ...settings.discount, value: e.target.value },
                    })
                  }
                  className={`w-full ${settings.discount?.type === "percentage" ? "pl-10" : "pl-3"} pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"`}
                  placeholder={
                    settings.discount?.type === "percentage"
                      ? "e.g., 20"
                      : "e.g., 500"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Account Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiShield className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Admin Account
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Update your email and password
            </p>
          </div>
          <div className="p-5 space-y-6">
            {/* Email Change */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FiMail className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <h3 className="font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Change Email
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="New Email Address"
                    type="email"
                  />
                </div>
                <button
                  onClick={handleChangeEmail}
                  className="inline-flex items-center gap-2 bg-[#8FAF9A] dark:bg-[var(--accent)] hover:bg-[#7a9e86] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <FiMail className="w-4 h-4" />
                  Change Email
                </button>
              </div>
            </div>

            {/* Password Change */}
            <div className="pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
              <div className="flex items-center gap-2 mb-3">
                <FiLock className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <h3 className="font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Change Password
                </h3>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full pr-10 pl-10 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="Current Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showOldPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pr-10 pl-10 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showNewPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <FiLock className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <FiSave className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
