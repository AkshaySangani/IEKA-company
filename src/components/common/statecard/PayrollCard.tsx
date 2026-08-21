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
        min-w-[200px]
        overflow-hidden
        px-4
        py-3
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        ${bgColor}
      `}
    >

      {/* Header */}
      <div className="z-10 flex items-center justify-between gap-2">
        <div className="flex gap-2">
        <span
          className={`text-md font-medium text-secondary`}
        >
          {title}
        </span>
        </div>
        
      </div>

      {/* Bottom amount pill */}
      <div className="mt-5 w-[140px] flex items-center gap-3 rounded-full bg-white px-1.5 py-1 shadow-md">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBgColor} text-white`}>
          {icon}
        </div>

        <span className="text-lg font-medium text-[#333]">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default PayrollStatCard;