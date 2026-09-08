import { ColumnDef, CustomTable } from "../../../common/table";
import { IPolicy } from ".";
import { useState } from "react";
import { HistoryFieldEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";

interface IPolicyListProps {
  policyList: IPolicy[];
  handleEditPolicyDetails: (value: IPolicy) => void;
  handleUpdateStatus: (value: IPolicy) => void;
}

export default function PolicyTable({
  policyList,
  handleEditPolicyDetails,
  handleUpdateStatus,
}: IPolicyListProps) {
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IPolicy>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Policy Name",
      className: "",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
            onClick={() => handleEditPolicyDetails(row)}
          >
            {row.name}
          </div>
          <div className="text-grayText text-xs">{""}</div>
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
  const handleShowHistory = (policy: IPolicy) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.PolicyStatus,
      fieldId: policy._id,
      title: policy.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={policyList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
