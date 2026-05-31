import { useState } from "react";
import api from "../../api/api";
import {
  FiX,
  FiSend,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const RequestPremiumModal = ({ isOpen, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    message:
      "I'd like premium access to improve my speaking fluency and pronunciation. Please share pricing and next steps.",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!user) {
      showToast("Please log in to request premium access.", "warning");
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const whatsapp = form.whatsapp.trim();

    // WHATSAPP (10 digits only)
    if (!/^\d{10}$/.test(whatsapp)) {
      showToast("WhatsApp number must be exactly 10 digits", "warning");
      return;
    }

    try {
      setLoading(true);

      await api.post("/premium", {
        ...form,
        name,
        email,
        whatsapp,
      });

      showToast("Request sent successfully!", "success");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      showToast(err?.message || "Failed to send request", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 animate-slide-in-right`}>
            <div
              className={`
              flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all duration-200
              ${toast.type === "success" ? "bg-[#2E8B57] dark:bg-[#2E8B57] text-white" : ""}
              ${toast.type === "error" ? "bg-[#DC2626] dark:bg-[#DC2626] text-white" : ""}
              ${toast.type === "warning" ? "bg-yellow-500 dark:bg-yellow-500 text-white" : ""}
              ${toast.type === "info" ? "bg-[#8FAF9A] dark:bg-[#8FAF9A] text-white" : ""}
            `}
            >
              {toast.type === "success" && (
                <FiCheckCircle className="w-5 h-5" />
              )}
              {toast.type === "error" && <FiAlertCircle className="w-5 h-5" />}
              {toast.type === "warning" && (
                <FiAlertCircle className="w-5 h-5" />
              )}
              {toast.type === "info" && <FiInfo className="w-5 h-5" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Modal */}
        <div className="bg-white dark:bg-[var(--bg)] w-full max-w-md mx-4 rounded-2xl shadow-xl relative animate-scale-in transition-colors duration-200">
          {/* Header */}
          <div className="p-5 pb-3 border-b border-[#E2E8E3] dark:border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 dark:bg-[#8FAF9A]/20 flex items-center justify-center transition-colors duration-200">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Premium Access
                  </h2>
                  <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                    Unlock all features
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)] transition-all duration-200"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] transition-all duration-200 outline-none text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="Your name"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] transition-all duration-200 outline-none text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="your@email.com"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200" />
                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] transition-all duration-200 outline-none text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] transition-all duration-200 outline-none text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)] resize-none"
                  placeholder="Why do you want premium access?"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 pt-3 border-t border-[#E2E8E3] dark:border-[var(--border)]">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-[#257149] dark:bg-[var(--accent)] dark:hover:bg-[#257149] text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] text-center mt-3 transition-colors duration-200">
              Our team will contact you within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles - Add to your global CSS instead of inline */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default RequestPremiumModal;
