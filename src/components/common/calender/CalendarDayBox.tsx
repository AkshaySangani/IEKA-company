// CalendarDayBox.tsx

import React from "react";
import {
  AttendanceDay,
  CalendarStatus,
} from "../../../types/attendance-calendar.types";
import { IUserAttendance } from "../../company/performance/attendance/attendance-details";
import { getFirstCharacter } from "../../../utils/helper";
import {
  AttendanceStatusEnum,
  LeaveDuration,
} from "../../../types/common-types";
import Present from "../../../assets/images/present.png";
import Absent from "../../../assets/images/absent.png";
import Holiday from "../../../assets/images/holidays.png";
import Image from "../image";
import {
  DateFormat,
  formatDate,
  formatMinutes,
} from "../../../utils/date-format";

interface CalendarDayBoxProps {
  date: number | null;
  data?: IUserAttendance;
  //   onClick?: (date: Date) => void;
}

const statusClasses: Record<
  CalendarStatus,
  {
    border: string;
    text: string;
    bg: string;
  }
> = {
  primary: {
    border: "border-primary",
    text: "text-primary",
    bg: "bg-primary/10",
  },

  secondary: {
    border: "border-secondary",
    text: "text-secondary",
    bg: "bg-secondary/10",
  },

  success: {
    border: "border-success",
    text: "text-success",
    bg: "bg-success/10",
  },

  warning: {
    border: "border-warning",
    text: "text-warning",
    bg: "bg-warning/10",
  },

  pending: {
    border: "border-pending",
    text: "text-pending",
    bg: "bg-pending/10",
  },

  danger: {
    border: "border-danger",
    text: "text-danger",
    bg: "bg-danger/10",
  },

  info: {
    border: "border-info",
    text: "text-info",
    bg: "bg-info/10",
  },
};

const getDayBackground = (status?: AttendanceStatusEnum) => {
  switch (status) {
    case AttendanceStatusEnum.WEEK_OFF:
    case AttendanceStatusEnum.HOLIDAY:
      return "bg-warning/15";

    case AttendanceStatusEnum.ABSENT:
      return "bg-danger/15";

    // case "info":
    //   return "bg-info/15";

    default:
      return "bg-white";
  }
};

const CalendarDayBox = ({
  date,
  data,
  //   onClick,
}: CalendarDayBoxProps) => {
  if (!date) {
    return <div className="min-h-[150px] border border-slate-200 bg-white" />;
  }

  const day = date;
  const today = new Date().getDate();
  const isToday = day === today;

  const background = getDayBackground(data?.attendanceStatus);

  return (
    <div
      className={`
        min-h-[150px]
        border
        border-slate-300
        ${background}
        cursor-pointer
        transition
        hover:bg-slate-50
        overflow-hidden
      `}
    >
      {/* Date */}
      <div className={`flex justify-center pt-2`}>
        <span
          className={`text-sm font-medium text-secondary w-[25px] h-[25px] text-center flex justify-center items-center rounded-full ${isToday ? "bg-blue text-white" : ""}`}
        >
          {day}
        </span>
      </div>

      {/* Empty / Holiday */}
      {data?.leaveRequestId &&
        data?.leaveRequestId.duration === LeaveDuration.FULL_DAY && (
          <div className="flex min-h-[115px] flex-col items-center justify-center px-2">
            <Image
              src={Holiday}
              alt="Holiday"
              className="h-10 w-10 object-contain"
            />

            <span className="text-center text-md font-semibold text-warning">
              {data.leaveRequestId?.leaveId?.name}
            </span>
          </div>
        )}

      {/* Attendance */}
      {!data?.leaveRequestId &&
        data?.attendanceStatus === AttendanceStatusEnum.PRESENT &&
        !data?.isHalfDay && (
          <div className="flex flex-col items-center">
            {/* Attendance image */}

            <Image
              src={Present}
              alt="Present"
              className="h-10 w-10 object-contain"
            />

            {/* Time */}
            <div className="mt-4 flex items-start gap-2">
              {data.inTime && (
                <div className="flex flex-col gap-1 text-center">
                  <span
                    className={`
                    inline-block
                    border
                    px-2
                    py-1
                    text-sm
                    bg-white
                    ${data.lateMinutes > 0 ? "border-danger " : "border-success "}
                  `}
                  >
                    {formatDate(data.inTime, DateFormat.TIME_24)}
                  </span>

                  {data.lateMinutes > 0 && (
                    <div className="text-[10px] text-secondary/60">
                      {data.lateMinutes} min
                    </div>
                  )}
                </div>
              )}

              {data.outTime && (
                <div className="flex flex-col gap-1 text-center">
                  <span
                    className={`
                    inline-block
                    border
                    px-2
                    py-1
                    text-sm
                    bg-white
                    ${data.earlyExitMinutes > 0 ? "border-danger " : "border-success "}
                  `}
                  >
                    {formatDate(data.outTime, DateFormat.TIME_24)}
                  </span>

                  {data.earlyExitMinutes > 0 && (
                    <div className="text-[10px] text-secondary/60">
                      {data.earlyExitMinutes} min
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      {data?.isHalfDay && data.leaveRequestId && (
        <div className="flex flex-col items-center">
          {/* Attendance image */}

          <Image
            src={Present}
            alt="Present"
            className="h-10 w-10 object-contain"
          />
          <div
            className={`flex min-h-[105px] items-center justify-center gap-3 ${data.leaveRequestId.duration === LeaveDuration.FIRST_HALF ? "flex-row" : "flex-row-reverse"}`}
          >
            <span
              className={`
              border
              px-2
              py-1
              text-xs
              font-medium
              border-warning
              bg-white
              text-warning
            `}
            >
              {getFirstCharacter(data.leaveRequestId?.leaveId.name)}
            </span>

            <div className="flex flex-col gap-1">
              {data.inTime && (
                <div className="flex items-center gap-1 text-center">
                  <span
                    className={`
                    inline-block
                    border
                    px-2
                    py-1
                    text-sm
                    bg-white
                    ${data.lateMinutes > 0 ? "border-danger " : "border-success "}
                  `}
                  >
                    {formatDate(data.inTime, DateFormat.TIME_24)}
                  </span>

                  {data.lateMinutes > 0 && (
                    <div className="text-[10px] text-secondary/60">
                      {data.lateMinutes} min
                    </div>
                  )}
                </div>
              )}

              {data.outTime && (
                <div className="flex items-center gap-1 text-center">
                  <span
                    className={`
                    inline-block
                    border
                    px-2
                    py-1
                    text-sm
                    bg-white
                    ${data.earlyExitMinutes > 0 ? "border-danger " : "border-success "}
                  `}
                  >
                    {formatDate(data.outTime, DateFormat.TIME_24)}
                  </span>

                  {data.earlyExitMinutes > 0 && (
                    <div className="text-[10px] text-secondary/60">
                      {data.earlyExitMinutes} min
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Week Off */}
      {(data?.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
        data?.attendanceStatus === AttendanceStatusEnum.HOLIDAY) && (
        <div className="flex justify-center mt-4 px-2">
          <Image
            src={Holiday}
            alt="Holiday"
            className="h-[60px] w-[60px] object-contain bg-white p-1"
          />
        </div>
      )}

      {/* Absent */}
      {data?.attendanceStatus === AttendanceStatusEnum.ABSENT && (
        <div className="flex min-h-[105px] flex-col items-center justify-center">
          <Image
            src={Absent}
            alt="Absent"
            className="h-10 w-10 object-contain"
          />

          <span className="mt-2 text-md font-semibold text-danger">Absent</span>
        </div>
      )}
    </div>
  );
};

export default CalendarDayBox;
