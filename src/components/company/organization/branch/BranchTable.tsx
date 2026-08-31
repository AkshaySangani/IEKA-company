import { ColumnDef, CustomTable } from "../../../common/table";
import {
  branchEnum,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IBranch } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import {
  BranchTypeEnum,
  HistoryFieldEnum,
} from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";

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
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IBranch>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Branch Name",
      className: "w-[45%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
            onClick={() => handleEditBranchDetails(row._id)}
          >
            {row.name} {row.branchType === branchEnum.HEAD_OFFICE ? "(HO)" : ""}
          </div>
          <div className="text-grayText text-xs line-clamp-2 truncate text-wrap">{row.address}</div>
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
            <InfoIcon onClick={() => handleShowHistory(row)} />
            <i
              onClick={() => handleUpdateStatus(row)}
              className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
            ></i>
            <span className={`font-medium text-sm ${statusColor[row.status]}`}>
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
    setHistory(initialHistory);
  };

  // handle show history
  const handleShowHistory = (branch: IBranch) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.BranchStatus,
      fieldId: branch._id,
      title: `${branch.name} ${branch.branchType === BranchTypeEnum.HEAD_OFFICE ? "(HO)" : ""}`,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={branches} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
