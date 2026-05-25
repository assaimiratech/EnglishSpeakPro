import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiStar,
  FiLock,
  FiEdit2,
  FiSave,
  FiX,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiZap,
} from "react-icons/fi";
import { getMe, updateProfile, changePassword } from "../../api/auth.api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUser = async () => {
    try {
      const data = await getMe();
      const userData = data.user || data.data || data;
      setUser(userData);
      setProfileForm({
        name: userData?.name || "",
        email: userData?.email || "",
        whatsapp: userData?.whatsapp || "",
      });
    } catch (err) {
      console.log(err);
      showToast("Failed to load profile", "error");
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileForm);
      showToast("Profile updated successfully!", "success");
      setEditMode(false);
      loadUser();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast("Please fill in both password fields", "warning");
      return;
    }
    setIsLoading(true);
    try {
      await changePassword(passwordForm);
      showToast("Password updated successfully!", "success");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordBox(false);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update password",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] transition-colors duration-200">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#E2E8E3] dark:border-[var(--border)] border-t-[#2E8B57] dark:border-t-[var(--accent)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)] animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-[#5F6B63] dark:text-[var(--muted)] font-medium transition-colors duration-200">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F7] via-white to-[#F7F9F7] dark:from-[var(--surface)] dark:via-[var(--bg)] dark:to-[var(--surface)] py-8 md:py-12 relative overflow-hidden transition-colors duration-200">
      {/* Animated Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8FAF9A]/20 to-transparent dark:from-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#2E8B57]/10 to-transparent dark:from-[var(--accent)]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#2E8B57] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: -50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-6 z-50"
            >
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-colors duration-200 ${
                  toast.type === "success"
                    ? "bg-[#2E8B57] dark:bg-[var(--accent)] text-white"
                    : toast.type === "error"
                      ? "bg-[#DC2626] dark:bg-red-700 text-white"
                      : "bg-yellow-500 dark:bg-yellow-600 text-white"
                }`}
              >
                {toast.type === "success" && (
                  <FiCheckCircle className="w-5 h-5" />
                )}
                {toast.type === "error" && (
                  <FiAlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] flex items-center justify-center shadow-lg">
              <FiUser className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2C2C2C] to-[#2E8B57] dark:from-[var(--text)] dark:to-[var(--accent)] bg-clip-text text-transparent">
            My Profile
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] rounded-full mx-auto mt-3" />
          <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-3 transition-colors duration-200">
            Manage your personal information and security settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-[var(--card)] rounded-2xl shadow-xl border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden mb-6 transition-all duration-200"
        >
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-[#8FAF9A]/10 to-white dark:from-[var(--accent)]/10 dark:to-[var(--card)] px-6 py-4 border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Personal Information
                  </h2>
                  <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                    Your account details
                  </p>
                </div>
              </div>

              {/* Premium Badge */}
              {user.isPremium ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-4 py-2 rounded-full shadow-sm transition-colors duration-200">
                  <FiStar className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Premium Member
                  </span>
                  <FiZap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-[var(--surface)] px-4 py-2 rounded-full transition-colors duration-200">
                  <FiStar className="w-4 h-4 text-gray-500 dark:text-[var(--muted)]" />
                  <span className="text-sm text-gray-600 dark:text-[var(--muted)]">
                    Free Member
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!editMode ? (
              <div className="space-y-6">
                {/* User Info Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                        Full Name
                      </p>
                      <p className="text-base font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
                      <FiMail className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                        Email Address
                      </p>
                      <p className="text-base font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
                      <FiPhone className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                        WhatsApp Number
                      </p>
                      <p className="text-base font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                        {user.whatsapp || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
                      <FiAward className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                        Member Since
                      </p>
                      <p className="text-base font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] dark:from-[var(--accent)] dark:to-[#257149] hover:from-[#257149] hover:to-[#1a5c3a] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <input
                      type="text"
                      value={profileForm.whatsapp}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          whatsapp: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    Save Changes
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(false)}
                    className="inline-flex items-center gap-2 bg-gray-100 dark:bg-[var(--surface)] hover:bg-gray-200 dark:hover:bg-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] px-6 py-2.5 rounded-xl font-medium transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-[var(--card)] rounded-2xl shadow-xl border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden transition-all duration-200"
        >
          <div className="bg-gradient-to-r from-[#F1F4F1] to-white dark:from-[var(--surface)] dark:to-[var(--card)] px-6 py-4 border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Security
                </h2>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                  Manage your password and security settings
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!showPasswordBox ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPasswordBox(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md"
              >
                <FiLock className="w-4 h-4" />
                Change Password
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 transition-colors duration-200">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4" />
                    )}
                    Update Password
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPasswordBox(false)}
                    className="inline-flex items-center gap-2 bg-gray-100 dark:bg-[var(--surface)] hover:bg-gray-200 dark:hover:bg-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] px-6 py-2.5 rounded-xl font-medium transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Profile;
