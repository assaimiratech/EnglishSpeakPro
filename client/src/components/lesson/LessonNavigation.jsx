import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const LessonNavigation = ({
  onNext,
  onPrev,
  disablePrev,
  disableNext,
  isLastLesson = false,
  showCompleteButton = false,
  onComplete,
}) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 pb-24">
      <button
        disabled={disablePrev}
        onClick={onPrev}
        className="
          group
          inline-flex
          items-center
          justify-center
          gap-2
          w-full sm:w-auto
          px-5
          py-3
          rounded-xl
          border
          border-[#E2E8E3]
          bg-white
          text-[#5F6B63]
          font-medium
          text-sm
          transition-all
          duration-200
          hover:bg-[#F1F4F1]
          hover:text-[#2C2C2C]
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <FiArrowLeft className="w-4 h-4" />
        Previous Lesson
      </button>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showCompleteButton && (
          <button
            onClick={onComplete}
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              w-full sm:w-auto
              px-5
              py-3
              rounded-xl
              bg-[#8FAF9A]
              hover:bg-[#7a9e86]
              text-white
              font-medium
              text-sm
              transition-all
              duration-200
            "
          >
            <FiCheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        )}

        <button
          disabled={disableNext}
          onClick={onNext}
          className="
            group
            inline-flex
            items-center
            justify-center
            gap-2
            w-full sm:w-auto
            px-5
            py-3
            rounded-xl
            bg-[#2E8B57]
            hover:bg-[#257149]
            text-white
            font-medium
            text-sm
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isLastLesson ? "Finish Course" : "Next Lesson"}
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LessonNavigation;
