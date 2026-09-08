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
  titleClassName?: string,
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
  titleClassName = "text-lg md:text-base"
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${className}
        w-full py-[6px] px-2 md:py-[10px] md:px-3 cursor-pointer transition-all select-none
        duration-200
        hover:-translate-y-[3px]        
        md:hover:-translate-y-[5px]        
         ${active ? activeColor : "bg-cardBg"}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            flex min-w-[30px] md:min-w-[35px] items-center justify-center px-1
            bg-white 
            shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px]
            ${textColor}
          `}
          // style={{ color: activeColor }}
        >
          <span className={`${textColor} text-xl font-medium `}>
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
        className={`mt-3 md:mt-[15px] ${active ? "text-white" : "text-secondary"} w-full font-normal ${titleClassName}`}
      >
        {title}
      </div>
    </div>
  );
};

export default StatCard;
