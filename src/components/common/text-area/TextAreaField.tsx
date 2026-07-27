import React from "react";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  value: string;

  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;

  rows?: number;
  disabled?: boolean;
  className?: string;
}

const TextAreaField: React.FC<TextAreaProps> = ({
  name,
  value,
  label,
  placeholder,
  required = false,
  error,
  rows = 4,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium leading-4 text-inputLabel">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
        className={`
          w-full
          border
          border-[#aaa]
          px-3
          py-2
          outline-none
          resize-none
          transition-all
          duration-200
          placeholder:transition-all
            placeholder:duration-400
            placeholder:ease-in-out
            focus:border-inputFocus
            placeholder:text-sm
            placeholder:font-normal
            focus:placeholder:pl-[10px]
          text-sm
           ${className}
        `}
      />

      {error && (
        <p className="text-error text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextAreaField;