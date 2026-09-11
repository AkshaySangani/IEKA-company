import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TextField from "../text-field/TextField";

interface YearPickerProps {
  label?: string;
  required?: boolean;
  error?: string;
  value?: number;
  placeholder?: string;
  onChange: (year: number) => void;
  disabled?: boolean;
  pickerClassName?: string;
}

const YearPicker: React.FC<YearPickerProps> = ({
  label,
  required,
  error,
  value,
  placeholder = "Select Year",
  onChange,
  disabled,
  pickerClassName = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = value || new Date().getFullYear();

  const getStartYear = (year: number) => Math.floor(year / 10) * 10;

  const [open, setOpen] = useState(false);
  const [startYear, setStartYear] = useState(getStartYear(currentYear));

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideInput = ref.current?.contains(target);

      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideInput && !clickedInsideDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  const handleClick = () => {
    if (disabled) return;

    setOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={ref}>

      <TextField
        disabled={disabled}
        onClick={handleClick}
        value={value || ""}
        placeholder={placeholder}
        error={error}
        label={label}
        required={required}
        className="w-full cursor-pointer"
      />

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute top-full z-[9999] mt-1 w-60 rounded border bg-white shadow-lg ${pickerClassName}`}
        >
          <div className="flex items-center justify-between border-b p-3">
            <button
              type="button"
              onClick={() => setStartYear((prev) => prev - 10)}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="font-medium">
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
            {years.map((year) => {
              const disabledYear =
                year === startYear - 1 || year === startYear + 10;

              return (
                <button
                  key={year}
                  type="button"
                  disabled={disabledYear}
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
                      ${disabledYear ? "cursor-default text-gray-400" : ""}
                    `}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearPicker;
