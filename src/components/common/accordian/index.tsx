import React, { Dispatch, ReactNode, SetStateAction, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface AccordionProps {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  active,
  setActive,
  header,
  children,
  className = "",
  bodyClassName = "",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`overflow-hidden bg-accordionBg ${className}`}
    >
      {/* Header */}

      <button
        type="button"
        onClick={() => setActive((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex-1 text-left">{header}</div>

        <ChevronRight
          size={22}
          className={`shrink-0 text-gray-500 transition-transform duration-300 ${
            active ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Body */}

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            ref={contentRef}
            className={`border-t border-gray-200 bg-white px-2 py-4 ${bodyClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;