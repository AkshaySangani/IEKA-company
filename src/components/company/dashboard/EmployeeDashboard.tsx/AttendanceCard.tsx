import { useNavigate } from "react-router-dom";
import RightArrow from "../../../common/right-arrow";
import { employeePathNames } from "../../../../constants/constants";
import { AttendanceStatusEnum } from "../../../../types/common-types";
import AttendanceStatusBadge from "../../../common/badge/AttendanceBadge";
import MonthPicker, {
  MonthPickerValue,
} from "../../../common/date-picker/MonthPicker";
import { formatMinutes } from "../../../../utils/date-format";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import PageLoader from "../../../common/loader/PageLoader";

export interface IAttendanceCard {
  attendanceDate: string;
  attendanceStatus: AttendanceStatusEnum;

  isManualPunchIn: boolean;
  isManualPunchOut: boolean;

  totalWorkedMinutes: number;
}

interface AttendanceCardProps {
  attendance?: IAttendanceCard[];
  month: MonthPickerValue;
  handleSelectMonth: (value: MonthPickerValue) => void;
  loading: boolean;
}

const getAttendanceDay = (attendanceDate: string): string => {
  return new Date(attendanceDate).getDate().toString();
};

export default function AttendanceCard({
  attendance = [],
  month,
  handleSelectMonth,
  loading,
}: AttendanceCardProps) {
  const navigate = useNavigate();

  return (
    <div className="content-card p-3 sm:p-4 relative">
      <PageLoader loading={loading} />
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-borderPrimary
          pb-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-2
        "
      >
        {/* Title */}
        <div className="flex items-center">
          <i className="fa-solid fa-user-plus text-secondary" />

          <span className="mx-2 border-r border-borderPrimary pr-2 text-md font-medium text-secondary">
            Total Expense
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(employeePathNames.ATTENDANCE)}
          />
        </div>

        {/* Date Filter */}
        {/* <div className="w-full sm:w-auto"> */}
        <MonthPicker value={month} onChange={handleSelectMonth} />
        {/* </div> */}
      </div>

      {/* Attendance */}
      <div
        className="py-4  flex
            flex-wrap
            gap-1
            overflow-hidden
            sm:gap-2"
      >
        {attendance.length > 0 ? (
          attendance.map((item) => {
            return (
              <div
                key={item.attendanceDate}
                className="
                  flex
                  h-[100px]
                  w-[58px]
                  shrink-0
                  flex-col
                  items-center
                  justify-between
                  border
                  bg-white
                  px-1
                  py-2
                  content-card
                  sm:h-[100px]
                  sm:w-[62px]
                "
              >
                {/* Date */}
                <span className="text-sm font-medium text-secondary">
                  {getAttendanceDay(item.attendanceDate)}
                </span>

                {/* Status */}
                <AttendanceStatusBadge status={item.attendanceStatus} />

                {/* Worked Time */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-grayText">
                    {item.totalWorkedMinutes
                      ? formatMinutes(item.totalWorkedMinutes)
                      : "-"}
                    {item.isManualPunchIn || item.isManualPunchOut
                      ? " (M)"
                      : ""}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full">
            <EmptyPlaceholder
              title="No Attendance found!"
              description="There is currently no attendance for this month. please select different month."
            />
          </div>
        )}
      </div>
    </div>
  );
}
