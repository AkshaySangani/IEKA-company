import React from "react";
import RightArrow from "../right-arrow";

export interface SummaryCardProps {
  title: string;
  amount?: number | string;
  icon?: React.ReactNode;
  trendDetails: {
    type: string;
    difference: number;
    percentage: number;
  } | null;
  bgColor?: string;
  onClick?: () => void;
  className?: string;
}

export default function SummaryCard({
  title,
  amount,
  icon,
  trendDetails,
  bgColor = "#FDEEEE",
  onClick,
  className = "",
}: SummaryCardProps) {
  return (
    <div
      className={`content-card relative overflow-hidden ${className}`}
    >
      {/* Background */}
      <div
        className="rounded-sm p-5 h-[140px] relative"
        style={{ backgroundColor: bgColor }}
      >
        {/* Amount */}
        <div className="bg-white shadow-xl px-2 py-2 inline-flex items-center gap-2 w-full">
          {icon}
          <span className="text-[18px] font-medium text-[#1F2937]">
            {amount}
          </span>
        </div>

        {/* Title */}
        <p className="mt-3 text-[13px] uppercase tracking-wide text-[#6B7280]">
          {title}
        </p>

        {/* Trend */}
        {trendDetails && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-md font-bold ${
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
              className={`text-sm font-medium ${
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

        {/* Arrow */}
        <button className="absolute -bottom-1 -right-1 h-11 w-11 rounded-tl-full bg-white shadow-md flex items-center justify-center">
          <RightArrow label="" onClick={onClick} />
        </button>
      </div>
    </div>
  );
}
