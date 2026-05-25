import { FiStar, FiUsers, FiAward, FiMessageCircle } from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Ahamed",
    text: "My English confidence improved within weeks. The audio lessons made it so easy to practice anytime, anywhere.",
    role: "Business Professional",
    rating: 5,
    location: "Colombo, Sri Lanka",
  },
  {
    name: "Fathima",
    text: "The audio lessons are extremely practical. I finally feel confident speaking English at work and in daily conversations.",
    role: "University Student",
    rating: 5,
    location: "Kandy, Sri Lanka",
  },
];

const TestimonialSection = () => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#8FAF9A]/10 dark:bg-[#8FAF9A]/20 flex items-center justify-center transition-colors duration-200">
              <FiUsers className="w-6 h-6 text-[#8FAF9A] dark:text-[var(--accent)]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2C2C] dark:text-[var(--text)] tracking-tight transition-colors duration-200">
            Student Success Stories
          </h2>
          <div className="w-16 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mx-auto mt-3 mb-4 transition-colors duration-200"></div>
          <p className="text-sm sm:text-base text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Join thousands of learners who transformed their English speaking
            skills
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                bg-white
                dark:bg-[var(--card)]
                border
                border-[#E2E8E3]
                dark:border-[var(--border)]
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                dark:hover:shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity duration-300">
                <FaQuoteRight className="w-12 h-12 text-[#2E8B57] dark:text-[var(--accent)]" />
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(item.rating)}
              </div>

              {/* Testimonial Text */}
              <p className="text-[#2C2C2C] dark:text-[var(--text)] leading-relaxed relative z-10 transition-colors duration-200">
                <FaQuoteLeft className="w-3.5 h-3.5 inline mr-1 text-[#8FAF9A] dark:text-[var(--accent)] opacity-50" />
                {item.text}
                <FaQuoteRight className="w-3.5 h-3.5 inline ml-1 text-[#8FAF9A] dark:text-[var(--accent)] opacity-50" />
              </p>

              {/* Author Info */}
              <div className="mt-4 pt-3 border-t border-[#E2E8E3] dark:border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                      {item.role}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiMessageCircle className="w-3 h-3 text-[#8FAF9A] dark:text-[var(--accent)]" />
                    <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8FAF9A]/0 to-[#2E8B57]/0 dark:from-[var(--accent)]/0 dark:to-[var(--accent)]/0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-10 md:mt-12">
          <div className="inline-flex items-center gap-2 bg-[#F1F4F1] dark:bg-[var(--card)] rounded-full px-4 py-2 transition-all duration-200 hover:shadow-md group cursor-default">
            <FiAward className="w-4 h-4 text-[#2E8B57] dark:text-[var(--accent)] group-hover:scale-110 transition-transform duration-200" />
            <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Rated 4.9/5 by 2,000+ students worldwide
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className="w-3 h-3 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
