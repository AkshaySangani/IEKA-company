import React from "react";
import { currency } from "../../../constants/constants";

interface OverallExpenseCardProps {
  title: string;
  trendDetails: {
    type: string;
    difference: number;
    percentage: number;
  };
  active?: boolean;
  amount?: number | string;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const OverallExpenseCard: React.FC<OverallExpenseCardProps> = ({
  amount,
  title,
  trendDetails,
  active = false,
  activeColor = "#007bff",
  textColor = "text-secondary",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
       min-w-[140px]
        cursor-pointer
        select-none
        px-3
        py-2.5
        transition-all
        duration-200
        hover:-translate-y-[5px]
        flex flex-col gap-3
        ${active ? activeColor : "bg-cardBg"}
      `}
    >
      {/* Title */}
      <div className={`text-md font-semibold text-secondary`}>{title}</div>

      {/* Amount + Icon */}
      <div className="w-[180px] flex items-center gap-3 rounded-full bg-white px-1.5 py-1 shadow-md">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${textColor} text-white`}
        >
          {currency.INR}
        </div>

        <span className="text-lg font-semibold text-[#333]">{amount}</span>
      </div>

      {/* Footer */}
      {trendDetails && (
        <div className="flex items-center gap-2">
          <span
            className={`text-[22px] font-bold ${
              trendDetails.type === "high"
                ? "text-success"
                : trendDetails.type === "low"
                  ? "text-error"
                  : "text-secondary"
            }`}
          >
            {trendDetails.type === "high"
              ? "↑"
              : trendDetails.type === "low"
                ? "↓"
                : "→"}
          </span>

          <span
            className={`text-[16px] font-semibold ${
              trendDetails.type === "high"
                ? "text-success"
                : trendDetails.type === "low"
                  ? "text-error"
                  : "text-secondary"
            }`}
          >
            {trendDetails.type === "high" ? "+" : ""}
            {trendDetails.percentage}%
          </span>

          <span className="text-xs text-secondary">Last Month</span>
        </div>
      )}
    </div>
  );
};

export default OverallExpenseCard;
