import { ColumnDef, CustomTable } from "../../../common/table";
import {
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { ILeave } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { statusEnum } from "../../../../types/common-types";

interface ILeaveListProps {
  leaveList: ILeave[];
  handleEditLeaveDetails: (value: ILeave) => void;
  handleUpdateStatus: (value: ILeave) => void;
}

export default function LeaveTable({
  leaveList,
  handleEditLeaveDetails,
  handleUpdateStatus,
}: ILeaveListProps) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialLeave: ILeave = {
    _id: "",
    companyId: "",
    name: "",
    description: "",
    isPaid: false,
    status: statusEnum.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };
  const [leaveDetails, setLeaveDetails] = useState<ILeave>(initialLeave)
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<ILeave>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Leave Name",
      className: "w-[25%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditLeaveDetails(row)}
          >
            {row.name} 
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Leave Type",
      className: "w-[20%]",
      render: (row) => row.isPaid ? "Paid" : "Unpaid",
    },
    {
      header: "Description",
      className: "w-[30%]",
      render: (row) => row.description ? row.description : "-",
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
    setLeaveDetails(initialLeave);
  }

  // handle show history 
  const handleShowHistory = (branch: ILeave) => {
    handleHistoryOpenClose();
    setLeaveDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={leaveList} />
  {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
);
}
