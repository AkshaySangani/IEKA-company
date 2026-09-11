import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TextField from "../text-field/TextField";

export interface MonthPickerValue {
  month: number; // 0 - 11
  year: number;
}

interface MonthPickerProps {
  label?: string;
  required?: boolean;
  error?: string;
  value?: MonthPickerValue;
  placeholder?: string;
  disabled?: boolean;
  // Minimum selectable month
  minDate?: MonthPickerValue;
  onChange: (value: MonthPickerValue) => void;
  pickerClassName?: string;
}

const MONTHS: { [key: number]: string } = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const MonthPicker: React.FC<MonthPickerProps> = ({
  label,
  required,
  error,
  value,
  placeholder = "Select Month",
  disabled,
  minDate,
  onChange,
  pickerClassName = ""
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  const currentYear = value?.year || today.getFullYear();

  const getStartYear = (year: number) => Math.floor(year / 10) * 10;

  const [open, setOpen] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startYear, setStartYear] = useState(getStartYear(currentYear));

  useEffect(() => {
    if (value?.year) {
      setSelectedYear(value.year);
      setStartYear(getStartYear(value.year));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideInput = wrapperRef.current?.contains(target);

      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideInput && !clickedInsideDropdown) {
        setOpen(false);
        setShowYears(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const years = useMemo(
    () => Array.from({ length: 12 }, (_, i) => startYear - 1 + i),
    [startYear],
  );

  const inputValue = useMemo(() => {
    if (!value) return "";

    return `${MONTHS[value.month]} ${value.year}`;
  }, [value]);

  const handleClickOnInput = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const isMonthDisabled = (month: number, year: number) => {
    if (!minDate) return false;

    if (year < minDate.year) return true;

    if (year === minDate.year && month <= minDate.month) {
      return true;
    }

    return false;
  };

  return (
    <div className="relative" ref={wrapperRef}>

      <TextField
        disabled={disabled}
        onClick={handleClickOnInput}
        value={inputValue || ""}
        placeholder={placeholder}
        error={error}
        label={label}
        required={required}
        className="w-full cursor-pointer"
      />

      {open &&
          <div
            ref={dropdownRef}
            className={`absolute top-full z-[9999] w-[235px] rounded border mt-1 bg-white shadow-lg ${pickerClassName}`}
          >
            {/* Header */}

            <div className="flex items-center justify-between px-4 py-1 border-b bg-disabledBg">
              <button
                type="button"
                onClick={() => {
                  if (showYears) {
                    setStartYear((prev) => prev - 10);
                  } else {
                    setSelectedYear((prev) => prev - 1);
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => setShowYears((prev) => !prev)}
                className="text-[18px] font-medium"
              >
                {showYears ? `${startYear}-${startYear + 9}` : selectedYear}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showYears) {
                    setStartYear((prev) => prev + 10);
                  } else {
                    setSelectedYear((prev) => prev + 1);
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Years */}

            {showYears ? (
              <div className="grid grid-cols-3 gap-1 p-2">
                {years.map((year) => {
                  const disabledYear =
                    year === startYear - 1 || year === startYear + 10;

                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={disabledYear}
                      onClick={() => {
                        setSelectedYear(year);
                        setShowYears(false);
                      }}
                      className={`
                        rounded-md p-2 text-lg transition
                        ${
                          selectedYear === year
                            ? "bg-primary text-white font-medium"
                            : "hover:bg-primaryBlur"
                        }
                        ${
                          disabledYear
                            ? "cursor-default text-gray-300"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 p-1">
                {Object.keys(MONTHS).map((month) => {
                  const monthNumber = Number(month);

                  const disabledMonth = isMonthDisabled(
                    monthNumber,
                    selectedYear,
                  );

                  const isSelected =
                    value?.month === monthNumber &&
                    value?.year === selectedYear;

                  return (
                    <button
                      key={month}
                      type="button"
                      disabled={disabledMonth}
                      onClick={() => {
                        if (disabledMonth) return;

                        onChange({
                          month: monthNumber,
                          year: selectedYear,
                        });

                        setOpen(false);
                      }}
                      className={`
          mx-auto flex items-center justify-center
          rounded-md px-2 py-2 text-[18px] transition

          ${
            isSelected
              ? "bg-primary font-medium text-white"
              : disabledMonth
                ? "cursor-not-allowed text-gray-300"
                : "hover:bg-primaryBlur"
          }
        `}
                    >
                      {MONTHS[monthNumber]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>}
    </div>
  );
};

export default MonthPicker;
