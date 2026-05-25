import { useEffect, useState } from "react";

const Loader = ({
  fullScreen = true,
  size = "md",
  text = "Loading...",
  color = "primary",
  showText = true,
  overlay = true,
  delay = 0,
}) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!show) return null;

  const colors = {
    primary: "border-[#8FAF9A]",
    emerald: "border-[#2E8B57]",
    white: "border-white",
    accent: "border-[var(--accent)]",
  };

  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-14 w-14 border-[3px]",
    xl: "h-20 w-20 border-4",
  };

  const containerClasses = fullScreen
    ? `fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        overlay ? "bg-white/80 dark:bg-[var(--bg)]/80 backdrop-blur-sm" : ""
      }`
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Spinner */}
        <div
          className={`
            ${sizes[size]}
            rounded-full
            border-t-transparent
            ${colors[color]}
            animate-spin
            mx-auto
            transition-all duration-200
          `}
          role="status"
          aria-label="Sihan"
        >
          <span className="sr-only">{text}</span>
        </div>

        {/* Loading Text */}
        {showText && text && (
          <div className="mt-4 space-y-1">
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              {text}
            </p>

            {/* Animated dots for longer loads */}
            <div className="flex items-center justify-center gap-1">
              <div className="w-1 h-1 rounded-full bg-[#8FAF9A] dark:bg-[var(--accent)] animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-[#8FAF9A] dark:bg-[var(--accent)] animate-pulse delay-100" />
              <div className="w-1 h-1 rounded-full bg-[#8FAF9A] dark:bg-[var(--accent)] animate-pulse delay-200" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
