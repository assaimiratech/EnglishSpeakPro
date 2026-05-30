import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";
import { loginUser } from "../../api/auth.api";
import { setToken } from "../../utils/token";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useSettingsStore } from "../../store/auth.store";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { applyTheme } = useSettingsStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      setToken(data.token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Login successful! Welcome back!");

      if (data.user?.theme) {
        applyTheme(data.user.theme);
      }

      const decoded = jwtDecode(data.token);

      if (decoded.isActive === "false") {
        toast.error("Account is disabled. Contact admin.");
        return;
      }
      if (decoded.role === "admin") {
        navigate("/naja", { replace: true });
      } else {
        navigate("/topics", { replace: true });
      }
    } catch (err) {
      const message = err.message || "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useState(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setForm((prev) => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, []);

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
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] shadow-lg mb-4"
          >
            <TbBrandGooglePodcasts className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            Welcome Back!
          </h1>
          <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
            Sign in to continue your English learning journey
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 dark:bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden transition-colors duration-200"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#8FAF9A]/10 to-white dark:from-[var(--accent)]/10 dark:to-[var(--card)] px-6 py-4 border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiLogIn className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="text-lg font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Sign In
              </h2>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-0.5 transition-colors duration-200">
              Enter your credentials to access your account
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-4 h-4" />
                    <span>Sign In</span>
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

            {/* Demo Credentials */}
            <div className="bg-[#F1F4F1] dark:bg-[var(--surface)] rounded-xl p-3 mb-4 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <FiZap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Demo Credentials
                </span>
              </div>
              <div className="space-y-1 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                <p>📧 Email: demo@englishspeakpro.com</p>
                <p>🔑 Password: demo123</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] font-medium transition-colors"
              >
                Create free account
                <FiArrowRight className="inline ml-1 w-3 h-3" />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mt-6"
        >
          <div className="flex items-center gap-1 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            <FiShield className="w-3 h-3 text-[#8FAF9A] dark:text-[var(--accent)]" />
            <span>Secure Login</span>
          </div>
          <div className="w-px h-3 bg-[#E2E8E3] dark:bg-[var(--border)]" />
          <div className="flex items-center gap-1 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            <FiCheckCircle className="w-3 h-3 text-[#2E8B57] dark:text-[var(--accent)]" />
            <span>Privacy Protected</span>
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

export default Login;
