import {
  FiMoon,
  FiSun,
  FiHeadphones,
  FiSkipForward,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import ThemeToggle from "../../components/settings/ThemeToggle";
import SettingsCard from "../../components/settings/SettingsCard";
import { useSettingsStore } from "../../store/settings.store";

const Settings = () => {
  const { autoPlay, setAutoPlay, autoNext, setAutoNext } = useSettingsStore();

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8FAF9A]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-[#8FAF9A]" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2C2C2C] tracking-tight">
              Settings
            </h1>
          </div>
          <div className="w-16 h-0.5 bg-[#8FAF9A] rounded-full"></div>
          <p className="text-sm text-[#5F6B63] mt-3 max-w-2xl">
            Customize your learning experience and app preferences
          </p>
        </div>

        <div className="space-y-5">
          {/* THEME SECTION */}
          <SettingsCard
            title="Appearance"
            desc="Customize your visual experience"
            icon={<FiMoon className="w-5 h-5 text-[#8FAF9A]" />}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-[#5F6B63]">
                <FiInfo className="w-4 h-4" />
                <span>Switch between light and dark mode</span>
              </div>
              <ThemeToggle />
            </div>
          </SettingsCard>

          {/* AUTO PLAY SECTION */}
          <SettingsCard
            title="Audio Auto Play"
            desc="Automatically play lesson audio when you open a lesson"
            icon={<FiHeadphones className="w-5 h-5 text-[#8FAF9A]" />}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-[#5F6B63]">
                <FiInfo className="w-4 h-4" />
                <span>
                  When enabled, audio will start playing automatically
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E2E8E3] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8FAF9A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E8B57]"></div>
                <span className="ml-3 text-sm font-medium text-[#2C2C2C]">
                  {autoPlay ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
          </SettingsCard>

          {/* AUTO NEXT SECTION */}
          <SettingsCard
            title="Auto Next Lesson"
            desc="Move to the next lesson automatically after completing the current one"
            icon={<FiSkipForward className="w-5 h-5 text-[#8FAF9A]" />}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-[#5F6B63]">
                <FiInfo className="w-4 h-4" />
                <span>
                  When enabled, you'll progress seamlessly through lessons
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E2E8E3] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8FAF9A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E8B57]"></div>
                <span className="ml-3 text-sm font-medium text-[#2C2C2C]">
                  {autoNext ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
          </SettingsCard>

          {/* INFO SECTION */}
          <div className="bg-gradient-to-r from-[#8FAF9A]/5 to-transparent rounded-xl p-4 border border-[#E2E8E3]">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#8FAF9A]/10 flex items-center justify-center">
                  <FiInfo className="w-4 h-4 text-[#8FAF9A]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[#2C2C2C]">
                  Settings saved automatically
                </p>
                <p className="text-xs text-[#5F6B63] mt-1">
                  Your preferences are saved locally and will persist across
                  sessions. Changes take effect immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
