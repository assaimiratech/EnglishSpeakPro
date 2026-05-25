const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  variant = "default",
  ...props
}) => {
  const paddingSizes = {
    sm: "p-3",
    md: "p-4 md:p-5",
    lg: "p-5 md:p-6",
    xl: "p-6 md:p-8",
    none: "p-0",
  };

  const variants = {
    default: "bg-white border-[#E2E8E3]",
    primary: "bg-white border-[#8FAF9A]/30",
    secondary: "bg-[#F1F4F1] border-[#E2E8E3]",
    elevated: "bg-white border-transparent shadow-md",
  };

  const hoverEffects = hover
    ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    : "";

  return (
    <div
      className={`
        rounded-2xl
        border
        shadow-sm
        ${variants[variant]}
        ${paddingSizes[padding]}
        ${hoverEffects}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
