import React from "react";

interface CategorySelectorCardProps {
  count?: number;
  title: string;
  icon: React.ReactNode;
  amount?: number | string;
  active?: boolean;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const CategorySelectorCard: React.FC<CategorySelectorCardProps> = ({
  title,
  icon,
  active = false,
  activeColor = "bg-[#e4932d]",
  textColor = "text-secondary",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex
        
        items-center
        gap-4
        cursor-pointer
        border
        px-2
        py-2
        transition-all
        duration-300
        ${
          active
            ? `${activeColor} border-transparent`
            : " bg-white"
        }
      `}
    >
      {/* Icon box */}
      <div
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          bg-cardBg
          shadow-sm
        `}
      >
        <div
          className={`text-xl ${
            active ? textColor : "text-[#8c8c8c]"
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <span
        className={`
          text-sm
          font-medium
          ${
            active
              ? "text-white"
              : "text-secondary"
          }
        `}
      >
        {title}
      </span>
    </div>
  );
};

export default CategorySelectorCard;