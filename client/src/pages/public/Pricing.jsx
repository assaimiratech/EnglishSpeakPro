import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiStar,
  FiZap,
  FiAward,
  FiTrendingUp,
  FiHeadphones,
  FiBookOpen,
  FiMessageCircle,
  FiDownload,
  FiShield,
  FiClock,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { getSettings } from "../../api/settings.api";
import RequestPremiumModal from "../../components/layout/RequestPremiumModal";

const Pricing = () => {
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState("monthly");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res);
    } catch (err) {
      console.log("Failed to load pricing");
    }
  };

  if (!settings)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] transition-colors duration-200">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#E2E8E3] dark:border-[var(--border)] border-t-[#2E8B57] dark:border-t-[var(--accent)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiStar className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)] animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-[#5F6B63] dark:text-[var(--muted)] font-medium transition-colors duration-200">
            Loading premium plans...
          </p>
        </div>
      </div>
    );

  const price = settings.coursePrice || 0;
  const currency = settings.currency || "LKR";
  const discount = settings.discount;

  let finalPrice = price;
  let discountText = null;
  let savingsPercent = null;

  if (discount?.enabled) {
    if (discount.type === "percentage") {
      finalPrice = price - (price * discount.value) / 100;
      discountText = `${discount.value}% OFF`;
      savingsPercent = discount.value;
    } else {
      finalPrice = price - discount.value;
      discountText = `${currency} ${discount.value} OFF`;
      savingsPercent = Math.round((discount.value / price) * 100);
    }
  }

  // Monthly vs Yearly pricing simulation
  const monthlyPrice = finalPrice;
  const yearlyPrice = Math.round(finalPrice * 10); // 2 months free
  const yearlySavings = Math.round(
    ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100,
  );

  const freeFeatures = [
    { icon: <FiBookOpen className="w-4 h-4" />, text: "Basic lessons" },
    {
      icon: <FiHeadphones className="w-4 h-4" />,
      text: "Limited audio access",
    },
    {
      icon: <FiMessageCircle className="w-4 h-4" />,
      text: "Basic speaking practice",
    },
  ];

  const premiumFeatures = [
    {
      icon: <FiCheckCircle className="w-4 h-4" />,
      text: "Unlimited lessons & topics",
    },
    {
      icon: <FiHeadphones className="w-4 h-4" />,
      text: "Full audio library access",
    },
    {
      icon: <FiMessageCircle className="w-4 h-4" />,
      text: "Advanced pronunciation coach",
    },
    {
      icon: <FiZap className="w-4 h-4" />,
      text: "Priority support & feedback",
    },
  ];

  const handleRequestPremium = () => {
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F7] via-white to-[#F7F9F7] dark:from-[var(--surface)] dark:via-[var(--bg)] dark:to-[var(--surface)] overflow-hidden relative transition-colors duration-200">
      {/* Animated Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8FAF9A]/20 to-transparent dark:from-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#2E8B57]/10 to-transparent dark:from-[var(--accent)]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-3xl" />

      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#2E8B57] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full animate-float-delayed" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-[var(--card)]/80 backdrop-blur-sm border border-[#E2E8E3] dark:border-[var(--border)] rounded-full px-4 py-2 mb-6 shadow-sm transition-colors duration-200"
          >
            <FiZap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              Limited Time Offer
            </span>
            {discount?.enabled && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1 animate-pulse">
                {discountText}
              </span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#2C2C2C] to-[#2E8B57] dark:from-[var(--text)] dark:to-[var(--accent)] bg-clip-text text-transparent"
          >
            Choose Your Path to Fluency
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
            Start your English journey today.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onMouseEnter={() => setHoveredPlan("free")}
            onMouseLeave={() => setHoveredPlan(null)}
            className="flex-1 max-w-sm mx-auto w-full"
          >
            <div
              className={`
              relative h-full bg-white dark:bg-[var(--card)] rounded-2xl border transition-all duration-300 overflow-hidden
              ${
                hoveredPlan === "free"
                  ? "shadow-xl -translate-y-1 border-[#8FAF9A] dark:border-[var(--accent)]"
                  : "shadow-lg border-[#E2E8E3] dark:border-[var(--border)]"
              }
            `}
            >
              {/* Card Header */}
              <div className="p-6 text-center border-b border-[#E2E8E3] dark:border-[var(--border)] bg-gradient-to-br from-gray-50 to-white dark:from-[var(--surface)] dark:to-[var(--card)] transition-colors duration-200">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[var(--surface)] flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                  <FiBookOpen className="w-8 h-8 text-gray-400 dark:text-[var(--muted)]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Free Plan
                </h2>
                <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-2 transition-colors duration-200">
                  Perfect for beginners
                </p>
              </div>

              {/* Price */}
              <div className="p-6 text-center border-b border-[#E2E8E3] dark:border-[var(--border)]">
                <div className="text-4xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  FREE
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                  No credit card required
                </p>
              </div>

              {/* Features */}
              <div className="p-6 flex-1">
                <div className="space-y-3">
                  {freeFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200"
                    >
                      <span className="text-[#8FAF9A] dark:text-[var(--accent)]">
                        {feature.icon}
                      </span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <div className="p-6 pt-0">
                <button className="w-full py-3 rounded-xl font-medium bg-gray-100 dark:bg-[var(--surface)] text-gray-500 dark:text-[var(--muted)] cursor-not-allowed transition-colors duration-200">
                  Current Plan
                </button>
              </div>
            </div>
          </motion.div>

          {/* PREMIUM PLAN - Highlighted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onMouseEnter={() => setHoveredPlan("premium")}
            onMouseLeave={() => setHoveredPlan(null)}
            className="flex-1 max-w-sm mx-auto w-full relative"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FiStar className="w-3 h-3" />
                MOST POPULAR
              </div>
            </div>

            {/* Premium Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-100 to-amber-200 dark:from-yellow-300 dark:to-amber-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

            <div
              className={`
              relative h-full bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-amber-950/30 dark:via-[var(--card)] dark:to-yellow-950/30 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 transition-all duration-300 overflow-hidden
              ${hoveredPlan === "premium" ? "shadow-2xl -translate-y-2" : "shadow-xl"}
            `}
            >
              {/* Card Header */}
              <div className="p-6 text-center border-b border-yellow-100 dark:border-yellow-500/30 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-[var(--card)] transition-colors duration-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiZap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
                  Premium Plan
                </h2>
                <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-2 transition-colors duration-200">
                  Unlock everything
                </p>
              </div>

              {/* Price */}
              <div className="p-6 text-center border-b border-yellow-100 dark:border-yellow-900/30">
                {discount?.enabled && (
                  <div className="mb-2">
                    <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                      {currency} {price}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    {currency}
                  </span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
                    {selectedBilling === "monthly" ? finalPrice : yearlyPrice}
                  </span>
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                  {selectedBilling === "monthly"
                    ? "per month"
                    : "per year (2 months free)"}
                </p>
                {discount?.enabled && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold px-2 py-1 rounded-full transition-colors duration-200">
                    <FiTrendingUp className="w-3 h-3" />
                    {discountText}
                  </div>
                )}
                {selectedBilling === "yearly" && yearlySavings > 0 && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium transition-colors duration-200">
                    Save {yearlySavings}% compared to monthly
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="p-6 flex-1">
                <div className="space-y-3">
                  {premiumFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="text-[#2E8B57] dark:text-[var(--accent)]">
                        {feature.icon}
                      </span>
                      <span className="text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestPremium}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiZap className="w-4 h-4" />
                  Get Premium Access
                  <FiTrendingUp className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Modal */}
      <RequestPremiumModal isOpen={open} onClose={() => setOpen(false)} />

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

export default Pricing;
