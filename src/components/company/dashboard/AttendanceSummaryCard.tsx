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
      countClass: "text-[#333]",
    },
    {
      key: "totalPresent",
      label: "Present",
      icon: <i className="fa-solid fa-user-check" />,
      countClass: "text-green-600",
    },
    {
      key: "totalAbsent",
      label: "Absent",
      icon: <i className="fa-solid fa-user-minus" />,
      countClass: "text-red-500",
    },
    {
      key: "totalLeaves",
      label: "On Leave",
      icon: <i className="fa-solid fa-mug-hot" />,
      countClass: "text-orange-500",
    },
  ];

  return (
    <div className="content-card p-[15px] relative">
      <PageLoader loading={loading} />
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center">
          <i className="fa-solid fa-user-plus"></i>

          <span className="px-2 text-md font-medium border-r mr-2">
            Attendance
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(pathNames.ATTENDANCE)}
          />
        </div>

        <div className="w-[150px]">
          <TextField
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[1fr_2fr] gap-6 pt-5">
        {/* ================= LEFT ================= */}
        <div className="flex flex-col justify-center border-r pr-6">
          {attendanceSummaryList.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-[8px]"
            >
              {/* Label */}
              <div className="flex items-center gap-3 text-[#667085]">
                <span className="w-[18px] text-center text-[15px]">
                  {item.icon}
                </span>

                <span className="text-sm">{item.label}</span>
              </div>

              {/* Count */}
              <span className={`text-sm font-medium ${item.countClass}`}>
                {attendanceSummary[item.key]}
              </span>
            </div>
          ))}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex flex-col gap-3">
          <EmployeeActivityCard
            title="Leave Request"
            icon={<i className="fa-solid fa-person-walking" />}
            count={attendanceSummary.leavesList.length}
            users={attendanceSummary.leavesList.map((ele) => ({
              ...ele.userId,
            }))}
            onClick={() => navigate(pathNames.LEAVE)}
          />

          <EmployeeActivityCard
            title="Manual Punch"
            icon={<i className="fa-solid fa-hand-pointer"></i>}
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
