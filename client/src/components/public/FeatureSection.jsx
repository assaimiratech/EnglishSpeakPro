import {
  FiHeadphones,
  FiMic,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiMessageCircle,
  FiSmile,
} from "react-icons/fi";
import { TbBrandGooglePodcasts } from "react-icons/tb";

const features = [
  {
    title: "Real-Life Conversations",
    desc: "Practice practical English for restaurants, interviews, shopping, travel, and daily situations.",
    icon: <FiMessageCircle className="w-6 h-6" />,
    color:
      "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Learn by Speaking",
    desc: "Improve fluency through interactive listening and speaking practice sessions.",
    icon: <FiMic className="w-6 h-6" />,
    color:
      "from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10",
    iconColor: "text-[#2E8B57] dark:text-[var(--accent)]",
  },
  {
    title: "Build Speaking Confidence",
    desc: "Practice anytime, anywhere and learn to speak English naturally in real conversations.",
    icon: <FiTrendingUp className="w-6 h-6" />,
    color:
      "from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];
const FeatureSection = () => {
  return (
    <section className="py-10 md:pb-10 lg:pb-10 bg-white dark:bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2C2C] dark:text-[var(--text)] tracking-tight transition-colors duration-200">
            Why Choose EnglishSpeakPro?
          </h2>
          <div className="w-16 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mx-auto mt-3 mb-4 transition-colors duration-200"></div>
          <p className="text-sm sm:text-base text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Everything you need to improve speaking confidence in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                p-6
                rounded-2xl
                bg-white
                dark:bg-[var(--card)]
                border
                border-[#E2E8E3]
                dark:border-[var(--border)]
                shadow-sm
                hover:shadow-md
                dark:hover:shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                overflow-hidden
              "
            >
              {/* Icon */}
              <div
                className={`
                w-12 h-12
                rounded-xl
                bg-gradient-to-br
                ${item.color}
                flex items-center justify-center
                mb-4
                transition-all
                duration-300
                group-hover:scale-110
              `}
              >
                <span
                  className={`${item.iconColor} transition-colors duration-200`}
                >
                  {item.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-[#2C2C2C] dark:text-[var(--text)] mb-2 transition-colors duration-200">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] leading-relaxed transition-colors duration-200">
                {item.desc}
              </p>

              {/* Decorative line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
