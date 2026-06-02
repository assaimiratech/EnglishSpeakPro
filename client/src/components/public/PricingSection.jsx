import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
// framer-motion removed to reduce startup bundle and improve load

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    let cacheUsed = false;

    try {
      const cache = sessionStorage.getItem("settings_cache");
      if (cache) {
        const parsed = JSON.parse(cache);
        const age = Date.now() - parsed._ts;
        if (age < 1000 * 60 * 5) {
          setSettings(parsed.data);
          cacheUsed = true;
        }
      }

      const data = await getSettings();
      setSettings(data);
      try {
        sessionStorage.setItem(
          "settings_cache",
          JSON.stringify({ _ts: Date.now(), data }),
        );
      } catch (e) {
        // ignore storage errors
      }
    } catch (err) {
      console.log("Settings load failed");
    } finally {
      setLoading(false);
      if (cacheUsed) {
        // keep the initial cached UI while the API fetch resolves
        setLoading(false);
      }
    }
  };

  // while settings load, show a lightweight skeleton to improve perceived performance
  if (loading || !settings) {
    return (
      <section className="py-12 bg-gradient-to-b from-[#F7F9F7] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mx-auto w-3/5 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto w-2/3 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="h-64 bg-white rounded-2xl shadow-sm animate-pulse" />
            <div className="h-64 bg-white rounded-2xl shadow-sm animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const {
    coursePrice: price = 0,
    currency = "LKR",
    discount = {},
    discountEnabled: rawDiscountEnabled,
    discountType: rawDiscountType,
    discountValue: rawDiscountValue,
  } = settings || {};

  const {
    enabled: discountEnabled,
    type: discountType,
    value: discountValue,
  } = discount || {
    enabled: rawDiscountEnabled,
    type: rawDiscountType,
    value: rawDiscountValue,
  };

  const normalizedDiscountEnabled = Boolean(discountEnabled);
  const normalizedDiscountType = discountType || "percentage";
  const normalizedDiscountValue = Number(discountValue || 0);

  const { finalPrice, discountText } = (function computePricing() {
    let f = price;
    let text = null;
    if (normalizedDiscountEnabled && normalizedDiscountValue > 0) {
      if (normalizedDiscountType === "percentage") {
        f = price - (price * normalizedDiscountValue) / 100;
        text = `${normalizedDiscountValue}% OFF`;
      } else {
        f = price - normalizedDiscountValue;
        text = `${currency} ${normalizedDiscountValue} OFF`;
      }
    }
    return { finalPrice: f, discountText: text };
  })();

  const freeFeatures = [
    { text: "Limited conversation topics", icon: <FiCheckCircle /> },
  ];

  const premiumFeatures = ["Unlimited conversation topics"];

  const user = (function getUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();

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
    <>
      <section
        id="pricing"
        className="py-5 md:py-5 lg:py-5 bg-gradient-to-b from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] transition-colors duration-200"
      >
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* FREE PLAN */}
            <div
              onMouseEnter={() => setHoveredPlan("free")}
              onMouseLeave={() => setHoveredPlan(null)}
              className="flex"
            >
              <div
                className={`
                relative w-full bg-white dark:bg-[var(--card)] rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col pt-8
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

                {/* Price - Fixed height to match premium */}
                <div className="p-6 text-left pt-0 min-h-[130px] mt-10">
                  <div className="text-5xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                    0
                    <span className="text-sm font-normal text-[#5F6B63] dark:text-[var(--muted)] ml-1">
                      LKR /Month
                    </span>
                  </div>
                </div>

                {/* Features - Fixed height container */}
                <div className="p-6 flex-grow min-h-[100px] pt-0">
                  <div className="space-y-4">
                    {freeFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-sm text-[#5F6B63] dark:text-[var(--muted)] h-8"
                      >
                        <span className="text-[#2E8B57] dark:text-[var(--accent)] w-5">
                          {feature.icon}
                        </span>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() => navigate("/topics")}
                    className="w-full py-3 rounded-xl font-medium bg-[#363a38] dark:bg-[var(--surface)] text-white dark:text-white transition-all duration-200 hover:opacity-90"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* PREMIUM PLAN */}
            <div
              onMouseEnter={() => setHoveredPlan("premium")}
              onMouseLeave={() => setHoveredPlan(null)}
              className="flex"
            >
              <div
                className={`
                relative w-full bg-white dark:bg-[var(--card)] rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col
                ${
                  hoveredPlan === "premium"
                    ? "shadow-2xl -translate-y-1 border-[#2E8B57]"
                    : "shadow-lg border-[#E2E8E3] dark:border-[var(--border)]"
                }
              `}
              >
                {/* Discount */}
                {discountEnabled && discountText && (
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
                <div className="p-6 md:p-6 text-left bg-[#2E8B57] text-white flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-[#ffffff] dark:text-white">
                    {user?.isPremium ? "Current Plan" : "Premium Plan"}
                  </h3>

                  {/* Original Price */}

                  {/* Final Price - Fixed height to match free plan */}
                  <div className="min-h-[130px] mt-6">
                    <div className="text-5xl md:text-6xl font-bold text-[#ffffff] dark:text-[var(--text)] mt-2">
                      {finalPrice.toLocaleString()}
                      <span className="text-sm font-normal text-[#ffffff] ml-1">
                        LKR /Month
                      </span>
                    </div>

                    {/* Savings */}
                    {/* {discountEnabled && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-green-50/20 dark:bg-green-900/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                        <FiTrendingUp className="w-3 h-3" />
                        <span className="text-sm line-through text-[#ffffff] dark:text-[#da1a1a] opacity-80">
                          {currency} {price.toLocaleString()}
                        </span>
                      </div>
                    )} */}
                  </div>

                  {/* Features - Fixed height container */}
                  <div className="mt-6 text-left text-white flex-grow min-h-[100px]">
                    <div className="space-y-3">
                      {premiumFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 h-8"
                        >
                          <FiCheckCircle className="w-4 h-4 text-[#ffffff]  flex-shrink-0 w-5" />
                          <span className="text-sm text-[#ffffff]">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {/* Additional features to match free plan structure */}
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
            </div>
          </div>
        </div>

        {/* Modal */}
        <RequestPremiumModal isOpen={open} onClose={() => setOpen(false)} />
      </section>
    </>
  );
};

export default memo(PricingSection);
