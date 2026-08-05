import React from "react";

interface CheckboxProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean, name: string) => void;

  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;

  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  error,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        className={`inline-flex items-center gap-2 cursor-pointer ${
          disabled ? " cursor-not-allowed" : ""
        }`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked, name)}
          className="
            h-4 w-4
            rounded
            border-gray-300
            text-primary
            focus:ring-primary
            cursor-pointer
          "
        />

        {label && (
          <span className="text-sm text-secondary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
      </label>

      {error && <span className="mt-1 text-xs text-error">{error}</span>}
    </div>
  );
};

export default Checkbox;
