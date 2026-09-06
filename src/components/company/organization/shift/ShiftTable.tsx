import { ColumnDef, CustomTable } from "../../../common/table";
import { pathNames } from "../../../../constants/constants";
import { IShift } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HistoryFieldEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";

interface IShiftListProps {
  shiftList: IShift[];
  handleUpdateStatus: (value: IShift) => void;
}

export default function ShiftTable({
  shiftList,
  handleUpdateStatus,
}: IShiftListProps) {
  const navigate = useNavigate();
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleEditShiftDetails = (shiftId: string) => {
    navigate(pathNames.ADD_SHIFT, {
      state: {
        shiftId,
      },
    });
  };
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IShift>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Shift Name",
      className: "",
      render: (row) => (
        <div
          className="text-primary cursor-pointer text-sm font-medium line-clamp-1 truncate text-wrap max-w-[150px]"
          onClick={() => handleEditShiftDetails(row._id)}
        >
          {row.name}
        </div>
      ),
    },
    {
      header: "Shift Time",
      className: "",
      render: (row) => (
        <div className="flex flex-col">
          <div className="text-grayText text-xs">{`Time : (${row.startTime} to ${row.endTime})`}</div>
          <div className="text-grayText text-xs">{`Launch : (${row.breakStartTime} to ${row.breakEndTime})`}</div>
        </div>
      ),
    },
    {
      header: "Status",
      className: "",
      render: (row) => {
        return (
          <StatusCell
            status={row.status}
            onEdit={() => handleUpdateStatus(row)}
            onHistory={() => handleShowHistory(row)}
          />
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
  const handleShowHistory = (shift: IShift) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.ShiftStatus,
      fieldId: shift._id,
      title: shift.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={shiftList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
