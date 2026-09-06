import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
} from "../../../../constants/constants";
import { IDepartment } from ".";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HistoryFieldEnum } from "../../../../types/common-types";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import StatusCell from "../../../common/status-cell";

interface IDepartmentListProps {
  departments: IDepartment[];
  handleUpdateStatus: (value: IDepartment) => void;
}

export default function DepartmentTable({
  departments,
  handleUpdateStatus,
}: IDepartmentListProps) {
  const navigate = useNavigate();
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleEditDepartmentDetails = (departmentId: string) => {
    navigate(pathNames.ADD_DEPARTMENT, {
      state: {
        departmentId,
      },
    });
  };
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IDepartment>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Department Name",
      className: "",
      render: (row) => (
        <div
          className="text-primary cursor-pointer text-sm font-medium line-clamp-1 truncate text-wrap max-w-[150px]"
          onClick={() => handleEditDepartmentDetails(row._id)}
        >
          {row.name}
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
  const handleShowHistory = (department: IDepartment) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.DepartmentStatus,
      fieldId: department._id,
      title: department.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={departments} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
