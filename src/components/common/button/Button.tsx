import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  loading?: boolean;
  variant?:
    | "primary"
    | "primaryGradient"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  name,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  leftIcon,
  fullWidth,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-btn-primary hover:bg-btn-primary-hover text-white",

    primaryGradient: `
      text-white
      bg-[length:200%_auto]
      bg-[linear-gradient(135deg,#385c99_0%,#5b84c4_50%,#385c99_100%)]
      hover:bg-right
      hover:shadow-[0_4px_18px_rgba(56,92,153,0.4)]
      hover:-translate-y-[1px]
    `,

    secondary: "bg-btn-secondary hover:bg-btn-secondary-hover text-white",

    success: "",

    danger: "bg-btn-danger hover:bg-btn-danger-hover text-white",

    warning: "",
  }[variant];

  const sizeClasses = {
    sm: "py-[5px] px-[15px] text-sm min-h-[34px]",
    md: "py-3 px-5 text-sm min-h-[42px]",
    lg: "py-[14px] px-6 text-md min-h-[50px]",
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={`
        group
        relative overflow-hidden
        border-none
        font-medium
        cursor-pointer
        transition-all duration-300 ease-in-out
        text-center
        box-border
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${fullWidth ? "w-full" : "w-auto"}
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
      {...props}
    >
      {/* Shine Effect */}
      <span
        className="
          absolute
          inset-0
          -left-full
          transition-all
          duration-500
          ease-in-out
          pointer-events-none
          group-hover:left-full
        "
      />

      {loading && (
        <i className="fa-solid fa-spinner animate-spin mr-2"></i>
      )}

      {leftIcon && <span className={name ? "mr-1" : ""}>{leftIcon}</span>}

      {name}
    </button>
  );
};

export default Button;