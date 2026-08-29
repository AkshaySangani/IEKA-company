import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  employeePathNames,
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IReimbursement } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { HistoryFieldEnum, RoleEnum } from "../../../../types/common-types";
import { useAuthStore } from "../../../../store/auth-store";
import StatusCell from "../../../common/status-cell";

interface IReimbursementListProps {
  reimbursements: IReimbursement[];
  handleUpdateStatus: (value: IReimbursement) => void;
}

export default function DepartmentTable({
  reimbursements,
  handleUpdateStatus,
}: IReimbursementListProps) {
  const { user } = useAuthStore();
  const isEmployee = user.role === RoleEnum.EMPLOYEE;
  const navigate = useNavigate();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleShowDetails = (reimbursementId: string) => {
    navigate(isEmployee ? employeePathNames.REIMBURSEMENT_DETAILS : pathNames.REIMBURSEMENT_DETAILS, {
      state: {
        reimbursementId,
      },
    });
  };
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IReimbursement>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Expense Name",
      className: "w-[20%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
            onClick={() => handleShowDetails(row._id)}
          >
            {row.name}
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    ...(isEmployee
      ? []
      : [
          {
            header: "Employee Name",
            className: "w-[20%]",
            render: (row: IReimbursement) => (
              <PersonInfo
                personInfo={{
                  profileImage: row.userId.profileImage,
                  firstName: row.userId.firstName,
                  lastName: row.userId.lastName,
                  description: roleNames[row.userId.role],
                }}
              />
            ),
          },
        ]),
    {
      header: "Expense Date",
      className: "w-[15%]",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Request Date",
      className: "w-[15%]",
      render: (row) => (
        <div>
          <div className="text-gray-600 text-sm">
            {formatDate(row.createdAt)}
          </div>

          <div className="text-xs text-gray-400">
            {formatDate(row.createdAt, DateFormat.TIME_24)}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      className: "w-[15%]",
      render: (row) => (
        <span className="font-medium text-secondary">
          {currency.INR} {row.amount}
        </span>
      ),
    },
    {
      header: "Status",
      className: "w-[10%]",
      render: (row) => {
        const isManager =
          row?.userId._id === user._id && user.role === RoleEnum.MANAGER;
        return (
          <StatusCell
            status={row.status}
            isEditable={!isManager && !isEmployee}
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
  const handleShowHistory = (reimbursement: IReimbursement) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.ReimbursementStatus,
      fieldId: reimbursement._id,
      title: reimbursement.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={reimbursements} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
        isMailHistory={history.field === HistoryFieldEnum.PromotionMail}
      />
    </>
  );
}
