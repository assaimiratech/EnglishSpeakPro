import { useState, useEffect } from "react";
import {
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

const AnswerToggle = ({
  show,
  onToggle,
  answer,
  showCopyButton = false,
  className = "",
  animate = true,
  size = "md", // sm, md, lg
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy");
    }
  };

  const sizeClasses = {
    sm: {
      button: "px-3 py-1.5 text-xs",
      icon: "w-3 h-3",
      content: "p-3 text-xs",
    },
    md: {
      button: "px-4 py-2 text-sm",
      icon: "w-4 h-4",
      content: "p-4 text-sm",
    },
    lg: {
      button: "px-5 py-2.5 text-base",
      icon: "w-5 h-5",
      content: "p-5 text-base",
    },
  };

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToggle}
          className={`
            group
            inline-flex
            items-center
            gap-2
            ${sizeClasses[size].button}
            bg-white
            dark:bg-[var(--card)]
            border
            border-[#E2E8E3]
            dark:border-[var(--border)]
            rounded-xl
            text-[#2E8B57]
            dark:text-[var(--accent)]
            hover:text-[#257149]
            dark:hover:text-[var(--accent)]
            hover:bg-[#F1F4F1]
            dark:hover:bg-[var(--surface)]
            hover:border-[#8FAF9A]
            dark:hover:border-[var(--accent)]
            font-medium
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
            focus:outline-none
            focus:ring-2
            focus:ring-[#8FAF9A]
            dark:focus:ring-[var(--accent)]
            focus:ring-offset-2
            dark:focus:ring-offset-[var(--bg)]
          `}
          aria-expanded={show}
          aria-label={show ? "Hide answer" : "Show answer"}
        >
          {show ? (
            <>
              <FiEyeOff
                className={`${sizeClasses[size].icon} transition-transform duration-200`}
              />
              <span>Hide Answer</span>
              <FiChevronUp
                className={`${sizeClasses[size].icon} transition-transform duration-200 ${animate ? "rotate-0" : ""}`}
              />
            </>
          ) : (
            <>
              <FiEye
                className={`${sizeClasses[size].icon} transition-transform duration-200`}
              />
              <span>Show Answer</span>
              <FiChevronDown
                className={`${sizeClasses[size].icon} transition-transform duration-200 ${animate ? "rotate-0" : ""}`}
              />
            </>
          )}
        </button>

        {showCopyButton && show && (
          <button
            onClick={handleCopy}
            className="
              inline-flex
              items-center
              gap-1.5
              px-3
              py-2
              text-xs
              font-medium
              text-[#5F6B63]
              dark:text-[var(--muted)]
              bg-white
              dark:bg-[var(--card)]
              border
              border-[#E2E8E3]
              dark:border-[var(--border)]
              rounded-xl
              hover:bg-[#F1F4F1]
              dark:hover:bg-[var(--surface)]
              hover:text-[#2E8B57]
              dark:hover:text-[var(--accent)]
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-[#8FAF9A]
              dark:focus:ring-[var(--accent)]
            "
            aria-label="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <FiCheck className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {(show || isVisible) && (
        <div
          className={`
            mt-3
            bg-[#F1F4F1]
            dark:bg-[var(--card)]
            border
            border-[#E2E8E3]
            dark:border-[var(--border)]
            rounded-xl
            ${sizeClasses[size].content}
            text-[#2C2C2C]
            dark:text-[var(--text)]
            leading-relaxed
            transition-all
            duration-200
            overflow-hidden
            ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            ${animate ? "" : "transition-none"}
          `}
        >
          <div className="prose dark:prose-invert max-w-none break-words whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerToggle;
