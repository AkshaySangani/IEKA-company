import React from "react";
import { AttendanceViewEnum } from "../../../types/common-types";

export interface TabOption {
  label: AttendanceViewEnum;
  icon?: React.ReactNode;
  activeColor?: string;
  bgColor?: string;
}

interface TabsProps {
  active: string;
  options: TabOption[];
  onChange: (value: AttendanceViewEnum) => void;
}

const Tabs: React.FC<TabsProps> = ({
  active,
  options,
  onChange,
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      {options.map((option) => {
        const isActive = active === option.label;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.label)}
            className={`
              inline-flex items-center gap-1.5
              rounded-full
              border
              px-3.5 py-2
              text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? `border-transparent text-white ${option.activeColor}`
                  : `border-inputBorder/50 ${option.bgColor} text-secondary`
              }
            `}
          >
            {option.icon && (
              <span className="flex items-center justify-center">
                {option.icon}
              </span>
            )}

            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;