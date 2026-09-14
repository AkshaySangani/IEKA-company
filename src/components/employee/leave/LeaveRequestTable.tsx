import { IEmployeeLeaveRequest } from ".";
import { useState } from "react";
import {
  HistoryPayload,
  initialHistory,
} from "../../../apis/history/history.api";
import { ColumnDef, CustomTable } from "../../common/table";
import { DateFormat, formatDate } from "../../../utils/date-format";
import {
  HistoryFieldEnum,
  LeaveDurationNames,
  statusEnum,
} from "../../../types/common-types";
import HistoryModal from "../../common/modal/HistoryModal";
import { getFirstCharacter } from "../../../utils/helper";
import Description from "../../common/description";
import StatusCell from "../../common/status-cell";
import ActionModal from "../../common/modal/ActionModal";
import { deleteLeaveRequest } from "../../../apis/performance/leave-request.api";

interface IEmployeeLeaveRequestListProps {
  leaves: IEmployeeLeaveRequest[];
  refreshData: () => void;
}

export default function EmployeeLeaveRequestTable({
  leaves,
  refreshData = () => {},
}: IEmployeeLeaveRequestListProps) {
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const [actionOpen, setActionOpen] = useState<boolean>(false);
  const [expenseId, setExpenseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = (row?: IEmployeeLeaveRequest) => {
    setActionOpen((prev) => !prev);
    if (row && row?._id) {
      setExpenseId(row._id);
    } else {
      setExpenseId("");
    }
  };

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IEmployeeLeaveRequest>[] = [
    {
      header: "#",
      className: "",
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
      className: "",
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
      className: "",
      render: (row) => {
        const isDeletable = row.status === statusEnum.PENDING;
        return (
          <StatusCell
            status={row.status}
            isEditable={false}
            onHistory={() => handleShowHistory(row)}
            isDeletable={isDeletable}
            onDelete={() => handleAction(row)}
          />
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

  const handleOnConfirm = async () => {
    setLoading(true);
    const response = await deleteLeaveRequest(expenseId);
    if (response.success) {
      refreshData();
    }
    setLoading(false);
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
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to delete this leave request?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
}
