import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiPlayCircle,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient - Stays consistent regardless of theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E8B57] to-[#1a5c3a] z-0" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-6 transition-all duration-200">
          <FiStar className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-xs font-medium text-white">
            Trusted by 10,000+ learners
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Start Your English
          <span className="block text-yellow-300">Journey Today</span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-base sm:text-lg text-green-100 dark:text-green-50 max-w-2xl mx-auto transition-colors duration-200">
          Join EnglishSpeakPro and improve your speaking confidence with
          interactive lessons, audio practice, and personalized feedback.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/topics"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              bg-white
              text-[#2E8B57]
              hover:bg-green-50
              dark:hover:bg-white/90
              px-6
              py-3
              rounded-xl
              font-semibold
              text-base
              transition-all
              duration-200
              shadow-lg
              hover:shadow-xl
              hover:scale-[1.02]
              focus:outline-none
              focus:ring-2
              focus:ring-white
              focus:ring-offset-2
              focus:ring-offset-[#2E8B57]
            "
          >
            <span>Get Started Free</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            to="/pricing"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              bg-transparent
              border-2
              border-white
              text-white
              hover:bg-white/10
              dark:hover:bg-white/15
              px-6
              py-3
              rounded-xl
              font-semibold
              text-base
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-white
              focus:ring-offset-2
              focus:ring-offset-[#2E8B57]
            "
          >
            <FiPlayCircle className="w-4 h-4" />
            <span>View Pricing</span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 pt-4">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/15 flex items-center justify-center transition-all duration-200 group-hover:bg-white/20">
              <FiTrendingUp className="w-4 h-4 text-green-200 dark:text-green-100" />
            </div>
            <div className="text-left">
              <p className="text-xs text-green-200 dark:text-green-100 transition-colors duration-200">
                Average Score
              </p>
              <p className="text-sm font-semibold text-white">
                95% Improvement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/15 flex items-center justify-center transition-all duration-200 group-hover:bg-white/20">
              <FiStar className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="text-left">
              <p className="text-xs text-green-200 dark:text-green-100 transition-colors duration-200">
                User Rating
              </p>
              <p className="text-sm font-semibold text-white">
                4.9/5 (2k+ reviews)
              </p>
            </div>
          </div>
        </div>

        {/* Free Trial Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-black/20 dark:bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 transition-all duration-200">
          <span className="text-xs text-green-200 dark:text-green-100">✨</span>
          <span className="text-xs text-white">
            No credit card required • 7-day free trial
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
