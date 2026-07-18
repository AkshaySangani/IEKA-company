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
}

const ExpenseStatCard: React.FC<ExpenseStatCardProps> = ({
  count,
  title,
  icon,
  amount = count,
  active = false,
  activeColor = "bg-[#7b7b7b]",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        min-w-[220px]
        overflow-hidden
        px-5
        py-4
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        ${active ? activeColor : "bg-cardBg"}
      `}
    >
      {/* Top right circle */}
      <div className={`absolute -right-6 -top-6 flex h-20 w-20 items-end justify-start rounded-full ${active ? "bg-cardBg/20": "bg-[#e9e6e6]"} p-4`}>
      <div className={active ? "text-white" : "text-[#9b9b9b]"}>
          {icon}
        </div>
      </div>

      {/* Header */}
      <div className="z-10 flex items-center justify-between gap-2">
        <div className="flex gap-2">
        <span
          className={`text-[18px] font-semibold ${
            active ? "text-white" : "text-[#222]"
          }`}
        >
          {count}
        </span>

        <span
          className={`text-[18px] ${
            active ? "text-white" : "text-[#444]"
          }`}
        >
          {title}
        </span>
        </div>
        
      </div>

      {/* Bottom amount pill */}
      <div className="mt-5 w-[140px] flex items-center gap-3 rounded-full bg-white px-1.5 py-1 shadow-md">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${activeColor} text-white`}>
          ₹
        </div>

        <span className="text-lg font-semibold text-[#333]">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default ExpenseStatCard;