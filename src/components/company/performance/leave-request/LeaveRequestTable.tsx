import { ColumnDef, CustomTable } from "../../../common/table";
import { pathNames, roleNames } from "../../../../constants/constants";
import { ILeaveRequest } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import {
  HistoryFieldEnum,
  LeaveDurationNames,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";
import { useAuthStore } from "../../../../store/auth-store";
import ActionModal from "../../../common/modal/ActionModal";
import { deleteLeaveRequest } from "../../../../apis/performance/leave-request.api";

interface ILeaveRequestListProps {
  leaves: ILeaveRequest[];
  handleUpdateStatus: (value: ILeaveRequest) => void;
  refreshData: () => void;
}

export default function LeaveRequestTable({
  leaves,
  handleUpdateStatus,
  refreshData,
}: ILeaveRequestListProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const [actionOpen, setActionOpen] = useState<boolean>(false);
  const [expenseId, setExpenseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = (row?: ILeaveRequest) => {
    setActionOpen((prev) => !prev);
    if (row && row?._id) {
      setExpenseId(row._id);
    } else {
      setExpenseId("");
    }
  };

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<ILeaveRequest>[] = [
    {
      header: "#",
      className: "",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "",
      // isSticky: true,
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row.userId.profileImage,
            firstName: row.userId.firstName,
            lastName: row.userId.lastName,
            description: `${row.userId.userId} | ${roleNames[row.userId.role]}`,
          }}
          onClick={() =>
            navigate(`${pathNames.LEAVE_REQUEST_DETAILS}/${row._id}`)
          }
        />
      ),
    },
    {
      header: "Leave Date",
      className: "",
      render: (row) => <span>{formatDate(row.startDate)}</span>,
    },
    {
      header: "Leave Duration",
      className: "",
      render: (row) => LeaveDurationNames[row.duration],
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
        const isManager =
          user.role === RoleEnum.MANAGER && row.userId._id === user._id;
        const isDeletable =
          row.userId._id === user._id && row.status === statusEnum.PENDING;
        return (
          <StatusCell
            status={row.status}
            isEditable={!isManager}
            onHistory={() => handleShowHistory(row)}
            onEdit={() => handleUpdateStatus(row)}
            isDeletable={isDeletable}
            onDelete={() => handleAction(row)}
          />
        );
      },
    },
  ];

  const handleOnConfirm = async () => {
    setLoading(true);
    const response = await deleteLeaveRequest(expenseId);
    if (response.success) {
      refreshData();
    }
    setLoading(false);
  };

  // handle history open
  const handleHistoryOpenClose = () => {
    setHistoryOpen((prev) => !prev);
    setHistory(initialHistory);
  };

  // handle show history
  const handleShowHistory = (leaveRequest: ILeaveRequest) => {
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
