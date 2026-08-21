import { format } from "date-fns";
import { MonthPickerValue } from "../components/common/date-picker/MonthPicker";

export enum DateFormat {
  DEFAULT = "dd-MM-yyyy", // 01-07-2026
  DATE_SLASH = "dd/MM/yyyy", // 01/07/2026
  DATE_TIME = "dd-MM-yyyy hh:mm a", // 01-07-2026 10:30 AM
  DATE_TIME_24 = "dd-MM-yyyy HH:mm", // 01-07-2026 22:30
  TIME_12 = "hh:mm a", // 10:30 AM
  TIME_24 = "HH:mm", // 22:30
  MONTH_YEAR = "MMM yyyy", // Jul 2026
  FULL_DATE = "dd MMM yyyy", // 01 Jul 2026
  FULL_DATE_TIME = "dd MMM yyyy, hh:mm a", // 01 Jul 2026, 10:30 AM
  DAY_DATE = "EEEE, dd MMM yyyy", // Wednesday, 01 Jul 2026
  ISO_DATE = "yyyy-MM-dd", // 2026-07-01
  YEAR = "yyyy", // 2026
}

export const formatDate = (
  date?: string | Date | null,
  formatType: DateFormat = DateFormat.DEFAULT
): string => {
  if (!date) return "";

  try {
    return format(new Date(date), formatType);
  } catch {
    return "";
  }
};

export enum MinuteFormat {
  HH_MM = "HH_MM", // 12:39
  HOURS = "HOURS", // 12.65 hr
  HOURS_ROUNDED = "HOURS_ROUNDED", // 12.7 hr
  MINUTES = "MINUTES", // 759 min
}

export const formatMinutes = (
  minutes?: number | null,
  formatType: MinuteFormat = MinuteFormat.HH_MM
): string => {
  if (minutes == null || isNaN(minutes)) return "";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  switch (formatType) {
    case MinuteFormat.HH_MM:
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;

    case MinuteFormat.HOURS:
      return `${(minutes / 60).toFixed(2)} hr`;

    case MinuteFormat.HOURS_ROUNDED:
      return `${(minutes / 60).toFixed(1)} hr`;

    case MinuteFormat.MINUTES:
      return `${minutes} min`;

    default:
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
  }
};

export const getDateDifferenceInDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff =
      Math.floor(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return diff > 0 ? diff : 0;
};

export type DateUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

export interface DateDiffOptions {
  from: string;
  to: string;
  unit: DateUnit;
}

export function getDateDifference({
  from,
  to,
  unit,
}: DateDiffOptions): number {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  const diffMs = toDate.getTime() - fromDate.getTime();

  switch (unit) {
    case "seconds":
      return Math.floor(diffMs / 1000);

    case "minutes":
      return Math.floor(diffMs / (1000 * 60));

    case "hours":
      return Math.floor(diffMs / (1000 * 60 * 60));

    case "days":
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));

    case "weeks":
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

    case "months":
      return (
        (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (toDate.getMonth() - fromDate.getMonth())
      );

    case "years":
      return toDate.getFullYear() - fromDate.getFullYear();

    default:
      return 0;
  }
}

function parseDate(value: string): Date {
  const [datePart = "", timePart = ""] = value.trim().split(" ");

  let day = 1;
  let month = 1;
  let year = 1970;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // dd/mm/yyyy
  if (datePart.includes("/")) {
    const parts = datePart.split("/").map(Number);

    day = parts[0] || 1;
    month = parts[1] || 1;
    year = parts[2] || 1970;
  }

  // hh:mm or hh:mm:ss
  if (timePart || value.includes(":")) {
    const time = (timePart || value).split(":").map(Number);

    hours = time[0] || 0;
    minutes = time[1] || 0;
    seconds = time[2] || 0;
  }

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  );
}

export const getDateDifferenceBetween = (
  startDate: string | Date,
  endDate: string | Date = new Date()
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;

    const previousMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const result: string[] = [];

  if (years > 0) {
    result.push(`${years} year${years > 1 ? "s" : ""}`);
  }

  if (months > 0) {
    result.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  if (days > 0) {
    result.push(`${days} day${days > 1 ? "s" : ""}`);
  }

  return result.length ? result.join(" ") : "0 day";
};

export function getDobDisabledDate() {
  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 18);

  return maxDob.toISOString().split("T")[0];
}

// calendar.utils.ts

export const getMonthDays = (selectedMonth: MonthPickerValue) => {
  const year = selectedMonth.year;

  // MonthPicker: January = 1, August = 8
  // JS Date: January = 0, August = 7
  const month = selectedMonth.month - 1;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const totalDays = lastDay.getDate();

  // Convert Sunday = 0 to Monday = 0
  const startingDay = (firstDay.getDay() + 6) % 7;

  const days: Array<Date | null> = [];

  // Empty cells before the first day
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  // Actual month days
  for (let day = 1; day <= totalDays; day++) {
    days.push(new Date(year, month, day));
  }

  // Complete the last week
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};


export const getDaysInMonth = (selectedMonth: MonthPickerValue): number => {
  return new Date(selectedMonth.year, selectedMonth.month, 0).getDate();
};