import { FiSettings, FiChevronRight } from "react-icons/fi";

const SettingsCard = ({
  title,
  desc,
  children,
  icon,
  onEdit,
  isActive = false,
}) => {
  return (
    <div
      className={`
        group
        bg-white
        rounded-2xl
        border
        transition-all
        duration-200
        overflow-hidden
        ${
          isActive
            ? "border-[#8FAF9A] shadow-md"
            : "border-[#E2E8E3] shadow-sm hover:shadow-md hover:border-[#8FAF9A]"
        }
      `}
    >
      {/* Header */}
      <div className="p-5 pb-3 border-b border-[#E2E8E3] bg-gradient-to-r from-white to-[#F7F9F7]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && (
                <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 flex items-center justify-center">
                  <span className="text-[#8FAF9A]">{icon}</span>
                </div>
              )}
              <h2 className="font-semibold text-lg text-[#2C2C2C]">{title}</h2>
            </div>
            <p className="text-sm text-[#5F6B63] leading-relaxed">{desc}</p>
          </div>

          {/* Edit Button (optional) */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="
                flex items-center gap-1
                text-xs font-medium
                text-[#2E8B57]
                hover:text-[#257149]
                transition-colors
                duration-200
                group/edit
              "
            >
              <span>Edit</span>
              <FiChevronRight className="w-3.5 h-3.5 group-hover/edit:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default SettingsCard;
