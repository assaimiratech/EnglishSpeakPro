import { FiLoader } from "react-icons/fi";

const variants = {
  primary:
    "bg-[#2E8B57] hover:bg-[#257149] text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-[#F1F4F1] hover:bg-[#E2E8E3] text-[#2C2C2C] border border-[#E2E8E3]",
  outline:
    "bg-transparent hover:bg-[#F1F4F1] text-[#2E8B57] border border-[#2E8B57] hover:border-[#257149]",
  danger:
    "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent hover:bg-[#F1F4F1] text-[#5F6B63] hover:text-[#2C2C2C]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
  xl: "px-8 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl
        font-medium
        transition-all duration-200
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
