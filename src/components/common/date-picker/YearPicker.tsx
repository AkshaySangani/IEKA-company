import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const currentYear = value || new Date().getFullYear();

  const getStartYear = (year: number) => Math.floor(year / 10) * 10;

  const [open, setOpen] = useState(false);
  const [startYear, setStartYear] = useState(getStartYear(currentYear));

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideInput = ref.current?.contains(target);

      const clickedInsideDropdown =
        dropdownRef.current?.contains(target);

      if (!clickedInsideInput && !clickedInsideDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const years = Array.from(
    { length: 12 },
    (_, i) => startYear - 1 + i,
  );

  const handleClick = () => {
    if (disabled) return;

    const rect = inputRef.current?.getBoundingClientRect();

    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 70,
      });
    }

    setOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-inputLabel">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}

      <input
        ref={inputRef}
        readOnly
        disabled={disabled}
        value={value || ""}
        placeholder={placeholder}
        onClick={handleClick}
        className={`
          w-full cursor-pointer border border-inputBorder bg-white
          px-[15px] py-[5px] text-sm font-medium leading-[25px]
          outline-none focus:border-inputFocus
          placeholder:text-sm placeholder:font-normal
          ${disabled ? "cursor-not-allowed bg-disabledBg" : ""}
          ${error ? "border-error" : ""}
        `}
      />

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] mt-1 w-60 rounded border bg-white shadow-lg"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
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
              {years.map((year) => {
                const disabledYear =
                  year === startYear - 1 ||
                  year === startYear + 10;

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
                      ${
                        disabledYear
                          ? "cursor-default text-gray-400"
                          : ""
                      }
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
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