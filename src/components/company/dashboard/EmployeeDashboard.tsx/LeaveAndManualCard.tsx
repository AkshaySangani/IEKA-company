import { useNavigate } from "react-router-dom";
import RightArrow from "../../../common/right-arrow";
import { employeePathNames } from "../../../../constants/constants";
import MonthPicker, {
  MonthPickerValue,
} from "../../../common/date-picker/MonthPicker";
import PageLoader from "../../../common/loader/PageLoader";
import { getFirstCharacter } from "../../../../utils/helper";
import {
  LeaveDuration,
  LeaveDurationNames,
  statusEnum,
} from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";

export interface ILeaveItem {
  _id: string;
  leaveId: {
    _id: string;
    name: string;
  };
  startDate: string;
  duration: LeaveDuration;
  status: statusEnum;
}

export interface IManualPunchItem {
  date: string;
  punchType: "In" | "Out" | "Both";
}

interface LeaveAndManualCardProps {
  leaves?: ILeaveItem[];
  manualPunch?: IManualPunchItem[];
  month: MonthPickerValue;
  handleSelectMonth: (value: MonthPickerValue) => void;
  loading: boolean;
}

export default function LeaveAndManualCard({
  leaves = [],
  manualPunch = [],
  month,
  handleSelectMonth,
  loading,
}: LeaveAndManualCardProps) {
  const navigate = useNavigate();

  const hasData = leaves.length > 0 || manualPunch.length > 0;

  return (
    <div className="content-card p-3 sm:p-4 relative overflow-hidden">
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
        "
      >
        {/* Title */}
        <div className="flex items-center min-w-0">
          <i className="fa-solid fa-mug-hot" />

          <span
            className="
              mx-2
              border-r
              border-borderPrimary
              pr-2
              text-md
              font-medium
              text-secondary
              truncate
            "
          >
            Leave & Manual Punch
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(employeePathNames.LEAVE_REQUEST)}
          />
        </div>

        {/* Month */}
        <div className="shrink-0">
          <MonthPicker value={month} onChange={handleSelectMonth} />
        </div>
      </div>

      {/* Cards */}
      <div className="mt-4">
        {!hasData ? (
          <div className="flex min-h-[120px] items-center justify-center text-sm text-gray-400">
            No leave or manual punch found
          </div>
        ) : (
          <div
            className="
              flex
              flex-col
              gap-3
              pb-2
            "
          >
            <div className="flex flex-wrap gap-2">
              {/* Leave Cards */}
              {leaves
                .filter((ele) => ele.status === statusEnum.APPROVED)
                .map((leave: ILeaveItem) => (
                  <div
                    key={`leave-${leave.startDate}-${leave.leaveId.name}`}
                    className="
                  min-w-[100px]
                  w-[100px]
                  h-[100px]
                  shrink-0
                  bg-[#f5f5f5]
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-none
                "
                  >
                    {/* Date */}
                    <div className="text-md font-medium text-secondary">
                      {formatDate(leave.startDate, DateFormat.DAY)}
                    </div>

                    {/* Leave name */}
                    <div className="mt-2 text-md font-medium text-success">
                      {getFirstCharacter(leave.leaveId.name)}
                    </div>

                    {/* Duration */}
                    <div className="mt-2 text-xs text-gray-500">
                      {LeaveDurationNames[leave.duration]}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Manual Punch Cards */}
              {manualPunch.map((punch) => (
                <div
                  key={`manual-${punch.date}-${punch.punchType}`}
                  className="
                  min-w-[100px]
                  w-[100px]
                  h-[35px]
                  shrink-0
                  bg-[#f5f5f5]
                  flex
                  flex-row
                  items-center
                  justify-between
                  px-2
                  rounded-none
                "
                >
                  {/* Date */}
                  <div className="text-md font-medium text-secondary">
                    {punch.date}
                  </div>

                  {/* Punch type */}
                  <div className="text-sm text-grayText">{punch.punchType}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
