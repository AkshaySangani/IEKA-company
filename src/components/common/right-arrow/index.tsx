import React from "react";

interface RightArrowProps {
  className?: string;
  label?: string;
  onClick?: () => void;
}

const RightArrow: React.FC<RightArrowProps> = ({ className = "", label,onClick = () => {} }) => {
  return (
    <span onClick={onClick}
      className={`inline-flex group cursor-pointer items-center gap-1 ${className}`}
    >
      {label && <span className="text-inputLabel">{label}</span>}
      <i className="fa-solid fa-arrow-right-long text-gray-500 text-[18px]  transition-all duration-200 ease-in-out group-hover:translate-x-1.5" />
    </span>
  );
};

export default RightArrow;
