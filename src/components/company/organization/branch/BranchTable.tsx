import { ColumnDef, CustomTable } from "../../../common/table";
import {
  branchEnum
} from "../../../../constants/constants";
import { IBranch } from ".";
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
import StatusCell from "../../../common/status-cell";

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
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Branch Name",
      className: "",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium line-clamp-1 truncate text-wrap max-w-[150px]"
            onClick={() => handleEditBranchDetails(row._id)}
          >
            {row.name} {row.branchType === branchEnum.HEAD_OFFICE ? "(HO)" : ""}
          </div>
          <div className="text-grayText text-xs line-clamp-2 truncate text-wrap max-w-[200px]">
            {row.address}
          </div>
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
