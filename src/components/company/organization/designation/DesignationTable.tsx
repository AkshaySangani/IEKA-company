import { ColumnDef, CustomTable } from "../../../common/table";
import {
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IDesignation } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { statusEnum } from "../../../../types/common-types";

interface IDesignationListProps {
  designationList: IDesignation[];
  handleEditDesignationDetails: (value: IDesignation) => void;
  handleUpdateStatus: (value: IDesignation) => void;
}

export default function DesignationTable({
  designationList,
  handleEditDesignationDetails,
  handleUpdateStatus,
}: IDesignationListProps) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialDesignation: IDesignation = {
    _id: "",
    companyId: "",
    name: "",
    description: "",
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [branchDetail, setBranchDetails] = useState<IDesignation>(initialDesignation)
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IDesignation>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Designation Name",
      className: "w-[35%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditDesignationDetails(row)}
          >
            {row.name} 
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Description",
      className: "w-[30%]",
      render: (row) => row.description,
    },
    {
      header: "Status",
      className: "w-[20%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)}/>
            {row.status !== statusEnum.DELETED && <i
              onClick={() => handleUpdateStatus(row)}
              className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
            ></i>}
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
    setBranchDetails(initialDesignation);
  }

  // handle show history 
  const handleShowHistory = (branch: IDesignation) => {
    handleHistoryOpenClose();
    setBranchDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={designationList} />
  <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} branchDetails={branchDetail} />
    </>
);
}
