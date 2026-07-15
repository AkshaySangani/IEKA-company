import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IDepartment } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { useNavigate } from "react-router-dom";
import { statusEnum } from "../../../../types/common-types";

interface IDepartmentListProps {
  departments: IDepartment[]
  handleUpdateStatus: (value: IDepartment) => void;
}

export default function DepartmentTable({
  departments,
  handleUpdateStatus,
}: IDepartmentListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialDepartment: IDepartment = {
  _id: "",
  companyId: "",
  name: "",
  assignments: [],
  status: statusEnum.ACTIVE,
  createdAt: "",
  updatedAt: "",
};
  const [departmentDetails, setDepartmentDetails] = useState<IDepartment>(initialDepartment);

  const handleEditDepartmentDetails = (departmentId: string) => {
    navigate(pathNames.ADD_DEPARTMENT, {
      state: {
        departmentId
      }
    })
  }
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IDepartment>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Department Name",
      className: "w-[45%]",
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
      header: "Status",
      className: "w-[40%]",
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
    setDepartmentDetails(initialDepartment);
  }

  // handle show history 
  const handleShowHistory = (branch: IDepartment) => {
    handleHistoryOpenClose();
    setDepartmentDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={departments} />
  <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} shiftDetails={departmentDetails} />
    </>
);
}
