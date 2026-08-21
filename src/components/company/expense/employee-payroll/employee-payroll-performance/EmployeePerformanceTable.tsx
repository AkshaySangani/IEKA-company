import { IUserAttendance } from ".";
import { ColumnDef, CustomTable } from "../../../../common/table";
import {
  DateFormat,
  formatDate,
  formatMinutes,
} from "../../../../../utils/date-format";
import AttendanceStatusBadge from "../../../../common/badge/AttendanceBadge";
import AttendanceCell from "../../../../common/attendance-cell";
import {
  AttendanceMethodNames,
  AttendanceStatusEnum,
} from "../../../../../types/common-types";
import { getFirstCharacter } from "../../../../../utils/helper";

interface IUserAttendanceListProps {
  attendance: IUserAttendance[];
}

export default function EmployeeAttendanceTable({
  attendance,
}: IUserAttendanceListProps) {
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IUserAttendance>[] = [
    {
      header: "Date",
      className: "w-[20%]",
      render: (row) => formatDate(row.attendanceDate),
    },
    {
      header: "Status",
      className: "w-[10%] text-center",
      render: (row) => {
        return (
          <>
            {row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? <div className="bg-yellowBlur p-1">
                <span className="text-md font-semibold text-warning">Week Off</span>
            </div> : <div className="flex justify-center"><AttendanceStatusBadge status={row.attendanceStatus} /></div>}
          </>
        );
      },
      colSpan: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? 4 : 0
    },
    {
      header: "Check In / Out",
      className: "w-[35%] text-center",
      hidden: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? true : false,
      render: (attendance) => (
        <div className="flex justify-center">
          {/* Present */}
          <AttendanceCell
            data={{
              inPunch:
                attendance.inTime && attendance.inMethod
                  ? {
                      time: formatDate(attendance.inTime, DateFormat.TIME_24),
                      source: AttendanceMethodNames[attendance.inMethod],
                    }
                  : undefined,

              outPunch:
                attendance.outTime && attendance.outMethod
                  ? {
                      time: formatDate(attendance.outTime, DateFormat.TIME_24),
                      source: AttendanceMethodNames[attendance.outMethod],
                    }
                  : undefined,

              inLeave:
                attendance.isHalfDay && attendance.lateMinutes && attendance.leaveRequestId
                  ? {
                      type: getFirstCharacter(attendance.leaveRequestId?.leaveId.name),
                      color: "border-warning text-warning",
                    }
                  : undefined,

              outLeave:
                attendance.isHalfDay && attendance.earlyExitMinutes && attendance.leaveRequestId
                  ? {
                      type: getFirstCharacter(attendance.leaveRequestId?.leaveId.name),
                      color: "border-warning text-warning",
                    }
                  : undefined,

              fullDayLeave:
                attendance.attendanceStatus === AttendanceStatusEnum.LEAVE && attendance.leaveRequestId
                  ? {
                      type: getFirstCharacter(attendance.leaveRequestId?.leaveId.name),
                      color: "border-warning text-warning",
                    }
                  : undefined,
            }}
          />
        </div>
      ),
    },
    {
      header: "Late In / Early Out",
      className: "w-[25%] text-center",
      hidden: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? true : false,
      render: (row) => (
        <>
          {row.lateMinutes || row.earlyExitMinutes ? (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">In</span>
                <span
                  className={
                    row.lateMinutes
                      ? "font-medium text-red-500"
                      : "text-gray-400"
                  }
                >
                  {row.lateMinutes ? formatMinutes(row.lateMinutes) : "-"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-gray-500">Out</span>
                <span
                  className={
                    row.earlyExitMinutes
                      ? "font-medium text-red-500"
                      : "text-gray-400"
                  }
                >
                  {row.earlyExitMinutes
                    ? formatMinutes(row.earlyExitMinutes)
                    : "-"}
                </span>
              </div>
            </div>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      header: "Total Hours",
      className: "w-[10%] text-center",
      hidden: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? true : false,
      render: (row) => (
        <div
          className={`flex justify-center text-medium ${row.isLate ? "text-danger" : ""}`}
        >
          {row.totalWorkedMinutes ? formatMinutes(row.totalWorkedMinutes) : "-"}
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={attendance} />;
}
