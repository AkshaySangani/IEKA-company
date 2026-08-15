import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IEmployee } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { HistoryFieldEnum } from "../../../../types/common-types";
import BranchDepartmentInfo from "../../../common/branch-department";
import { useNavigate } from "react-router-dom";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";

interface IEmployeeListProps {
  allEmployees: IEmployee[];
}

export default function AllEmployeeTable({ allEmployees }: IEmployeeListProps) {
  const navigate = useNavigate();
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleOnClick = (row: IEmployee) => {
    navigate(pathNames.EMPLOYEE_DETAILS, {
      state: {
        employeeId: row?._id,
      },
    });
  };

  // Define configuration structures with isolated column custom components

  const columns: ColumnDef<IEmployee>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[40%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row?.profileImage,
            firstName: row?.firstName,
            lastName: row?.lastName,
            description: roleNames[row?.role],
          }}
          onClick={() => handleOnClick(row)}
        />
      ),
    },
    {
      header: "Branch & Department",
      className: "w-[40%]",
      render: (row) => (
        <BranchDepartmentInfo
          branch={{ name: row.branchId?.name ?? "" }}
          shift={{
            name: row.shiftId?.name ?? "",
            startTime: row.shiftId?.startTime ?? "",
            endTime: row.shiftId?.endTime ?? "",
          }}
          department={{ name: row?.departmentId?.name ?? "" }}
        />
      ),
    },
    {
      header: "Status",
      className: "w-[15%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)} />
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
  const handleShowHistory = (employee: IEmployee) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.UserStatus,
      fieldId: employee._id,
      title: `${employee.firstName} ${employee.lastName}`,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={allEmployees} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
