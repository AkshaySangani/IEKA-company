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
  const trendColor =
    trendDetails?.type === "high"
      ? "text-success"
      : trendDetails?.type === "low"
        ? "text-danger"
        : "text-secondary";

  const trendIcon =
    trendDetails?.type === "high"
      ? "↑"
      : trendDetails?.type === "low"
        ? "↓"
        : "→";

  return (
    <div
      className={`content-card relative min-w-0 overflow-hidden ${className}`}
    >
      <div
        className="
          relative
          h-[100px]
          rounded-sm
          p-2
          sm:h-[140px]
          sm:p-4
        "
        style={{ backgroundColor: bgColor }}
      >
        {/* Amount */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1
            overflow-hidden
            rounded-sm
            bg-white
            px-2
            py-1.5
            shadow-xl
            sm:gap-2
            sm:px-2
            sm:py-2
          "
        >
          {icon}

          <span
            className="
              min-w-0
              truncate
              text-xs
              font-medium
              text-secondary
              sm:text-lg
            "
          >
            {amount}
          </span>
        </div>

        {/* Title */}
        <p
          className="
            mt-2
            truncate
            text-[10px]
            font-medium
            uppercase
            tracking-wide
            text-grayText
            sm:mt-3
            sm:text-xs
          "
        >
          {title}
        </p>

        {/* Trend */}
        {trendDetails && (
          <div className="mt-1 flex min-w-0 items-center gap-1 sm:mt-2">
            <span
              className={`shrink-0 text-sm font-bold sm:text-md ${trendColor}`}
            >
              {trendIcon}
            </span>

            <span
              className={`shrink-0 text-[11px] font-medium sm:text-sm ${trendColor}`}
            >
              {trendDetails.type === "high" ? "+" : ""}
              {trendDetails.percentage}%
            </span>

            <span className="hidden truncate text-xs text-secondary sm:block">
              Last Month
            </span>
          </div>
        )}

        {/* Arrow */}
        <button
          type="button"
          className="
            absolute
            -bottom-1
            -right-1
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-tl-full
            bg-white
            shadow-md
            sm:h-11
            sm:w-11
          "
        >
          <RightArrow label="" onClick={onClick} />
        </button>
      </div>
    </div>
  );
}
