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
              text-base
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
          w-[90%]
          items-center
          gap-3
          rounded-full
          bg-white
          px-1.5
          py-2
          shadow-md
          sm:mt-3
          sm:py-1
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
            ${iconBgColor}
          `}
          >
            ₹
          </div>

        <span className="truncate text-lg font-medium text-secondary lg:text-lg">
            {amount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayrollStatCard;
