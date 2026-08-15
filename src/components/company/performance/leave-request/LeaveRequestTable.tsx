import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { ILeaveRequest } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import {
  formatDate,
  getDateDifferenceInDays,
} from "../../../../utils/date-format";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { HistoryFieldEnum } from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";

interface ILeaveRequestListProps {
  leaves: ILeaveRequest[];
  handleUpdateStatus: (value: ILeaveRequest) => void;
}

export default function LeaveRequestTable({
  leaves,
  handleUpdateStatus,
}: ILeaveRequestListProps) {
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
      header: "Start Date",
      className: "w-[15%]",
      render: (row) => <span>{formatDate(row.startDate)}</span>,
    },
    {
      header: "End Date",
      className: "w-[15%]",
      render: (row) => <span>{formatDate(row.endDate)}</span>,
    },
    {
      header: "Leave Days",
      className: "w-[15%] text-center",
      render: (row) => (
        <span className="flex justify-center">
          {getDateDifferenceInDays(row.startDate, row.endDate)}
        </span>
      ),
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
            <i
              onClick={() => handleUpdateStatus(row)}
              className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
            ></i>
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
