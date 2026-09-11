import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import TextField from "../text-field/TextField";
import { createPortal } from "react-dom";

interface Props {
  label?: string;
  required?: boolean;
  error?: string;
  value: string | null;
  onChange: (time: string | null) => void;
  placeholder?: string;
  timeIntervals?: number;
}

export default function TimePickerField({
  label,
  required,
  error,
  value: selectedTime,
  onChange,
  placeholder = "HH:MM",
  timeIntervals = 15,
}: Props) {
  const pickerRef = useRef<DatePicker>(null);

  const [inputValue, setInputValue] = useState(selectedTime ?? "");
  const [tempTime, setTempTime] = useState<Date | null>(
    parseTime(selectedTime),
  );

  useEffect(() => {
    setInputValue(selectedTime ?? "");
    setTempTime(parseTime(selectedTime));
  }, [selectedTime]);

  /**
   * Convert "12:32" -> Date
   */
  function parseTime(value?: string | null): Date | null {
    if (!value) return null;

    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);

    if (!match) return null;

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    const date = new Date();

    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  /**
   * Convert Date -> "HH:MM"
   */
  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  /**
   * Input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    setInputValue(text);

    // Allow empty value
    if (!text.trim()) {
      setTempTime(null);
      onChange(null);
      return;
    }

    const time = parseTime(text);

    if (time) {
      setTempTime(time);

      // Return exactly "HH:MM"
      onChange(formatTime(time));
    }
  };

  /**
   * DatePicker change
   */
  const handleTimeChange = (time: Date | null) => {
    setTempTime(time);

    if (time) {
      const formattedTime = formatTime(time);

      setInputValue(formattedTime);

      // Returns "HH:MM"
      onChange(formattedTime);
    } else {
      setInputValue("");
      onChange(null);
    }
  };

  const openPicker = () => {
    pickerRef.current?.setOpen(true);
  };

  return (
    <div className="w-full">
      <DatePicker
        ref={pickerRef}
        selected={tempTime}
        onChange={handleTimeChange}
        onClickOutside={(e) => e.stopPropagation()}
        customInput={
          <TextField
            label={label}
            required={required}
            error={error}
            value={inputValue}
            placeholder={"HH:mm"}
            onChange={handleInputChange}
            onClick={openPicker}
            icon={
              <i
                className="fa-regular fa-clock cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
              />
            }
            className="w-full"
          />
        }
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption="Time"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        shouldCloseOnSelect
        /**
         * Important:
         * Render popup outside modal's overflow container
         */
        // popperContainer={({ children }) =>
        //   createPortal(children, document.body)
        // }
        // popperClassName="time-picker-popper"
      />
    </div>
  );
}
