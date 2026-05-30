import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiShield,
  FiZap,
  FiBookOpen,
  FiHeadphones,
  FiMic,
} from "react-icons/fi";

import { getSettings } from "../../api/settings.api";
import RequestPremiumModal from "../layout/RequestPremiumModal";

const PricingSection = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.log("Settings load failed");
    }
  };

  if (!settings) return null;

  const price = settings.coursePrice || 0;
  const currency = settings.currency || "LKR";

  const discountEnabled = settings.discount?.enabled;
  const discountType = settings.discount?.type;
  const discountValue = settings.discount?.value;

  let finalPrice = price;
  let discountText = null;
  let discountPercentage = null;

  if (discountEnabled) {
    if (discountType === "percentage") {
      finalPrice = price - (price * discountValue) / 100;
      discountText = `${discountValue}% OFF`;
      discountPercentage = discountValue;
    } else {
      finalPrice = price - discountValue;
      discountText = `${currency} ${discountValue} OFF`;
    }
  }

  const freeFeatures = [
    {
      text: "Limited conversation topics",
      icon: <FiCheckCircle />,
    },
  ];

  const premiumFeatures = ["Unlimited conversation topics"];

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePremiumClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.isPremium) {
      navigate("/topics");
    } else {
      setOpen(true);
    }
  };
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#2E8B57]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
              <FiStar className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)]" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
            Choose Your Learning Plan
          </h2>

          <div className="w-16 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mx-auto mt-4 mb-4"></div>

          <p className="text-sm sm:text-base text-[#5F6B63] dark:text-[var(--muted)]">
            Start for free and upgrade anytime to unlock premium English
            learning features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-white">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setHoveredPlan("free")}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div
              className={`
                relative h-full bg-white dark:bg-[var(--card)] rounded-2xl border overflow-hidden transition-all duration-300
                ${
                  hoveredPlan === "free"
                    ? "shadow-xl -translate-y-1 border-[#8FAF9A] dark:border-[var(--accent)]"
                    : "shadow-md border-[#E2E8E3] dark:border-[var(--border)]"
                }
              `}
            >
              {/* Header */}
              <div className="p-6 text-left pb-3">
                <h3 className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                  Free Plan
                </h3>
              </div>
              {/* Price */}
              <div className="p-6 text-left pt-0">
                <div className="text-5xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                  0
                  <span className="text-sm font-normal text-[#5F6B63] dark:text-[var(--muted)]">
                    LKR /Month
                  </span>
                </div>
              </div>
              {/* Features */}
              <div className="p-6 flex-1 pt-3">
                <div className="space-y-4">
                  {freeFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-[#5F6B63] dark:text-[var(--muted)]"
                    >
                      <span className="text-[#2E8B57] dark:text-[var(--accent)]">
                        {feature.icon}
                      </span>

                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Button */}
              <div className="p-6 pt-10">
                <button
                  onClick={() => navigate("/topics")}
                  className="w-full py-3 rounded-xl font-medium bg-[#363a38] dark:bg-[var(--surface)] text-white dark:text-white transition-all duration-200 hover:opacity-90"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setHoveredPlan("premium")}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div
              className={`
                relative h-full bg-white dark:bg-[var(--card)] rounded-2xl border overflow-hidden transition-all duration-300
                ${
                  hoveredPlan === "premium"
                    ? "shadow-2xl -translate-y-1 border-[#2E8B57] dark:border-[var(--accent)]"
                    : "shadow-lg border-[#E2E8E3] dark:border-[var(--border)]"
                }
              `}
            >
              {/* Discount */}
              {discountEnabled && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 {discountText}
                  </div>
                </div>
              )}

              {/* Badge */}
              <div className="bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] px-4 py-2 text-left flex gap-2">
                <FiZap className="w-4 h-4 text-yellow-300" />

                <span className="text-white text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 text-left bg-[#2E8B57] text-white ">
                <h3 className="text-2xl font-bold text-[#ffffff] dark:text-white">
                  {user?.isPremium ? "Current Plan" : "Premium Plan"}
                </h3>

                {/* Original Price */}
                {discountEnabled && (
                  <div className="mt-6 text-sm line-through text-[#ffffff] dark:text-white">
                    {currency} {price.toLocaleString()}
                  </div>
                )}

                {/* Final Price */}
                <div className="text-5xl md:text-6xl font-bold text-[#ffffff] dark:text-[var(--text)] mt-2">
                  {finalPrice.toLocaleString()}
                  <span className="text-sm font-normal text-[#ffffff] dark:text-[var(--muted)]">
                    LKR /Month
                  </span>
                </div>

                {/* Savings */}
                {discountEnabled && discountPercentage && (
                  <div className="mt-3 inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-[#2E8B57] dark:text-[var(--accent)] text-xs font-medium px-3 py-1 rounded-full">
                    <FiTrendingUp className="w-3 h-3" />
                    <span>Save {discountPercentage}%</span>
                  </div>
                )}

                {/* Features */}
                <div className="mt-8 text-left text-white">
                  <div className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <FiCheckCircle className="w-4 h-4 text-[#ffffff] dark:text-[var(--accent)] flex-shrink-0" />

                        <span className="text-sm text-[#ffffff] dark:text-[var(--muted)]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePremiumClick}
                  className="
                    w-full
                    mt-8
                    bg-[#ffffff]
                    hover:bg-[#85cca6]
                    text-black
                    font-semibold
                    text-base
                    px-6
                    py-3.5
                    rounded-xl
                    transition-all
                    duration-200
                    shadow-md
                    hover:shadow-lg
                    hover:scale-[1.02]
                  "
                >
                  {user?.isPremium ? "Current Plan" : "Upgrade to Premium"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <RequestPremiumModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default PricingSection;
