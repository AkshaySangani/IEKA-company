import { useNavigate } from "react-router-dom";
import RightArrow from "../../common/right-arrow";
import EmployeeActivityCard from "../../common/statecard/EmployeeActivityCard";
import { pathNames } from "../../../constants/constants";
import TextField from "../../common/text-field/TextField";
import { IAttendanceSummary } from ".";
import { ReactNode } from "react";
import PageLoader from "../../common/loader/PageLoader";

interface AttendanceSummaryCardProps {
  attendanceSummary: IAttendanceSummary;
  date: string;
  handleDateChange: (value: string) => void;
  loading: boolean;
}

export default function AttendanceSummaryCard({
  attendanceSummary,
  date,
  handleDateChange,
  loading,
}: AttendanceSummaryCardProps) {
  const navigate = useNavigate();

  const attendanceSummaryList: {
    key: keyof Omit<IAttendanceSummary, "attendanceList" | "leavesList" | "">;
    label: string;
    icon: ReactNode;
    countClass: string;
  }[] = [
    {
      key: "totalEmployee",
      label: "Total Employee",
      icon: <i className="fa-solid fa-users" />,
      countClass: "text-secondary",
    },
    {
      key: "totalPresent",
      label: "Present",
      icon: <i className="fa-solid fa-user-check" />,
      countClass: "text-success",
    },
    {
      key: "totalAbsent",
      label: "Absent",
      icon: <i className="fa-solid fa-user-minus" />,
      countClass: "text-danger",
    },
    {
      key: "totalLeaves",
      label: "On Leave",
      icon: <i className="fa-solid fa-mug-hot" />,
      countClass: "text-warning",
    },
  ];

  return (
    <div className="content-card relative w-full bg-white p-3 shadow-[rgba(50,50,93,0.25)_0px_1px_3px_-5px,rgba(0,0,0,0.3)_0px_7px_15px_-8px] sm:p-4">
      <PageLoader loading={loading} />

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-borderPrimary pb-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="flex items-center">
          <i className="fa-solid fa-user-plus text-secondary" />

          <span className="mx-2 border-r border-borderPrimary pr-2 text-md font-medium text-secondary">
            Attendance
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(pathNames.ATTENDANCE)}
          />
        </div>

        {/* Date */}
        <div className="w-full sm:w-[150px]">
          <TextField
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-[1fr_2fr] md:gap-5 md:pt-5">
        {/* ================= LEFT ================= */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 md:flex md:flex-col md:justify-center md:border-r md:border-borderPrimary md:pr-5">
          {attendanceSummaryList.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center justify-between py-2"
            >
              {/* Label */}
              <div className="flex min-w-0 items-center gap-2 text-grayText">
                <span className="w-4 shrink-0 text-center text-xs">
                  {item.icon}
                </span>

                <span className="truncate text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>

              {/* Count */}
              <span
                className={`ml-2 shrink-0 text-sm font-medium ${item.countClass}`}
              >
                {attendanceSummary[item.key]}
              </span>
            </div>
          ))}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <EmployeeActivityCard
            title="Leave Request"
            className="md:w-[50%]"
            icon={<i className="fa-solid fa-person-walking" />}
            count={attendanceSummary.leavesList.length}
            users={attendanceSummary.leavesList.map((ele) => ({
              ...ele.userId,
            }))}
            onClick={() => navigate(pathNames.LEAVE_REQUEST)}
          />

          <EmployeeActivityCard
            title="Manual Punch"
            className="md:w-[50%]"
            icon={<i className="fa-solid fa-hand-pointer" />}
            count={attendanceSummary.attendanceList.length}
            users={attendanceSummary.attendanceList.map((ele) => ({
              ...ele.userId,
            }))}
            onClick={() => navigate(pathNames.ATTENDANCE)}
          />
        </div>
      </div>
    </div>
  );
}
