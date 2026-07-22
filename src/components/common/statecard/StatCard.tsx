import React from "react";

interface StatCardProps {
  count: number;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  count,
  title,
  icon,
  active = false,
  activeColor = "#007bff",
  textColor = "text-secondary",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      // style={active ? { backgroundColor: activeColor } : undefined}
      className={`
        min-w-[140px]
        cursor-pointer
        select-none
        px-3
        py-[10px]
        transition-all
        duration-200
        hover:-translate-y-[5px]
        ${active ? activeColor : "bg-cardBg"}
      `}
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            flex min-w-[35px] items-center justify-center
            bg-white px-[5px] py-[2px]
            text-[20px] font-medium 
            shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px]
            ${textColor}
          `}
          // style={{ color: activeColor }}
        >
          {count}
        </div>

        <div
          className={`w-[50px] text-right ${
            active ? "text-white" : "text-[#ababab]"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className={`mt-[15px] ${active ? "text-white" : "text-[#333]"} w-full text-[16px] font-normal leading-[16px]`}>
        {title}
      </div>
    </div>
  );
};

export default StatCard;