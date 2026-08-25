import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import TextField from "../text-field/TextField";

export interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

interface Props {
  label?: string;
  required?: boolean;
  error?: string;
  startDate: Date | null;
  endDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onChange: (dates: [Date | null, Date | null]) => void;
}

const DATE_FORMAT = "dd-MM-yyyy";

export default function DateRangePicker({
  label,
  required,
  error,
  startDate,
  endDate,
  minDate,
  maxDate,
  onChange,
}: Props) {
  const pickerRef = useRef<DatePicker>(null);

  const [value, setValue] = useState("");

  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      setValue(
        `${format(startDate, DATE_FORMAT)} - ${format(endDate, DATE_FORMAT)}`,
      );
    } else if (startDate) {
      setValue(format(startDate, DATE_FORMAT));
    } else {
      setValue("");
    }
  }, [startDate, endDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    setValue(text);

    const parts = text.split(" - ");

    if (parts.length === 2) {
      const start = parseDate(parts[0]);
      const end = parseDate(parts[1]);

      if (start && end) {
        setTempStartDate(start);
        setTempEndDate(end);
      }
    } else if (parts.length === 1) {
      const start = parseDate(parts[0]);

      if (start) {
        onChange([start, endDate]); // <-- updates current month while typing
      }
    }
  };

  const parseDate = (value: string): Date | null => {
    const [day, month, year] = value.trim().split("-").map(Number);

    if (!day || !month || !year) return null;

    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return null;
    }

    return date;
  };

  return (
    <div className="relative">
      <TextField
        label={label}
        required={required}
        error={error}
        value={value}
        placeholder="DD-MM-YYYY - DD-MM-YYYY"
        onChange={handleInputChange}
        onClick={() => pickerRef.current?.setOpen(true)}
        icon={
          <i
            className="fa-regular fa-calendar"
            onClick={() => pickerRef.current?.setOpen(true)}
          ></i>
        }
      />

      <div className="absolute left-[50%] top-6 translate-x-[-50%] z-[999999]">
        <DatePicker
          ref={pickerRef}
          selected={tempStartDate}
          startDate={tempStartDate}
          endDate={tempEndDate}
          selectsRange
          shouldCloseOnSelect={false}
          dateFormat={DATE_FORMAT}
          customInput={<div />}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(dates) => {
            const [start, end] = dates;

            setTempStartDate(start);
            setTempEndDate(end);

            if (start && end) {
              setValue(
                `${format(start, DATE_FORMAT)} - ${format(end, DATE_FORMAT)}`,
              );
            } else if (start) {
              setValue(format(start, DATE_FORMAT));
            } else {
              setValue("");
            }
          }}
        >
          <div className="flex items-center justify-end gap-2 border-t pt-2 px-0.5">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              onClick={() => {
                setTempStartDate(null);
                setTempEndDate(null);

                // if (startDate && endDate) {
                //   setValue(
                //     `${format(startDate, DATE_FORMAT)} - ${format(
                //       endDate,
                //       DATE_FORMAT,
                //     )}`,
                //   );
                // } else if (startDate) {
                //   setValue(format(startDate, DATE_FORMAT));
                // } else {
                  setValue("");
                // }

                pickerRef.current?.setOpen(false);
              }}
            >
              Clear
            </button>

            <button
              type="button"
              className="rounded bg-primary px-3 py-1.5 text-sm text-white"
              onClick={() => {
                onChange([tempStartDate, tempEndDate]);
                pickerRef.current?.setOpen(false);
              }}
            >
              Apply
            </button>
          </div>
        </DatePicker>
      </div>
    </div>
  );
}
