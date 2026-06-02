import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiMail,
  FiStar,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
    {
      name: "Features",
      path: "/features",
      icon: <FiStar className="w-4 h-4" />,
    },
    { name: "Pricing", path: "/pricing", icon: <FiInfo className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <FiMail className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav
        className={
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-[var(--surface)]backdrop-blur-md shadow-lg border-b border-[#E2E8E3] dark:border-[var(--border)]"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-2 group relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                  <img
                    src="/logo.svg"
                    alt="EnglishSpeakPro Logo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="relative">
                  <span className="font-bold text-base sm:text-lg text-[#2C2C2C] tracking-tight">
                    English<span className="text-[#2E8B57]">SpeakPro</span>
                  </span>
                  <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Right Section - Auth Buttons & Dark Mode */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={toggleDarkMode}
                className="relative p-2 rounded-full bg-gray-100 dark:bg-[var(--surface)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#8FAF9A]/20 dark:hover:bg-[var(--accent)]/20 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiSun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiMoon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:border-[#2E8B57] dark:hover:border-[var(--accent)] hover:text-[#2E8B57] dark:hover:text-[var(--accent)] transition-all duration-200 font-medium"
                >
                  <FiLogIn className="w-4 h-4" />
                  Sign In
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#2E8B57] to-[#8FAF9A] hover:from-[#257149] hover:to-[#7a9f85] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Sign Up Free
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-[var(--surface)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#8FAF9A]/20 dark:hover:bg-[var(--accent)]/20 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--surface)]"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Divider */}
                <div className="h-px bg-[#E2E8E3] dark:bg-[var(--border)] my-3" />

                {/* Mobile Auth Buttons */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:border-[#2E8B57] dark:hover:border-[var(--accent)] hover:text-[#2E8B57] dark:hover:text-[var(--accent)] transition-all duration-200 font-medium"
                >
                  <FiLogIn className="w-4 h-4" />
                  Sign In
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#2E8B57] to-[#8FAF9A] hover:from-[#257149] hover:to-[#7a9f85] text-white font-medium shadow-md transition-all duration-200"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Sign Up Free
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
