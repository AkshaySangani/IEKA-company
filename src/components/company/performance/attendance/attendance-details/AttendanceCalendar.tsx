// AttendanceCalendar.tsx

import { useMemo } from "react";
import { MonthPickerValue } from "../../../../common/date-picker/MonthPicker";
import { formatDate, getMonthDays } from "../../../../../utils/date-format";
import CalendarDayBox from "../../../../common/calender/CalendarDayBox";
import { IUserAttendance } from "..";

interface AttendanceCalendarProps {
  selectedMonth: MonthPickerValue;
  attendanceData?: IUserAttendance[];
  onDateClick?: (date: Date) => void;
}

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AttendanceCalendar = ({
  selectedMonth,
  attendanceData = [],
  onDateClick,
}: AttendanceCalendarProps) => {
  const monthDays = useMemo(
    () => getMonthDays(selectedMonth),
    [selectedMonth]
  );

  const attendanceMap = useMemo(() => {
    const map = new Map<string, IUserAttendance>();

    attendanceData.forEach((item) => {
      const key = formatDate(item.attendanceDate);

      map.set(key, item);
    });

    return map;
  }, [attendanceData]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px] pb-4 overflow-x-auto">
        {/* Week Header */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day}
              className="
                flex
                h-11
                items-center
                justify-center
                border
                border-slate-200
                bg-slate-100
                text-sm
                font-semibold
                text-slate-800
              "
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {monthDays.map((date, index) => {
            if (!date) {
              return (
                <CalendarDayBox
                  key={`empty-${index}`}
                  date={null}
                />
              );
            }

            const key = formatDate(date);

            return (
              <CalendarDayBox
                key={key}
                date={new Date(date).getDate()}
                data={attendanceMap.get(key)}
              />
            );
          })}
        </div>
      </div>
      </div>
  );
};

export default AttendanceCalendar;