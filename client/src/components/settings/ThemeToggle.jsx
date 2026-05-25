import { useSettingsStore } from "../../store/settings.store";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

const ThemeToggle = () => {
  const { theme, setTheme } = useSettingsStore();

  const getThemeIcon = () => {
    if (theme === "light") return <FiMoon className="w-4 h-4" />;
    if (theme === "dark") return <FiSun className="w-4 h-4" />;
    return <FiMonitor className="w-4 h-4" />;
  };

  const getThemeText = () => {
    if (theme === "light") return "Dark Mode";
    if (theme === "dark") return "Light Mode";
    return "System";
  };

  const getNextTheme = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  return (
    <button
      onClick={() => setTheme(getNextTheme())}
      className="
        group
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        bg-white
        border
        border-[#E2E8E3]
        text-[#2C2C2C]
        hover:bg-[#F1F4F1]
        hover:border-[#8FAF9A]
        transition-all
        duration-200
        shadow-sm
        hover:shadow-md
      "
      aria-label={`Switch to ${getThemeText()}`}
    >
      <span className="text-[#8FAF9A] group-hover:scale-110 transition-transform duration-200">
        {getThemeIcon()}
      </span>
      <span className="text-sm font-medium">{getThemeText()}</span>
    </button>
  );
};

export default ThemeToggle;
