const Container = ({
  children,
  size = "default",
  noPadding = false,
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "max-w-4xl",
    default: "max-w-6xl",
    lg: "max-w-7xl",
    xl: "max-w-full",
  };

  return (
    <div
      className={`
        w-full
        mx-auto
        ${sizes[size]}
        ${!noPadding ? "px-4 sm:px-6" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
