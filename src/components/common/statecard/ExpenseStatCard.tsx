import React from "react";

interface ExpenseStatCardProps {
  count: number;
  title: string;
  icon: React.ReactNode;
  amount?: number | string;
  active?: boolean;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const ExpenseStatCard: React.FC<ExpenseStatCardProps> = ({
  count,
  title,
  icon,
  amount = count,
  active = false,
  activeColor = "bg-info",
  onClick,
  className
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${className}
        relative
        overflow-hidden
        w-full py-[6px] px-2 md:py-[10px] md:px-3 cursor-pointer transition-all select-none
        duration-200
        hover:-translate-y-[3px]        
        md:hover:-translate-y-[5px]
        ${active ? activeColor : "bg-cardBg"}
      `}
    >
      {/* Top Right Icon Circle */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-8
          -top-7
          flex
          h-16
          w-16
          items-end
          justify-start
          rounded-full
          p-2.5
          sm:-right-10
          sm:-top-10
          sm:h-20
          sm:w-20
          sm:p-4
          md:-right-12
          md:-top-12
          md:h-24
          md:w-24
          ${active ? "bg-cardBg/20" : "bg-white/30"}
        `}
      >
        <div
          className={`
            ${active ? "text-white" : "text-[#9b9b9b]"}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-base
              font-medium
              sm:text-[18px]
              ${active ? "text-white" : "text-[#222]"}
            `}
          >
            {count}
          </span>

          <span
            className={`
              text-base
              sm:text-[18px]
              ${active ? "text-white" : "text-[#444]"}
            `}
          >
            {title}
          </span>
        </div>
      </div>

      {/* Bottom Amount Pill */}
      <div
        className="
          flex
          w-[130px]
          items-center
          gap-3
          rounded-full
          bg-white
          px-1.5
          py-1
          shadow-md
          sm:mt-3
          sm:py-1
          mt-5
          md:w-[140px]
        "
      >
        <div
          className={`
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white
            md:h-9
            md:w-9
            ${activeColor}
          `}
        >
          ₹
        </div>

        <span className="truncate text-base font-medium text-secondary md:text-md lg:text-lg">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default ExpenseStatCard;