import { ColumnDef, CustomTable } from "../../../common/table";
import { pathNames, roleNames } from "../../../../constants/constants";
import { ILeaveRequest } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { formatDate } from "../../../../utils/date-format";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import {
  HistoryFieldEnum,
  LeaveDurationNames,
  RoleEnum,
} from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";
import { useAuthStore } from "../../../../store/auth-store";

interface ILeaveRequestListProps {
  leaves: ILeaveRequest[];
  handleUpdateStatus: (value: ILeaveRequest) => void;
}

export default function LeaveRequestTable({
  leaves,
  handleUpdateStatus,
}: ILeaveRequestListProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<ILeaveRequest>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[25%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row.userId.profileImage,
            firstName: row.userId.firstName,
            lastName: row.userId.lastName,
            description: roleNames[row.userId.role],
          }}
          onClick={() =>
            navigate(`${pathNames.LEAVE_REQUEST_DETAILS}/${row._id}`)
          }
        />
      ),
    },
    {
      header: "Leave Date",
      className: "w-[15%]",
      render: (row) => <span>{formatDate(row.startDate)}</span>,
    },
    {
      header: "Leave Duration",
      className: "w-[15%]",
      render: (row) => LeaveDurationNames[row.duration],
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
        const isManager =
          user.role === RoleEnum.MANAGER && row.userId._id === user._id;
        return (
          <StatusCell
            status={row.status}
            isEditable={!isManager}
            onHistory={() => handleShowHistory(row)}
            onEdit={() => handleUpdateStatus(row)}
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
    </>
  );
}
