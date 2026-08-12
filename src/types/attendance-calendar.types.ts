// attendance-calendar.types.ts

export type CalendarStatus =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "info";

export interface AttendanceDay {
  date: Date;
  status?: CalendarStatus;

  inTime?: string;
  outTime?: string;

  inTimeStatus?: CalendarStatus;
  outTimeStatus?: CalendarStatus;

  lateMinutes?: number;

  leaveType?: string;
  leaveName?: string;

  employeeImage?: string;
  statusImage?: string;
}