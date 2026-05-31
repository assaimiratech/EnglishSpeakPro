import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiX,
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiSettings,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";
import { removeToken } from "../../utils/token";
import { useSettingsStore } from "../../store/auth.store";

const MobileSidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetTheme } = useSettingsStore();

  if (!open) return null;

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      path: "/admin/content",
      label: "Content",
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      path: "/admin/premium",
      label: "Premium Requests",
      icon: <FiStar className="w-5 h-5" />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
    },
    {
      path: "/",
      label: "Preview",
      icon: <FiFileText className="w-4 h-4" />,
    },
  ];

  const isActive = (path) => {
    const current = location.pathname;

    // Preview should only be active on exact "/"
    if (path === "/") {
      return current === "/";
    }

    if (path === "/admin") {
      return current === "/admin";
    }

    if (
      path === "/admin/content" &&
      (current.startsWith("/admin/content") ||
        current.startsWith("/admin/lessons"))
    ) {
      return true;
    }

    return current.startsWith(path);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[var(--bg)] shadow-xl md:hidden flex flex-col animate-slide-in transition-colors duration-200">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#E2E8E3] dark:border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#8FAF9A]/10 dark:bg-[#8FAF9A]/20 flex items-center justify-center transition-colors duration-200">
                <img
                  src="/logo.svg"
                  alt="EnglishSpeakPro Logo"
                  className="w-15 h-15 rounded-lg"
                />
              </div>
              <h2 className="text-lg font-bold text-[#2C2C2C] dark:text-[var(--text)] tracking-tight transition-colors duration-200">
                English<span className="text-[#8FAF9A]">SpeakPro</span>
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)] transition-all duration-200"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive(item.path)
                    ? "bg-[#2E8B57] text-white shadow-sm"
                    : "text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)]"
                }
              `}
            >
              <span
                className={`
                transition-colors duration-200
                ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-[#8FAF9A] group-hover:text-[#8FAF9A]"
                }
              `}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
          <div className="bg-[#F1F4F1] dark:bg-[var(--card)] rounded-xl p-3 mb-3 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#8FAF9A]/20 flex items-center justify-center">
                <FiStar className="w-3 h-3 text-[#8FAF9A]" />
              </div>
              <span className="text-xs font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Premium Access
              </span>
            </div>
            <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Upgrade to manage all features
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              removeToken();
              resetTheme();
              localStorage.removeItem("user");
              setOpen(false);
              navigate("/");
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)] transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5 text-[#8FAF9A]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
