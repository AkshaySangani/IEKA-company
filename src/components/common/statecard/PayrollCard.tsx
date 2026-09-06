import React from "react";

interface PayrollCardProps {
  count: number | string;
  title: string;
  icon: React.ReactNode;
  amount?: number | string;
  active?: boolean;
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;
  onClick?: () => void;
}

const PayrollStatCard: React.FC<PayrollCardProps> = ({
  count,
  title,
  icon,
  amount = count,
  active = false,
  bgColor = "bg-[#7b7b7b]",
  iconBgColor = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        overflow-hidden
        w-full py-[6px] px-2 md:py-[10px] md:px-3 cursor-pointer transition-all select-none
        duration-200
        hover:-translate-y-[3px]        
        md:hover:-translate-y-[5px]
        ${bgColor}
      `}
    >
      {/* content */}
      <div className="flex flex-col items-start justify-between min-h-[80px] sm:min-h-[100px]">
        <span
          className={`
              text-sm
              sm:text-md
              ${active ? "text-white" : "text-[#444]"}
            `}
        >
          {title}
        </span>
        {/* Bottom Amount Pill */}
        <div
          className="
          flex
          w-[100px]
          items-center
          gap-3
          rounded-full
          bg-white
          px-1.5
          py-0.5
          shadow-md
          sm:mt-3
          sm:py-1
          md:w-[160px]
        "
        >
          <div
            className={`
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white
            md:h-9
            md:w-9
            ${iconBgColor}
          `}
          >
            ₹
          </div>

          <span className="truncate text-xs font-medium text-[#333] sm:text-sm md:text-md lg:text-lg">
            {amount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayrollStatCard;
