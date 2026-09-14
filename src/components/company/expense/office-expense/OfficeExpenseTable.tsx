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
import { HistoryFieldEnum, RoleEnum, statusEnum } from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import { useAuthStore } from "../../../../store/auth-store";
import StatusCell from "../../../common/status-cell";
import ActionModal from "../../../common/modal/ActionModal";
import { deleteOfficeExpense } from "../../../../apis/expense/office-expense.api";

interface IOfficeExpenseListProps {
  officeExpenses: IOfficeExpense[];
  handleUpdateStatus: (value: IOfficeExpense) => void;
  refreshData: () => void;
}

export default function OfficeExpenseTable({
  officeExpenses,
  handleUpdateStatus,
  refreshData
}: IOfficeExpenseListProps) {
  const navigate = useNavigate();
  const {user} = useAuthStore();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);
  
  const [actionOpen, setActionOpen] = useState<boolean>(false);
  const [expenseId, setExpenseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = (row?: IOfficeExpense) => {
    setActionOpen((prev) => !prev);
    if(row && row?._id){
      setExpenseId(row._id)
    } else {
      setExpenseId("");
    }
  };

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
      className: "",
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
            description: `${row.assignedBy.userId} | ${roleNames[row.assignedBy.role]}`,
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
        const isManager = user.role === RoleEnum.MANAGER;
        const isDeletable = row.assignedBy._id === user._id && row.status === statusEnum.PENDING;
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
    const response = await deleteOfficeExpense(expenseId);
    if(response.success){
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
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to delete this expense?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
}
