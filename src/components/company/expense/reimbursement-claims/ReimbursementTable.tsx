import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  pathNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { initialReimbursement, IReimbursement } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { useNavigate } from "react-router-dom";
import PersonInfo from "../../../common/person-info";
import { formatDate } from "../../../../utils/date-format";

interface IReimbursementListProps {
  reimbursements: IReimbursement[]
  handleUpdateStatus: (value: IReimbursement) => void;
}

export default function DepartmentTable({
  reimbursements,
  handleUpdateStatus,
}: IReimbursementListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [departmentDetails, setDepartmentDetails] = useState<IReimbursement>(initialReimbursement);

  const handleEditDepartmentDetails = (reimbursementId: string) => {
    navigate(pathNames.REIMBURSEMENT_DETAILS, {
      state: {
        reimbursementId
      }
    })
  }
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
      header: "Employee Name",
      className: "w-[20%]",
      render: (row) => <PersonInfo personInfo={{
        profileImage: row.userId.profileImage,
        firstName: row.userId.firstName,
        lastName: row.userId.lastName,
        description: row.userId.role
      }}/>,
    },
    {
      header: "Expense Date",
      className: "w-[15%]",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Request Date",
      className: "w-[15%]",
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: "Amount",
      className: "w-[15%]",
      render: (row) => <span className="font-semibold text-secondary">{currency.INR} {row.amount}</span>,
    },
    {
      header: "Status",
      className: "w-[10%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)}/>
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
    setHistoryOpen(prev => !prev);
    setDepartmentDetails(initialReimbursement);
  }

  // handle show history 
  const handleShowHistory = (branch: IReimbursement) => {
    handleHistoryOpenClose();
    setDepartmentDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={reimbursements} />
  <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} shiftDetails={departmentDetails} />
    </>
);
}
