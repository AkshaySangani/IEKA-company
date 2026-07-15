import { ColumnDef, CustomTable } from "../../../common/table";
import {
  branchEnum,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IBranch } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { statusEnum } from "../../../../types/common-types";

interface IBranchListProps {
  branches: IBranch[];
  handleEditBranchDetails: (value: string) => void;
  handleUpdateStatus: (value: IBranch) => void;
}

export default function BranchTable({
  branches,
  handleEditBranchDetails,
  handleUpdateStatus,
}: IBranchListProps) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialBranch: IBranch = {
      _id: "",
      companyId: "",
      name: "",
      address: "",
      shiftApplicable: false,
      branchType: branchEnum.HEAD_OFFICE,
      status: statusEnum.ACTIVE,
      createdAt: "",
      updatedAt: ""
  };
  const [branchDetail, setBranchDetails] = useState<IBranch>(initialBranch)
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IBranch>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Branch Name",
      className: "w-[65%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditBranchDetails(row._id)}
          >
            {row.name} {row.branchType === branchEnum.HEAD_OFFICE ? "(HO)" : ""}
          </div>
          <div className="text-grayText text-xs">{row.address}</div>
        </div>
      ),
    },
    {
      header: "Status",
      className: "w-[20%]",
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
    setBranchDetails(initialBranch);
  }

  // handle show history 
  const handleShowHistory = (branch: IBranch) => {
    handleHistoryOpenClose();
    setBranchDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={branches} />
  <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} branchDetails={branchDetail} />
    </>
);
}
