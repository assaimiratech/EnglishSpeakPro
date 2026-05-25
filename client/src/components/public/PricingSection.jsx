import { useEffect, useState } from "react";
import {
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { getSettings } from "../../api/settings.api";
import RequestPremiumModal from "../layout/RequestPremiumModal";

const PricingSection = () => {
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(false);

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

  const features = ["Unlimited audio lessons", "Access to premium topics"];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#2E8B57]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
              <FiStar className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2C2C] dark:text-[var(--text)] tracking-tight transition-colors duration-200">
            Premium Access
          </h2>
          <div className="w-16 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mx-auto mt-3 mb-4 transition-colors duration-200"></div>
          <p className="text-sm sm:text-base text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Unlock all premium lessons and speaking practice to accelerate your
            English journey
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="relative bg-white dark:bg-[var(--card)] rounded-2xl shadow-lg border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
            {/* Discount Badge (top corner) */}
            {discountEnabled && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse-slow">
                  🔥 {discountText}
                </div>
              </div>
            )}

            {/* Premium Badge */}
            <div className="bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] dark:from-[var(--accent)] dark:to-[#257149] px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <FiZap className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            </div>

            {/* Pricing Content */}
            <div className="p-6 md:p-8 text-center">
              {/* Original Price */}
              {discountEnabled && (
                <div className="text-sm text-[#5F6B63] dark:text-[var(--muted)] line-through transition-colors duration-200">
                  {currency} {price.toLocaleString()}
                </div>
              )}

              {/* Final Price */}
              <div className="text-5xl md:text-6xl font-bold text-[#2C2C2C] dark:text-[var(--text)] mt-1 transition-colors duration-200">
                {currency} {finalPrice.toLocaleString()}
                <span className="text-sm font-normal text-[#5F6B63] dark:text-[var(--muted)]">
                  /lifetime
                </span>
              </div>

              {/* Savings Info */}
              {discountEnabled && discountPercentage && (
                <div className="mt-2 inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-[#2E8B57] dark:text-[var(--accent)] text-xs font-medium px-2 py-1 rounded-full transition-colors duration-200">
                  <FiTrendingUp className="w-3 h-3" />
                  <span>Save {discountPercentage}%</span>
                </div>
              )}

              {/* Features List */}
              <div className="mt-6 text-left">
                <p className="text-sm font-semibold text-[#2C2C2C] dark:text-[var(--text)] mb-3 transition-colors duration-200">
                  What's included:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <FiCheckCircle className="w-4 h-4 text-[#2E8B57] dark:text-[var(--accent)] flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setOpen(true)}
                className="
                  w-full
                  mt-8
                  bg-[#2E8B57]
                  hover:bg-[#257149]
                  dark:bg-[var(--accent)]
                  dark:hover:bg-[#257149]
                  text-white
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
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#2E8B57]
                  dark:focus:ring-[var(--accent)]
                  focus:ring-offset-2
                  dark:focus:ring-offset-[var(--bg)]
                "
              >
                Get Premium Access
              </button>

              {/* Money Back Guarantee */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                <FiShield className="w-3 h-3" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 group cursor-default">
              <FiAward className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                Trusted by 10,000+ learners
              </span>
            </div>
            <div className="w-px h-4 bg-[#E2E8E3] dark:bg-[var(--border)]" />
            <div className="flex items-center gap-2 group cursor-default">
              <span className="text-xs text-yellow-500">⭐ 4.9/5</span>
              <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                (2,000+ reviews)
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Have questions?{" "}
            <a
              href="/faq"
              className="text-[#2E8B57] dark:text-[var(--accent)] hover:underline transition-colors duration-200"
            >
              View our FAQ
            </a>
          </p>
        </div>
      </div>

      {/* Premium Modal */}
      <RequestPremiumModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default PricingSection;
