import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";
import { registerUser } from "../../api/auth.api";
import { setToken } from "../../utils/token";
import toast from "react-hot-toast";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useMemo } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    country: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!/^[a-zA-Z\s]{3,}$/.test(form.name.trim()) && form.name.length < 3) {
      setError("Please enter your full name");
      return false;
    }
    if (!form.email.includes("@gmail.com")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (form.whatsapp.length !== 10) {
      setError("WhatsApp number must be 10 digits");
      return false;
    }
    if (!form.country?.trim()) {
      setError("Please select your country");
      return false;
    }
    if (!/^[a-zA-Z\s]{3,}$/.test(form.city.trim())) {
      setError("Please enter your city");
      return false;
    }
    return true;
  };
  const options = useMemo(() => countryList().getData(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(form);
      setToken(data.token);
      toast.success("Account created successfully! Welcome aboard! 🎉");
      navigate("/topics");
    } catch (err) {
      const message = err.message || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F9F7] via-white to-[#F7F9F7] dark:from-[var(--surface)] dark:via-[var(--bg)] dark:to-[var(--surface)] relative overflow-hidden py-8 px-4 transition-colors duration-200">
      {/* Animated Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8FAF9A]/20 to-transparent dark:from-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#2E8B57]/10 to-transparent dark:from-[var(--accent)]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-3xl" />

      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#2E8B57] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] shadow-lg mb-3"
          >
            <TbBrandGooglePodcasts className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            Create Account
          </h1>
          <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
            Start your English learning journey today
          </p>
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 dark:bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden transition-colors duration-200"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#8FAF9A]/10 to-white dark:from-[var(--accent)]/10 dark:to-[var(--card)] px-6 py-4 border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiUserPlus className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="text-lg font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Sign Up
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-0.5 transition-colors duration-200">
              Fill in your details to get started
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl mb-5 transition-colors duration-200"
                >
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white/50 dark:bg-[var(--card)]/50 text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white/50 dark:bg-[var(--card)]/50 text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white/50 dark:bg-[var(--card)]/50 text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5F6B63] dark:text-[var(--muted)] hover:text-[#2E8B57] dark:hover:text-[var(--accent)] transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                  Must be at least 8 characters
                </p>
              </div>

              {/* WhatsApp Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="07X XXX XXXX"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white/50 dark:bg-[var(--card)]/50 text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    required
                  />
                </div>
              </div>
              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  Country
                </label>
                <Select
                  options={options}
                  value={options.find((c) => c.value === form.country)}
                  onChange={(val) => setForm({ ...form, country: val.label })}
                  placeholder="Country"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "transparent",
                      borderColor: state.isFocused
                        ? "var(--border)"
                        : "#8c8c8c",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(143,175,154,0.2)"
                        : "none",
                      borderRadius: "12px",
                      padding: "2px",
                      fontSize: "14px",
                      "&:hover": {
                        borderColor: "#8FAF9A",
                      },
                    }),

                    menu: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#F1F4F1" : "white",
                      color: "#2C2C2C",
                      cursor: "pointer",
                      fontSize: "14px",
                      ":active": {
                        backgroundColor: "#E2E8E3",
                      },
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: "#2C2C2C",
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: "#5F6B63",
                    }),
                  }}
                />
              </div>

              {/* City Field */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1.5 transition-colors duration-200">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[#8FAF9A]/20 dark:focus:ring-[var(--accent)]/20 outline-none transition-all bg-white/50 dark:bg-[var(--card)]/50 text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] dark:from-[var(--accent)] dark:to-[#257149] hover:from-[#257149] hover:to-[#1a5c3a] text-white py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8E3] dark:border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/80 dark:bg-[var(--card)]/80 text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                  or
                </span>
              </div>
            </div>
            {/* Login Link */}
            <p className="text-center text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] font-medium transition-colors"
              >
                Sign in
                <FiArrowRight className="inline ml-1 w-3 h-3" />
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

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

export default Register;
