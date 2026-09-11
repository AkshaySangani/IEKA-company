import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import TextField from "../text-field/TextField";
import { DateFormat, formatDate } from "../../../utils/date-format";

interface Props {
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;

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
  disabled = false,
  dateFormat = DateFormat.DEFAULT
}: Props) {

  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const handleClick = () => {
    if (disabled) return;

    setOpen((prev) => !prev);
  };

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

  const handleDateChange = (date: Date | null) => {
    setTempDate(date);

    if (date) {
      //   setInputValue(dateToDisplayString(date));

      // Send "2026-9-8"
      onChange(formatDate(date, DateFormat.ISO_DATE));
      setOpen(false);
    } else {
      //   setInputValue("");

      // Send empty string when cleared
      onChange("");
      setOpen(false);
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
        // ref={pickerRef}
        open={open}
        onInputClick={handleClick}
        selected={tempDate}
        dateFormat={dateFormat}
        placeholderText="DD-MM-YYYY"
        customInput={
          <TextField
            className="w-full"
            name={name}
            error={error}
            disabled={disabled}
            icon={<i className="fa-regular fa-calendar text-secondary/60" onClick={handleClick}></i>}
          />
        }
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleDateChange}
        shouldCloseOnSelect
        onClickOutside={() => setOpen(false)}
        
        // popperPlacement="top-start"
        /**
         * Important:
         * Render popup outside modal's overflow container
         */
        // popperContainer={renderPopper}
        // popperClassName="date-picker-popper"
      />
    </div>
  );
}
