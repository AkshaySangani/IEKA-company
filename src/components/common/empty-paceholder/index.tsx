import React from "react";
import Info from "../../../assets/icons/Info";

interface EmptyPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  title = "No Data Found",
  description = "There is currently no data available to display.",
  icon = <Info size={50}/>,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col h-[-webkit-fill-available] items-center justify-center text-center py-16 px-6 gap-2 ${className}`}
    >
      {/* Icon */}
      <div className=" text-5xl text-gray-400">
        {icon || <i className="fa-solid fa-folder-open"></i>}
      </div>

      {/* Title */}
      <h3 className="text-xl font-medium text-gray-800 ">
        {title}
      </h3>

      {/* Description */}
      <p className="max-w-md text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyPlaceholder;