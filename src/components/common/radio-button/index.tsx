import React from "react";
import { IOption } from "../../../types/common-types";

interface RadioButtonProps {
  name: string;
  label?: string;
  value: string | number;
  options: IOption[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  label,
  value,
  options,
  required = false,
  error,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[15px] font-medium text-gray-800">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="bg-tableHeader p-2.5 flex flex-wrap items-center gap-6 ">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 cursor-pointer"
            />

            <span className="text-[15px] text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
};

export default RadioButton;