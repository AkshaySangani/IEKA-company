import { ColumnDef, CustomTable } from "../../../common/table";
import { ILeave } from ".";
import { useState } from "react";
import { HistoryFieldEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";
import Description from "../../../common/description";

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
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<ILeave>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Leave Name",
      className: "",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
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
      className: "",
      render: (row) => (row.isPaid ? "Paid" : "Unpaid"),
    },
    {
      header: "Description",
      className: "",
      render: (row) => <Description value={row.description} className="!max-w-150px"/>,
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
  const handleShowHistory = (leave: ILeave) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.LeaveStatus,
      fieldId: leave._id,
      title: leave.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={leaveList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
