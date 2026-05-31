import { Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

const Sidebar = () => {
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
      path: "/admin/topics",
      label: "Topics",
      icon: <FiBookOpen className="w-4 h-4" />,
    },
    {
      path: "/admin/lessons",
      label: "Lessons",
      icon: <FiFileText className="w-4 h-4" />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <FiSettings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-[#E2E8E3] shadow-sm p-4 h-screen sticky top-0">
      <h2 className="font-bold text-lg mb-4 text-[#2C2C2C]">Admin Panel</h2>

      <nav className="flex flex-col gap-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#5F6B63] hover:bg-[#F1F4F1] hover:text-[#2C2C2C] transition-all duration-200"
          >
            <span className="text-[#8FAF9A]">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
