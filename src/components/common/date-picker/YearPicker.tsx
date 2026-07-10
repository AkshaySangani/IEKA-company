import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearPickerProps {
  label?: string;
  required?: boolean;
  error?: string;
  value?: number;
  placeholder?: string;
  onChange: (year: number) => void;
  disabled?: boolean;
}

const YearPicker: React.FC<YearPickerProps> = ({
  label,
  required,
  error,
  value,
  placeholder = "Select Year",
  onChange,
  disabled,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const currentYear = value || new Date().getFullYear();

  const getStartYear = (year: number) => Math.floor(year / 10) * 10;

  const [open, setOpen] = useState(false);
  const [startYear, setStartYear] = useState(getStartYear(currentYear));

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  return (
    <div className="" ref={ref}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-inputLabel">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}

      <input
        readOnly
        disabled={disabled}
        value={value || ""}
        placeholder={placeholder}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full cursor-pointer border border-inputBorder bg-white
          px-[15px] py-[5px] text-sm font-medium leading-[25px]
          outline-none focus:border-inputFocus
          placeholder:text-sm
            placeholder:font-normal
          ${disabled ? "bg-disabledBg cursor-not-allowed" : ""}
          ${error ? "border-error" : ""}
        `}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-60 rounded border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b p-3">
            <button
              type="button"
              onClick={() => setStartYear((prev) => prev - 10)}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="font-semibold">
              {startYear}-{startYear + 9}
            </span>

            <button
              type="button"
              onClick={() => setStartYear((prev) => prev + 10)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 p-3">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onChange(year);
                  setOpen(false);
                }}
                className={`
                  rounded py-2 transition
                  ${
                    year === value
                      ? "bg-primary text-white"
                      : "hover:bg-primary/50"
                  }
                  ${
                    year === startYear - 1 || year === startYear + 10
                      ? "text-gray-400"
                      : ""
                  }
                `}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default YearPicker;