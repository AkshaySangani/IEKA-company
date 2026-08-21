import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
} from "../../../../constants/constants";
import { IUserAttendance } from ".";
import { useNavigate } from "react-router-dom";
import {
  AttendanceMethodNames,
  AttendanceStatusEnum,
} from "../../../../types/common-types";
import PersonInfo from "../../../common/person-info";
import AttendanceStatusBadge from "../../../common/badge/AttendanceBadge";
import AttendanceCell, { LeaveType } from "../../../common/attendance-cell";
import {
  DateFormat,
  formatDate,
  formatMinutes,
} from "../../../../utils/date-format";

interface IUserAttendanceListProps {
  attendance: IUserAttendance[];
}

export default function AttendanceTable({
  attendance
}: IUserAttendanceListProps) {
  const navigate = useNavigate();

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IUserAttendance>[] = [
    {
      header: "#",
      className: "w-[3%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[20%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row.userId.profileImage,
            firstName: row.userId.firstName,
            lastName: row.userId.lastName,
            description: roleNames[row.userId.role],
          }}
          onClick={() => navigate(`${pathNames.ATTENDANCE_DETAILS}/${row.userId._id}`)}
        />
      ),
    },
    {
      header: "Status",
      className: "w-[10%] text-center",
      render: (row) => {
        return (
          <>
            {row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? <div className="bg-yellowBlur p-3">
                <span className="text-md font-semibold text-warning">Week Off</span>
            </div> : <div className="flex justify-center"><AttendanceStatusBadge status={row.attendanceStatus} /></div>}
          </>
        );
      },
      colSpan: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? 4 : 0
    },
    {
      header: "Check In / Out",
      className: "w-[30%] text-center",
      hidden: (row) => row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ? true : false,
      render: (attendance) => (
        <div className="flex justify-center">
          {/* Present */}
          <AttendanceCell
            data={{
              inPunch: attendance.inTime && attendance.inMethod
                ? {
                    time: formatDate(attendance.inTime, DateFormat.TIME_24),
                    source: AttendanceMethodNames[attendance.inMethod],
                  }
                : undefined,

              outPunch: attendance.outTime && attendance.outMethod
                ? {
                    time: formatDate(attendance.outTime, DateFormat.TIME_24),
                    source: AttendanceMethodNames[attendance.outMethod],
                  }
                : undefined,

              inLeave: attendance.isHalfDay && attendance.lateMinutes
                ? {
                    type: LeaveType.SL,
                    color: "border-pending text-pending",
                  }
                : undefined,

              outLeave: attendance.isHalfDay && attendance.earlyExitMinutes
                ? {
                    type: LeaveType.SL,
                    color: "border-pending text-pending",
                  }
                : undefined,

              fullDayLeave:
                attendance.attendanceStatus === AttendanceStatusEnum.LEAVE
                  ? {
                      type: LeaveType.SL,
                      color: "border-pending text-pending",
                    }
                  : undefined,
            }}
          />
        </div>
      ),
    },
    {
      header: "Late In / Early Out",
      className: "w-[27%] text-center",
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
      render: (row) => <div className="flex justify-center">{row.totalWorkedMinutes ? formatMinutes(row.totalWorkedMinutes) : "-"}</div>,
    },
  ];

  return (
    <>
      <CustomTable columns={columns} data={attendance} />
    </>
  );
}
