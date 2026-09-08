import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  mainClassName?: string;
}

const TextField: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  mainClassName = "",
  required,
  ...props
}) => {
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (props.type === "number") {
      e.currentTarget.blur(); // Prevent value change on scroll
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.type === "number") {
      let value = e.target.value;

      // Remove leading zeros (except decimals like 0.5)
      if (/^0\d+/.test(value)) {
        value = value.replace(/^0+/, "");
      }

      if (props.name?.toLowerCase().includes("phone")) {
        // Allow only digits
        value = value.replace(/\D/g, "");

        // Limit to 10 digits
        value = value.slice(0, 10);
      }

      e.target.value = value;
    }

    props.onChange?.(e);
  };

  return (
    <div className={`${mainClassName}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium leading-4 text-inputLabel">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <div className="group relative">
        <input
          {...props}
          onChange={handleChange}
          onWheel={handleWheel}
          autoComplete={"off"}
          className={`
            min-w-full
            border border-inputBorder
            bg-white
            px-[15px]
            sm:py-[5px]
            py-[10px]
            text-base
            sm:text-sm
            font-medium
            ${props.type === "date" ? "leading-[25px]" : "leading-[27px]"}
            text-inputValue
            outline-none
            placeholder:transition-all
            placeholder:duration-400
            placeholder:ease-in-out
            focus:border-inputFocus
            sm:placeholder:text-sm
            placeholder:text-md
            placeholder:font-normal
            focus:placeholder:pl-[10px]
            disabled:bg-disabledBg
            disabled:text-disabledText
            disabled:placeholder:text-disabledText
            disabled:cursor-not-allowed
            ${error ? "border-error" : ""}
            ${icon ? "pr-10" : ""}
            ${className}
          `}
        />

        {icon && (
          <span
            className="
              absolute right-[10px] top-1/2
              -translate-y-1/2
              cursor-pointer
              text-[18px]
              text-inputIcon
              transition-colors
              duration-200
              group-focus-within:text-inputFocus
            "
          >
            {icon}
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default TextField;
