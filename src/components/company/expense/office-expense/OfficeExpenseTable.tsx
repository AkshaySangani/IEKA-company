import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IOfficeExpense } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { HistoryFieldEnum } from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";

interface IOfficeExpenseListProps {
  officeExpenses: IOfficeExpense[];
  handleUpdateStatus: (value: IOfficeExpense) => void;
}

export default function OfficeExpenseTable({
  officeExpenses,
  handleUpdateStatus,
}: IOfficeExpenseListProps) {
  const navigate = useNavigate();

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
      className: "w-[3%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Expense Name",
      className: "w-[20%]",
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
      className: "w-[15%]",
      render: (row) => row.branchId.name,
    },
    {
      header: "Expense Date",
      className: "w-[11%]",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Request Date",
      className: "w-[11%]",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">
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
      className: "w-[20%]",
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
      className: "w-[10%]",
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
