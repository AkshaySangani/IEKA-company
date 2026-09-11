import React from "react";
import Image from "../image";
import NoDataFound from "../../../assets/images/NoDataFound.jpeg";

interface EmptyPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  showDescription?: boolean;
  descriptionClassName?: string;
}

const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  title = "No Data Found",
  description = "There is currently no data available to display.",
  icon,
  className = "",
  imageClassName = "",
  titleClassName = "",
  showDescription = true,
  descriptionClassName = ""
}) => {
  return (
    <div
      className={`flex flex-col h-[-webkit-fill-available] items-center justify-center text-center py-16 px-6 gap-2 ${className}`}
    >
      {/* Icon */}
      <div className=" text-5xl text-gray-400">
        {icon || <Image fallbackSrc={NoDataFound} className={`w-14 h-14 object-contain ${imageClassName}`}/>}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-medium text-gray-800 ${titleClassName}`}>
        {title}
      </h3>

      {/* Description */}
      {showDescription && <p className={`max-w-md text-sm text-gray-500 leading-relaxed ${descriptionClassName}`}>
        {description}
      </p>}
    </div>
  );
};

export default EmptyPlaceholder;