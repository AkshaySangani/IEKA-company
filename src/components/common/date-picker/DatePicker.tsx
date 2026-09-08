import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import TextField from "../text-field/TextField";
import { DateFormat, formatDate } from "../../../utils/date-format";
import { createPortal } from "react-dom";

interface Props {
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;

  // String value: "2026-9-8"
  value: string;

  minDate?: Date;
  maxDate?: Date;

  // Returns: "2026-9-8" or ""
  onChange: (date: string) => void;

  dateFormat?: DateFormat;
}

export default function DatePickerField({
  label,
  name,
  required,
  error,
  value: selectedValue,
  minDate,
  maxDate,
  onChange,
  dateFormat = DateFormat.DEFAULT,
}: Props) {
  const pickerRef = useRef<DatePicker>(null);

  //   const [inputValue, setInputValue] = useState("");
  const [tempDate, setTempDate] = useState<Date | null>(null);

  /**
   * Convert "2026-9-8" -> Date
   */
  const stringToDate = (value: string): Date | null => {
    if (!value) return null;

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  useEffect(() => {
    const date = stringToDate(selectedValue);

    setTempDate(date);
    // setInputValue(dateToDisplayString(date));
  }, [selectedValue]);

  /**
   * Handle manual input
   * Input format: DD-MM-YYYY
   */
  //   const parseInputDate = (value: string): Date | null => {
  //     const [day, month, year] = value.trim().split("-").map(Number);

  //     if (!day || !month || !year) return null;

  //     const date = new Date(year, month - 1, day);

  //     if (
  //       date.getDate() !== day ||
  //       date.getMonth() !== month - 1 ||
  //       date.getFullYear() !== year
  //     ) {
  //       return null;
  //     }

  //     return date;
  //   };

  //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const text = e.target.value;

  //     setInputValue(text);

  //     const date = parseInputDate(text);

  //     if (date) {
  //       setTempDate(date);

  //       // Send "2026-9-8"
  //       onChange(formatDate(date, DateFormat.ISO_DATE));
  //     }
  //   };

  const handleDateChange = (date: Date | null) => {
    setTempDate(date);

    if (date) {
      //   setInputValue(dateToDisplayString(date));

      // Send "2026-9-8"
      onChange(formatDate(date, DateFormat.ISO_DATE));
    } else {
      //   setInputValue("");

      // Send empty string when cleared
      onChange("");
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 block text-sm font-medium leading-4 text-inputLabel">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <DatePicker
        ref={pickerRef}
        selected={tempDate}
        dateFormat={dateFormat}
        placeholderText="DD-MM-YYYY"
        customInput={
          <TextField
            className="w-full"
            name={name}
            error={error}
            icon={<i className="fa-regular fa-calendar text-secondary/60"></i>}
          />
        }
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleDateChange}
        shouldCloseOnSelect
        popperPlacement="top-start"
        /**
         * Important:
         * Render popup outside modal's overflow container
         */
        popperContainer={({ children }) =>
          createPortal(children, document.body)
        }
      />
    </div>
  );
}
