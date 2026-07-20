import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  pathNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { initialOfficeExpense, IOfficeExpense } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";

interface IOfficeExpenseListProps {
  officeExpenses: IOfficeExpense[];
  handleUpdateStatus: (value: IOfficeExpense) => void;
}

export default function OfficeExpenseTable({
  officeExpenses,
  handleUpdateStatus,
}: IOfficeExpenseListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [departmentDetails, setDepartmentDetails] =
    useState<IOfficeExpense>(initialOfficeExpense);

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
            className="text-primary cursor-pointer text-sm font-semibold"
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
          <div className="font-semibold text-gray-900 text-sm">
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
            description: row.assignedBy.role,
          }}
        />
      ),
    },
    {
      header: "Amount",
      className: "w-[10%]",
      render: (row) => (
        <span className="font-semibold text-secondary">
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
            <span
              className={`font-semibold text-sm ${statusColor[row.status]}`}
            >
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
    setDepartmentDetails(initialOfficeExpense);
  };

  // handle show history
  const handleShowHistory = (branch: IOfficeExpense) => {
    handleHistoryOpenClose();
    setDepartmentDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={officeExpenses} />
      <StatusHistory
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        shiftDetails={departmentDetails}
      />
    </>
  );
}
