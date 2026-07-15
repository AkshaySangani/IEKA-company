import { format } from "date-fns";

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

type DateUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

interface DateDiffOptions {
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