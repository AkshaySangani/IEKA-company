import { ColumnDef, CustomTable } from "../../../../common/table";
import { formatDate, formatMinutes } from "../../../../../utils/date-format";
import AttendanceStatusBadge from "../../../../common/badge/AttendanceBadge";
import { AttendanceStatusEnum } from "../../../../../types/common-types";
import TableStatusRow from "../../../../common/table/TableStatusRow";
import CheckInCheckOut from "../CheckInCheckOut";
import { IUserAttendance } from "..";

interface IUserAttendanceListProps {
  attendance: IUserAttendance[];
  refreshData: () => void;
}

export default function EmployeeAttendanceTable({
  attendance,
  refreshData,
}: IUserAttendanceListProps) {
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IUserAttendance>[] = [
    {
      header: "Date",
      className: "",
      render: (row) => formatDate(row.attendanceDate),
    },
    {
      header: "Status",
      className: " text-center",
      render: (row) => {
        return (
          <>
            {row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
            row.attendanceStatus === AttendanceStatusEnum.HOLIDAY ? (
              {
                [AttendanceStatusEnum.WEEK_OFF]: (
                  <TableStatusRow title="Week Off" variant="warning" />
                ),
                [AttendanceStatusEnum.HOLIDAY]: (
                  <TableStatusRow title="Holiday" variant="info" />
                ),
              }[row.attendanceStatus]
            ) : (
              <div className="flex justify-center">
                <AttendanceStatusBadge status={row.attendanceStatus} />
              </div>
            )}
          </>
        );
      },
      colSpan: (row) =>
        row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
        row.attendanceStatus === AttendanceStatusEnum.HOLIDAY
          ? 4
          : 0,
    },
    {
      header: "Check In / Out",
      className: " text-center",
      hidden: (row) =>
        row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
        row.attendanceStatus === AttendanceStatusEnum.HOLIDAY
          ? true
          : false,
      render: (attendance) => (
        <CheckInCheckOut attendance={attendance} refreshData={refreshData} />
      ),
    },
    {
      header: "Late In / Early Out",
      className: " text-center",
      hidden: (row) =>
        row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
        row.attendanceStatus === AttendanceStatusEnum.HOLIDAY
          ? true
          : false,
      render: (row) => (
        <>
          {row.lateMinutes || row.earlyExitMinutes ? (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">In</span>
                <span
                  className={
                    row.lateMinutes
                      ? "font-medium text-danger"
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
                      ? "font-medium text-danger"
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
      className: " text-center",
      hidden: (row) =>
        row.attendanceStatus === AttendanceStatusEnum.WEEK_OFF ||
        row.attendanceStatus === AttendanceStatusEnum.HOLIDAY
          ? true
          : false,
      render: (row) => (
        <div
          className={`flex justify-center font-medium ${row.isLate || row.earlyExitMinutes ? "text-danger" : "text-success"}`}
        >
          {row.totalWorkedMinutes ? formatMinutes(row.totalWorkedMinutes) : "-"}
        </div>
      ),
    },
  ];

  return <CustomTable columns={columns} data={attendance} />;
}
