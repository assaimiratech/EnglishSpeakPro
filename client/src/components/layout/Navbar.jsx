import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiStar,
  FiLogOut,
  FiChevronDown,
  FiBookOpen,
  FiCreditCard,
  FiSettings,
  FiHelpCircle,
  FiZap,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiArrowRight,
  FiBell,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";
import { useSettingsStore } from "../../store/auth.store";
import { removeToken } from "../../utils/token";
import Container from "../common/Container";
import { FaLock, FaMoneyBill, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const [notifications, setNotifications] = useState(3);
  const { theme, setTheme, resetTheme } = useSettingsStore();

  const NavItem = ({ to, icon, label, primary, isButton, onClick }) => {
    const className = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      primary
        ? "bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] text-white hover:from-[#257149] hover:to-[#1a5c3a]"
        : "text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)]"
    }`;

    if (isButton) {
      return (
        <button onClick={onClick} className={className}>
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </button>
      );
    }

    return (
      <Link to={to} onClick={onClick} className={className}>
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  // temp auth (replace later with context / redux)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    removeToken();
    resetTheme();
    localStorage.removeItem("user");
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const themeLabel = theme === "dark" ? "Light Mode" : "Dark Mode";
  const themeIcon =
    theme === "dark" ? (
      <FiSun className="w-4 h-4 text-[#2E8B57]" />
    ) : (
      <FiMoon className="w-4 h-4 text-[#2E8B57]" />
    );

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-[var(--bg)] backdrop-blur-md shadow-lg border-b border-[var(--border)]"
            : "bg-[var(--bg)] border-b border-[var(--border)] shadow-sm"
        }
      `}
    >
      <Container>
        <div className="h-16 flex items-center justify-between text-[var(--text)]">
          {/* LOGO with Animation */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <motion.div className="w-10 h-10 rounded-lg">
              {/* <TbBrandGooglePodcasts className="w-4 h-4 text-white" /> */}
              <img
                src="/logo.svg"
                alt="EnglishSpeakPro Logo"
                className="w-15 h-15 rounded-lg"
              />
            </motion.div>
            <div className="relative">
              <span className="font-bold text-lg text-[#2C2C2C] tracking-tight">
                English<span className="text-[#2E8B57]">SpeakPro</span>
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] rounded-full"
              />
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/topics"
                className="relative px-4 py-2 text-sm font-medium text-[#5F6B63] hover:text-[#2E8B57] transition-colors duration-200 group"
              >
                Topics
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* IF NOT LOGGED IN */}
            {!user ? (
              <div className="flex items-center gap-2 ml-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#2E8B57] hover:bg-[#F1F4F1] rounded-xl transition-all duration-200"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] hover:from-[#257149] hover:to-[#1a5c3a] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up Free
                    <FiTrendingUp className="inline ml-1 w-3 h-3" />
                  </Link>
                </motion.div>
              </div>
            ) : (
              /* PROFILE SECTION WITH DROPDOWN */
              <div className="relative ml-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-[#bbe0bb] hover:to-white p-1.5 pr-3 rounded-xl transition-all duration-200 border border-transparent hover:border-[#E2E8E3]"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.4 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8FAF9A] to-[#2E8B57] flex items-center justify-center shadow-md"
                  >
                    <FiUser className="w-4 h-4 text-white" />
                  </motion.div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#2C2C2C]">
                      {user.name?.split(" ")[0]}
                    </p>
                    {user.isPremium && (
                      <div className="flex items-center gap-1">
                        <FiStar className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-yellow-600 font-medium">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="w-4 h-4 text-[#5F6B63]" />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu with Animation */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E2E8E3] py-1 z-50 overflow-hidden"
                      >
                        {/* User Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-[#81d081] hover:to-white border-b border-[#E2E8E3]">
                          <p className="text-sm font-bold text-[#2C2C2C]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#5F6B63] mt-0.5">
                            {user.email}
                          </p>
                          {user.isPremium && (
                            <div className="inline-flex items-center gap-1 mt-2 bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full">
                              <FiStar className="w-3 h-3" />
                              <span>Premium Member</span>
                            </div>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <motion.button
                            whileHover={{
                              x: 5,
                              background:
                                "linear-gradient(to right, #bbe0bb, #ffffff)",
                            }}
                            onClick={handleProfileClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5F6B63] hover:text-[#2C2C2C] transition-all duration-200"
                          >
                            <FiUser className="w-4 h-4 text-[#00fb58]" />
                            <span>My Profile</span>
                          </motion.button>

                          <motion.button
                            whileHover={{
                              x: 5,
                              background:
                                "linear-gradient(to right, #bbe0bb, #ffffff)",
                            }}
                            onClick={() => {
                              toggleTheme();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5F6B63] hover:text-[#2C2C2C] transition-all duration-200"
                          >
                            {themeIcon}
                            <span>{themeLabel}</span>
                          </motion.button>
                        </div>

                        <div className="border-t border-[#E2E8E3] my-1"></div>

                        <motion.button
                          whileHover={{
                            x: 5,
                            background:
                              "linear-gradient(to right, #cb9797, #ffffff)",
                          }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-all duration-200"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] transition-all duration-200 relative"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />

              {/* Sidebar Menu */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-[var(--bg)] z-50 shadow-xl flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#E2E8E3] dark:border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 ">
                      <img
                        src="/logo.svg"
                        alt="EnglishSpeakPro Logo"
                        className="w-15 h-15 rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                        EnglishSpeakPro
                      </h2>
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                        {user ? user.email : "Learn English"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {!user ? (
                    // Guest Menu
                    <>
                      <NavItem
                        to="/topics"
                        icon={<FiBookOpen />}
                        label="Topics"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                      <div className="h-px bg-[#E2E8E3] dark:bg-[var(--border)] my-2" />
                      <NavItem
                        to="/login"
                        icon={<FaLock />}
                        label="Login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                      <NavItem
                        to="/register"
                        icon={<FaSignInAlt />}
                        label="Sign Up"
                        primary
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    </>
                  ) : (
                    // User Menu
                    <>
                      {/* User Info */}
                      <div className="p-3 bg-[#F1F4F1] dark:bg-[var(--card)] rounded-xl mb-3">
                        <p className="font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] truncate">
                          {user.email}
                        </p>
                        {user.isPremium && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                            <FiStar className="w-2.5 h-2.5" />
                            Premium
                          </span>
                        )}
                      </div>

                      <NavItem
                        to="/topics"
                        icon={<FiBookOpen />}
                        label="Topics"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                      <NavItem
                        className="dark:hover:bg-[#5F6B63]"
                        isButton
                        icon={<FiUser />}
                        label="My Profile"
                        onClick={() => {
                          handleProfileClick();
                          setIsMobileMenuOpen(false);
                        }}
                      />

                      <div className="h-px bg-[#E2E8E3] dark:bg-[var(--border)] my-2" />

                      {/* Theme Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#5F6B63] dark:text-[#5F6B63)] hover:bg-[#498949] dark:hover:bg-[#9fb5a6] transition-all duration-200"
                      >
                        <span className="text-lg">
                          {theme === "dark" ? (
                            <FiSun className="w-5 h-5" />
                          ) : (
                            <FiMoon className="w-5 h-5" />
                          )}
                        </span>
                        <span>{themeLabel}</span>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 mt-2"
                      >
                        <span className="text-lg">
                          <FiLogOut />
                        </span>
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>{" "}
      </Container>
    </motion.header>
  );
};

export default Navbar;
