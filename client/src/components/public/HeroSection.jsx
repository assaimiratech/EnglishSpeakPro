import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlayCircle,
  FiTrendingUp,
  FiUsers,
  FiArrowRight,
  FiHeadphones,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";

const HeroSection = () => {
  const navigate = useNavigate();

  const [typedText, setTypedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ["Speaking Naturally", "Confidently", "Fluently", "Like a Pro"];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setTypedText(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      if (charIndex < currentWord.length) {
        const timer = setTimeout(() => {
          setTypedText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsDeleting(true), pauseTime);
        return () => clearTimeout(timer);
      }
    }
  }, [charIndex, isDeleting, wordIndex]);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const stats = [
    {
      label: "Active Learners",
      value: "10,000+",
      icon: FiUsers,
      color: "text-[#8FAF9A]",
    },
    {
      label: "Success Rate",
      value: "95%",
      subtext: "Improvement",
      icon: FiTrendingUp,
      color: "text-[#2E8B57]",
    },
    {
      label: "User Rating",
      value: "4.9/5",
      subtext: "(2k+ reviews)",
      icon: FiStar,
      color: "text-yellow-500",
    },
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  const handleBtnClick = () => {
    if (!user) {
      navigate("/login");
      return;
    } else {
      navigate("/topics");
    }
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] py-16 md:py-15 lg:py-15 transition-colors duration-200">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#2E8B57]/10 dark:bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#8FAF9A]/5 to-[#2E8B57]/5 dark:from-[var(--accent)]/5 dark:to-[var(--accent)]/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white dark:bg-[var(--card)] border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm rounded-full px-4 py-1.5 mb-6 transition-all duration-200 hover:shadow-md ${animated ? "animate-fade-in" : "opacity-0"}`}
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-medium text-[#2C2C2C] dark:text-[var(--text)]">
            The Easy Way to Master English
          </span>
          <FiChevronRight className="w-3 h-3 text-[#8FAF9A] dark:text-[var(--accent)]" />
        </div>

        {/* Main Heading */}
        <div className={`${animated ? "animate-fade-in-up" : "opacity-0"}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            Improve Your English
            <span className="block text-[#2E8B57] dark:text-[var(--accent)] mt-2 md:mt-3 h-24 sm:h-28 md:h-32 lg:h-36">
              {typedText}
              <span className="inline-block w-0.5 h-8 md:h-10 bg-[#2E8B57] dark:text-[var(--accent)] animate-blink ml-1 align-middle"></span>
            </span>
          </h1>
        </div>

        {/* Description */}
        <p
          className={`text-base sm:text-lg md:text-xl text-[#5F6B63] dark:text-[var(--muted)] mt-0 max-w-2xl mx-auto leading-relaxed transition-colors duration-200 ${animated ? "animate-fade-in-up animation-delay-100" : "opacity-0"}`}
        >
          Master real-world conversations through interactive practice sessions.
          Improve your fluency, build confidence, and speak English naturally.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mt-5 md:mt-10 ${animated ? "animate-fade-in-up animation-delay-200" : "opacity-0"}`}
        >
          <button
            onClick={handleBtnClick}
            className="
              group
              relative
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[#2E8B57]
              hover:bg-[#257149]
              dark:bg-[#2E8B57]
              dark:hover:bg-[#257149]
              text-white
              px-8
              py-3.5
              rounded-xl
              font-semibold
              text-base
              transition-all
              duration-200
              shadow-md
              hover:shadow-lg
              hover:scale-[1.02]
              focus:outline-none
              focus:ring-2
              focus:ring-[#2E8B57]
              dark:focus:ring-[var(--accent)]
              focus:ring-offset-2
              dark:focus:ring-offset-[var(--bg)]
              overflow-hidden
            "
          >
            <span className="relative z-10">Start Practice</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
