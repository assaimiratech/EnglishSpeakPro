import { useEffect, useState } from "react";
import { getTopics } from "../../api/topics.api";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiStar,
  FiBookOpen,
  FiTrendingUp,
  FiLoader,
  FiAlertCircle,
  FiChevronRight,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { HiOutlineLockOpen } from "react-icons/hi2";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (err) {
        setError(err.message || "Failed to load topics");
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleClick = (topic) => {
    const locked = topic.isPremium && !user?.isPremium;
    if (locked) {
      navigate("/pricing");
    } else {
      navigate(`/lessons/${topic._id}`, {
        state: { topicTitle: topic.title },
      });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E2E8E3] dark:border-[var(--border)] border-t-[#2E8B57] dark:border-t-[var(--accent)] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <HiSparkles className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)] animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-[#5F6B63] dark:text-[var(--muted)] font-medium transition-colors duration-200">
          Loading amazing topics...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4 transition-colors duration-200">
          <FiAlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#2E8B57] dark:bg-[var(--accent)] text-white rounded-xl text-sm hover:bg-[#257149] transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F7] via-white to-[#F7F9F7] dark:from-[var(--surface)] dark:via-[var(--bg)] dark:to-[var(--surface)] relative overflow-hidden transition-colors duration-200">
      {/* Animated Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8FAF9A]/20 to-transparent dark:from-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#2E8B57]/10 to-transparent dark:from-[var(--accent)]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8FAF9A]/5 dark:bg-[var(--accent)]/5 rounded-full blur-2xl" />

      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#2E8B57] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-[var(--card)]/80 backdrop-blur-sm border border-[#E2E8E3] dark:border-[var(--border)] rounded-full px-4 py-2 mb-6 shadow-sm transition-colors duration-200"
          >
            <HiSparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              Learn at Your Pace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#2C2C2C] to-[#2E8B57] dark:from-[var(--text)] dark:to-[var(--accent)] bg-clip-text text-transparent"
          >
            Choose Your Topic
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-20 h-1 bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] rounded-full mx-auto mt-4 mb-5"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-[#5F6B63] dark:text-[var(--muted)] max-w-2xl mx-auto transition-colors duration-200"
          >
            Select a topic to begin your English learning adventure. Premium
            topics unlock exclusive content and advanced lessons.
          </motion.p>
        </div>

        {/* Topics Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8FAF9A]/20 to-[#8FAF9A]/5 dark:from-[var(--accent)]/20 dark:to-[var(--accent)]/5 flex items-center justify-center transition-colors duration-200">
                <FiBookOpen className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  All Topics
                </h2>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                  Learn step by step with interactive lessons
                </p>
              </div>
            </div>

            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-[#E2E8E3] to-transparent dark:from-[var(--border)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, idx) => {
              const isLocked = topic.isPremium && !user?.isPremium;

              return (
                <TopicCard
                  key={topic._id}
                  topic={topic}
                  isLocked={isLocked}
                  isPremium={topic.isPremium}
                  onClick={() => handleClick(topic)}
                  index={idx}
                  onHover={setHoveredCard}
                  isHovered={hoveredCard === topic._id}
                  user={user}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Premium Upgrade Banner */}
        {!user?.isPremium && topics.some((t) => t.isPremium) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-900/30 shadow-lg transition-colors duration-200"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <FiZap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Unlock Premium Topics
                  </p>
                  <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                    Get access to all premium content and advanced lessons
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Upgrade Now →
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {topics.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm transition-colors duration-200"
          >
            <div className="w-20 h-20 rounded-full bg-[#F1F4F1] dark:bg-[var(--surface)] flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
              <FiBookOpen className="w-10 h-10 text-[#8FAF9A] dark:text-[var(--accent)]" />
            </div>
            <p className="text-[#2C2C2C] dark:text-[var(--text)] font-medium transition-colors duration-200">
              No topics available yet
            </p>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Check back soon for new content!
            </p>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

// Premium Topic Card Component with enhanced design and dark mode support
const TopicCard = ({
  topic,
  isLocked,
  isPremium,
  onClick,
  index,
  onHover,
  isHovered,
  user,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => onHover?.(topic._id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={onClick}
      className={`
        group relative cursor-pointer rounded-2xl transition-all duration-300
        ${
          isPremium && !isLocked
            ? " bg-white dark:bg-[var(--card)] from-amber-50 via-white dark:from-amber-950/30 dark:via-[var(--card)] dark:to-yellow-950/30 shadow-lg hover:shadow-xl"
            : isPremium && isLocked
              ? "bg-gray-50 dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)]"
              : "bg-white dark:bg-[var(--card)] border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-lg"
        }
        ${!isLocked ? "hover:border-[#8FAF9A] dark:hover:border-[var(--accent)]" : ""}
      `}
    >
      {/* Premium Glow Effect */}
      {isPremium && !isLocked && (
        <div className="absolute -inset-0.5 from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
      )}

      <div className="p-5 relative">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            animate={
              isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.4 }}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${
                isPremium
                  ? "bg-gradient-to-br from-yellow-400 to-amber-400 shadow-md"
                  : "bg-gradient-to-br from-[#8FAF9A]/20 to-[#8FAF9A]/10 dark:from-[var(--accent)]/20 dark:to-[var(--accent)]/10"
              }
            `}
          >
            {isPremium ? (
              isLocked ? (
                <FiLock className="w-6 h-6 text-white" />
              ) : (
                <HiOutlineLockOpen className="w-6 h-6 text-white" />
              )
            ) : (
              <FiBookOpen className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)]" />
            )}
          </motion.div>

          {/* Premium Badge */}
          {isPremium && (
            <motion.div
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
            >
              <FiStar className="w-3 h-3" />
              <span>Premium</span>
            </motion.div>
          )}
        </div>

        {/* Title */}
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2C2C2C] dark:text-[var(--text)] leading-relaxed whitespace-normal break-words">
          {topic.title}
        </p>

        {/* <h3 className="text-lg font-bold text-[#2C2C2C] dark:text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[#2E8B57] dark:group-hover:text-[var(--accent)] transition-colors">
          {topic.title}
        </h3> */}

        {/* Description */}
        <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] line-clamp-2 mb-3 transition-colors duration-200">
          {topic.description ||
            `Master the topic with interactive questions and audio practice`}
        </p>

        {/* Lesson Count & Info */}
        <div className="flex items-center gap-3 text-xs text-[#5F6B63] dark:text-[var(--muted)]">
          <div className="flex items-center gap-1">
            <FiTrendingUp className="w-3 h-3" />
            <span>{topic.lessonCount ?? 0} lessons</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#E2E8E3] dark:bg-[var(--border)]" />
          <div className="flex items-center gap-1">
            <HiSparkles className="w-3 h-3" />
            <span>Interactive</span>
          </div>
        </div>

        {/* Progress Bar */}
        {!isLocked && topic.progress !== undefined && topic.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#5F6B63] dark:text-[var(--muted)]">
                Progress
              </span>
              <span className="text-[#2E8B57] dark:text-[var(--accent)] font-medium">
                {topic.progress}%
              </span>
            </div>
            <div className="h-1.5 bg-[#E2E8E3] dark:bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topic.progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] dark:from-[var(--accent)] dark:to-[#257149] rounded-full"
              />
            </div>
          </div>
        )}

        {/* Arrow Indicator on Hover */}
        {!isLocked && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            className="absolute bottom-5 right-5"
          >
            <div className="w-8 h-8 rounded-full bg-[#2E8B57] dark:bg-[var(--accent)] flex items-center justify-center shadow-md group-hover:bg-[#1a5c3a] dark:group-hover:bg-[#257149] transition-colors">
              <FiChevronRight className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        {/* Lock Overlay for Premium Locked */}
        {isLocked && isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            className="absolute inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FiLock className="text-yellow-400 text-4xl mb-2" />
            </motion.div>
            <p className="text-sm font-semibold text-white">Premium Locked</p>
            <p className="text-xs text-yellow-300 mt-1">Upgrade to unlock</p>
            <button className="mt-3 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-lg font-medium hover:from-yellow-600 hover:to-amber-600 transition-all duration-200">
              Upgrade →
            </button>
          </motion.div>
        )}

        {/* Hover Glow Effect */}
        {!isLocked && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#97c5a7]/0 via-[#8FAF9A]/5 to-[#8FAF9A]/0 dark:via-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};

export default Topics;
