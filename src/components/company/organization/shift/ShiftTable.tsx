import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IShift } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import StatusHistory from "./StatusHistory";
import { useNavigate } from "react-router-dom";
import { statusEnum } from "../../../../types/common-types";

interface IShiftListProps {
  shiftList: IShift[];
  handleUpdateStatus: (value: IShift) => void;
}

export default function ShiftTable({
  shiftList,
  handleUpdateStatus,
}: IShiftListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialShift: IShift = {
  _id: "",
  companyId: "",
  name: "",
  startTime: "",
  endTime: "",
  breakStartTime: "",
  breakEndTime: "",
  branchIds: [],
  status: statusEnum.INACTIVE,
  createdAt: "",
  updatedAt: ""
};
  const [shiftDetails, setShiftDetails] = useState<IShift>(initialShift);

  const handleEditShiftDetails = (shiftId: string) => {
    navigate(pathNames.ADD_SHIFT, {
      state: {
        shiftId
      }
    })
  }
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IShift>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Shift Name",
      className: "w-[30%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditShiftDetails(row._id)}
          >
            {row.name} 
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Shift Time",
      className: "w-[30%]",
      render: (row) => (
        <div className="flex flex-col">
          <div className="text-grayText text-xs">{`Time : (${row.startTime} to ${row.endTime})`}</div>
          <div className="text-grayText text-xs">{`Launch : (${row.breakStartTime} to ${row.breakEndTime})`}</div>
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
    setShiftDetails(initialShift);
  }

  // handle show history 
  const handleShowHistory = (branch: IShift) => {
    handleHistoryOpenClose();
    setShiftDetails(branch);
  }

  return (
  <><CustomTable columns={columns} data={shiftList} />
  <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} shiftDetails={shiftDetails} />
    </>
);
}
