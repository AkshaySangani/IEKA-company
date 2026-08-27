import { useNavigate } from "react-router-dom";
import { IEmployeeLeaveRequest } from ".";
import { useState } from "react";
import { HistoryPayload, initialHistory } from "../../../apis/history/history.api";
import { ColumnDef, CustomTable } from "../../common/table";
import { formatDate } from "../../../utils/date-format";
import InfoIcon from "../../../assets/icons/Info";
import { statusColor, statusMessage } from "../../../constants/constants";
import { HistoryFieldEnum, LeaveDurationNames } from "../../../types/common-types";
import HistoryModal from "../../common/modal/HistoryModal";
import { getFirstCharacter } from "../../../utils/helper";


interface IEmployeeLeaveRequestListProps {
  leaves: IEmployeeLeaveRequest[];
  handleUpdateStatus: (value: IEmployeeLeaveRequest) => void;
}

export default function EmployeeLeaveRequestTable({
  leaves,
  handleUpdateStatus,
}: IEmployeeLeaveRequestListProps) {
  const navigate = useNavigate();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IEmployeeLeaveRequest>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Leave Date",
      className: "w-[25%]",
      render: (row) => <div className="flex items-center gap-2"><span className="text-primary font-medium border-r border-inputBorder pr-1">{formatDate(row.startDate)}</span>
      <span className="border-r text-xs border-inputBorder pr-1">{LeaveDurationNames[row.duration]}</span>
      <span className="">{getFirstCharacter("")}</span>
      </div>,
    },
    {
      header: "Reason",
      className: "w-[35%]",
      render: (row) => <span className="line-clamp-2">{row.reason}</span>,
    },
    {
      header: "Request Date",
      className: "w-[15%]",
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
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
