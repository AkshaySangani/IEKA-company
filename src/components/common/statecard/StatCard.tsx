import React from "react";

interface StatCardProps {
  count: number;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  count,
  title,
  icon,
  active = false,
  activeColor = "#007bff",
  textColor = "text-secondary",
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`
        ${className}
        w-full py-[6px] px-2 md:py-[10px] md:px-3         
         ${active ? activeColor : "bg-cardBg"}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            flex w-[25px] md:w-[35px] items-center justify-center
            bg-white 
            shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px]
            ${textColor}
          `}
          // style={{ color: activeColor }}
        >
          <span className={`${textColor} text-md md:text-[20px] font-medium `}>
            {" "}
            {count}
          </span>
        </div>

        <div
          className={`text-sm text-right ${
            active ? "text-white" : "text-[#ababab]"
          }`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`mt-3 md:mt-[15px] ${active ? "text-white" : "text-secondary"} w-full text-sm md:text-md font-normal `}
      >
        {title}
      </div>
    </div>
  );
};

export default StatCard;
