// components/common/toggle/Toggle.tsx

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
}) => {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          checked
            ? "bg-primary"
            : "bg-gray-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
};

export default Toggle;