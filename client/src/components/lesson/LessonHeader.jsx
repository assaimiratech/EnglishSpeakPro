import { FiBookOpen, FiTrendingUp, FiAward } from "react-icons/fi";

const LessonHeader = ({ topicTitle, current, total, progress = null }) => {
  const progressPercentage = progress || (current / total) * 100;

  return (
    <div className="mb-3 md:mb-1">
      {/* Topic Badge */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg bg-[#8FAF9A]/10 flex items-center justify-center">
          <FiBookOpen className="w-3.5 h-3.5 text-[#8FAF9A]" />
        </div>
        <span className="text-xs font-medium text-[#8FAF9A] uppercase tracking-wide">
          {topicTitle}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#2C2C2C] tracking-tight">
        Question {current} of {total}
      </h1>
    </div>
  );
};

export default LessonHeader;
