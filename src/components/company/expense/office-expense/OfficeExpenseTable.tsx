import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  pathNames,
  roleNames,
} from "../../../../constants/constants";
import { IOfficeExpense } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { HistoryFieldEnum, RoleEnum } from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import { useAuthStore } from "../../../../store/auth-store";
import StatusCell from "../../../common/status-cell";

interface IOfficeExpenseListProps {
  officeExpenses: IOfficeExpense[];
  handleUpdateStatus: (value: IOfficeExpense) => void;
}

export default function OfficeExpenseTable({
  officeExpenses,
  handleUpdateStatus,
}: IOfficeExpenseListProps) {
  const navigate = useNavigate();
  const {user} = useAuthStore();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleEditDepartmentDetails = (officeExpenseId: string) => {
    navigate(pathNames.OFFICE_EXPENSE_DETAILS, {
      state: {
        officeExpenseId,
      },
    });
  };
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IOfficeExpense>[] = [
    {
      header: "#",
      className: " text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Expense Name",
      className: "",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
            onClick={() => handleEditDepartmentDetails(row._id)}
          >
            {row.name}
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "For Branch",
      className: "",
      render: (row) => row.branchId.name,
    },
    {
      header: "Expense Date",
      className: "",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Request Date",
      className: "",
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
      header: "Added By",
      className: "",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row.assignedBy.profileImage,
            firstName: row.assignedBy.firstName,
            lastName: row.assignedBy.lastName,
            description: roleNames[row.assignedBy.role],
          }}
        />
      ),
    },
    {
      header: "Amount",
      className: "",
      render: (row) => (
        <span className="font-medium text-secondary">
          {currency.INR} {row.amount}
        </span>
      ),
    },
    {
      header: "Status",
      className: "",
      render: (row) => {
        const isManager = row.assignedBy._id === user._id && user.role === RoleEnum.MANAGER;
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
  const handleShowHistory = (expense: IOfficeExpense) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.OfficeExpenseStatus,
      fieldId: expense._id,
      title: expense.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={officeExpenses} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
        isMailHistory={history.field === HistoryFieldEnum.PromotionMail}
      />  
    </>
  );
}
