import { FiPlayCircle, FiClock, FiStar, FiChevronRight } from "react-icons/fi";

const LessonCard = ({ lesson, onClick }) => {
  // Determine difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-[#8FAF9A] bg-[#8FAF9A]/10";
    }
  };

  return (
    <div
      onClick={onClick}
      className="
        group
        bg-white
        border
        border-[#E2E8E3]
        rounded-xl
        p-4
        cursor-pointer
        transition-all
        duration-200
        hover:shadow-md
        hover:border-[#8FAF9A]
        hover:-translate-y-0.5
      "
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side - Main content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-[#2C2C2C] text-base leading-relaxed group-hover:text-[#2E8B57] transition-colors duration-200 line-clamp-2">
            {lesson.questionText}
          </h3>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Order */}
            <div className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-[#8FAF9A]" />
              <span className="text-xs text-[#5F6B63]">
                Lesson {lesson.order}
              </span>
            </div>

            {/* Difficulty */}
            {lesson.difficulty && (
              <span
                className={`
                inline-flex items-center gap-1
                text-xs font-medium px-2 py-0.5 rounded-full
                ${getDifficultyColor(lesson.difficulty)}
              `}
              >
                <FiStar className="w-3 h-3" />
                {lesson.difficulty}
              </span>
            )}

            {/* Duration */}
            {lesson.duration && (
              <div className="flex items-center gap-1.5">
                <FiPlayCircle className="w-3.5 h-3.5 text-[#8FAF9A]" />
                <span className="text-xs text-[#5F6B63]">
                  {lesson.duration} min
                </span>
              </div>
            )}
          </div>

          {/* Description (optional) */}
          {lesson.description && (
            <p className="text-sm text-[#5F6B63] mt-2 line-clamp-1">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Right side - Arrow indicator */}
        <div className="flex-shrink-0">
          <div
            className="
            w-8 h-8
            rounded-full
            bg-[#F1F4F1]
            flex items-center justify-center
            group-hover:bg-[#2E8B57]
            transition-all duration-200
          "
          >
            <FiChevronRight
              className="
              w-4 h-4
              text-[#5F6B63]
              group-hover:text-white
              transition-colors duration-200
            "
            />
          </div>
        </div>
      </div>

      {/* Premium Badge (optional) */}
      {lesson.isPremium && (
        <div className="mt-3 pt-3 border-t border-[#E2E8E3]">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-xs font-medium">
            <FiStar className="w-3 h-3" />
            Premium Lesson
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCard;
