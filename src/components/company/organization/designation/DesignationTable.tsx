import { ColumnDef, CustomTable } from "../../../common/table";
import { IDesignation } from ".";
import { useState } from "react";
import { HistoryFieldEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import StatusCell from "../../../common/status-cell";
import Description from "../../../common/description";

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
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IDesignation>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Designation Name",
      className: "",
      render: (row) => (
        <div
          className="text-primary cursor-pointer text-sm font-medium line-clamp-1 truncate text-wrap max-w-[150px]"
          onClick={() => handleEditDesignationDetails(row)}
        >
          {row.name}
        </div>
      ),
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
  const handleShowHistory = (designation: IDesignation) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.DesignationStatus,
      fieldId: designation._id,
      title: designation.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={designationList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
