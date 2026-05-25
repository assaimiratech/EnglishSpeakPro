import { FiTrendingUp, FiAward } from "react-icons/fi";

const ProgressBar = ({
  value,
  showLabel = false,
  showPercentage = false,
  size = "md",
  animated = true,
  label = "Progress",
}) => {
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  };

  const getProgressColor = () => {
    if (value >= 80) return "bg-[#2E8B57]";
    if (value >= 50) return "bg-[#8FAF9A]";
    if (value >= 20) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && (
            <div className="flex items-center gap-1.5">
              <FiTrendingUp className="w-3.5 h-3.5 text-[#8FAF9A]" />
              <span className="text-xs font-medium text-[#5F6B63]">
                {label}
              </span>
            </div>
          )}
          {showPercentage && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#2E8B57]">
                {Math.round(value)}%
              </span>
              {value >= 100 && (
                <FiAward className="w-3.5 h-3.5 text-yellow-500" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Track */}
      <div
        className={`w-full ${sizes[size]} bg-[#E2E8E3] rounded-full overflow-hidden`}
      >
        <div
          className={`
            h-full
            ${getProgressColor()}
            rounded-full
            ${animated ? "transition-all duration-500 ease-out" : ""}
            relative
            overflow-hidden
          `}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          {/* Shine effect on progress bar (optional) */}
          {animated && value > 0 && value < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Milestone indicators (optional) */}
      {showPercentage && value >= 25 && value < 50 && (
        <p className="text-xs text-[#5F6B63] mt-1.5">
          Great start! Keep going! 🎯
        </p>
      )}
      {value >= 50 && value < 75 && (
        <p className="text-xs text-[#5F6B63] mt-1.5">
          Halfway there! You're doing great! 💪
        </p>
      )}
      {value >= 75 && value < 100 && (
        <p className="text-xs text-[#5F6B63] mt-1.5">
          Almost complete! Final stretch! 🌟
        </p>
      )}
      {value >= 100 && (
        <p className="text-xs text-[#2E8B57] font-medium mt-1.5 flex items-center gap-1">
          <FiAward className="w-3.5 h-3.5" />
          Complete! Great job! 🎉
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
