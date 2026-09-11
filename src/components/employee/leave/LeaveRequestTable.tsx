import { IEmployeeLeaveRequest } from ".";
import { useState } from "react";
import {
  HistoryPayload,
  initialHistory,
} from "../../../apis/history/history.api";
import { ColumnDef, CustomTable } from "../../common/table";
import { DateFormat, formatDate } from "../../../utils/date-format";
import InfoIcon from "../../../assets/icons/Info";
import { statusColor, statusMessage } from "../../../constants/constants";
import {
  HistoryFieldEnum,
  LeaveDurationNames,
} from "../../../types/common-types";
import HistoryModal from "../../common/modal/HistoryModal";
import { getFirstCharacter } from "../../../utils/helper";
import Description from "../../common/description";

interface IEmployeeLeaveRequestListProps {
  leaves: IEmployeeLeaveRequest[];
}

export default function EmployeeLeaveRequestTable({
  leaves,
}: IEmployeeLeaveRequestListProps) {
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IEmployeeLeaveRequest>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Leave Date",
      className: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium border-r border-inputBorder pr-1">
            {formatDate(row.startDate)}
          </span>
          <span className="border-r text-xs border-inputBorder pr-1">
            {LeaveDurationNames[row.duration]}
          </span>
          <span className="text-xs">{getFirstCharacter(row.leaveId.name)}</span>
        </div>
      ),
    },
    {
      header: "Reason",
      className: "",
      render: (row) => <Description value={row.reason} />,
    },
    {
      header: "Request Date",
      className: "w-[15%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.createdAt)}
          <span className="text-grayText text-xs">
            {formatDate(row.createdAt, DateFormat.TIME_24)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      className: "w-[10%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)} />
            <span className={`font-medium text-sm ${statusColor[row.status]}`}>
              {statusMessage[row.status]}
            </span>
          </div>
        );
      },
    },
  ];

  // handle history open
  const handleHistoryOpenClose = () => {
    setHistoryOpen((prev) => !prev);
    setHistory(initialHistory);
  };

  // handle show history
  const handleShowHistory = (leaveRequest: IEmployeeLeaveRequest) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.LeaveApplicationStatus,
      fieldId: leaveRequest._id,
      title: `${leaveRequest.userId.firstName} ${leaveRequest.userId.lastName}`,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={leaves} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
        isMailHistory={history.field === HistoryFieldEnum.PromotionMail}
      />
    </>
  );
}
