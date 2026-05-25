import { FiBookOpen, FiTrendingUp, FiAward } from "react-icons/fi";

const LessonHeader = ({ topicTitle, current, total, progress = null }) => {
  const progressPercentage = progress || (current / total) * 100;

  return (
    <div className="mb-6 md:mb-8">
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
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
        Lesson {current} of {total}
      </h1>

      {/* Stats Row (optional) */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-2">
        <div className="flex items-center gap-1.5">
          <FiBookOpen className="w-3.5 h-3.5 text-[#8FAF9A]" />
          <span className="text-xs text-[#5F6B63]">
            Lesson {current} of {total}
          </span>
        </div>

        {current === total && (
          <div className="flex items-center gap-1.5 text-yellow-600">
            <FiAward className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Final Lesson</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonHeader;
