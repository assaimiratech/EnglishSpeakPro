import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiSettings,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiLogOut,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";
import { removeToken } from "../../utils/token";
import { useSettingsStore } from "../../store/auth.store";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetTheme } = useSettingsStore();

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <FiHome className="w-4 h-4" />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <FiUsers className="w-4 h-4" />,
    },
    {
      path: "/admin/content",
      label: "Content",
      icon: <FiFileText className="w-4 h-4" />,
    },

    {
      path: "/admin/premium",
      label: "Premium Requests",
      icon: <FiStar className="w-4 h-4" />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <FiSettings className="w-4 h-4" />,
    },
    {
      path: "/",
      label: "Preview",
      icon: <FiFileText className="w-4 h-4" />,
    },
  ];

  const isActive = (path) => {
    const current = location.pathname;

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
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[var(--bg)] border-r border-[#E2E8E3] dark:border-[var(--border)] shadow-sm h-screen sticky top-0 transition-all duration-200">
      <div className="p-5 pb-4 border-b border-[#E2E8E3] dark:border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
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
        <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-2 transition-colors duration-200">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
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

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
        <button
          onClick={() => {
            removeToken();
            resetTheme();
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--card)] hover:text-[#2C2C2C] dark:hover:text-[var(--text)] transition-all duration-200"
        >
          <FiLogOut className="w-4 h-4 text-[#8FAF9A]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
