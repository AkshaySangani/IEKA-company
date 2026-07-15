import { ColumnDef, CustomTable } from "../../../common/table";
import {
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IEarning, initialEarning } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { statusEnum } from "../../../../types/common-types";

interface IEarningListProps {
  earnings: IEarning[];
  handleEditEarningDetails: (value: IEarning) => void;
  handleUpdateStatus: (value: IEarning) => void;
}

export default function EarningTable({
  earnings,
  handleEditEarningDetails,
  handleUpdateStatus,
}: IEarningListProps) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [leaveDetails, setEarningDetails] = useState<IEarning>(initialEarning)
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IEarning>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Payslip Name",
      className: "w-[40%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditEarningDetails(row)}
          >
            {row.name} 
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Applicable Peoples",
      className: "w-[35%]",
      render: (row) => (
        <>View</>
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
    setEarningDetails(initialEarning);
  }

  // handle show history 
  const handleShowHistory = (branch: IEarning) => {
    handleHistoryOpenClose();
    setEarningDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={earnings} />
  {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
);
}
