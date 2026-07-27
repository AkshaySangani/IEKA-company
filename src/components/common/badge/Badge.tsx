import React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white text-primary",
  success: "bg-success/50 text-success",
  warning: "bg-warning/50 text-warning",
  danger: "bg-danger/50 text-danger",
  info: "bg-info/50 text-info",
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  className = "",
  onClick = () => {}
}) => {
  return (
    <span onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-sm
        px-2.5
        py-1
        text-xs
        font-medium
        leading-4
        whitespace-nowrap
        cursor-pointer
        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

export default Badge;