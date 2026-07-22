import { ColumnDef, CustomTable } from "../../../common/table";
import { pathNames, statusColor, statusMessage } from "../../../../constants/constants";
import { IEmployee } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { statusEnum } from "../../../../types/common-types";
import BranchDepartmentInfo from "../../../common/branch-department";
import { useNavigate } from "react-router-dom";

interface IEmployeeListProps {
  allEmployees: IEmployee[];
  handleEditAllEmployeeDetails: (value: IEmployee) => void;
  handleUpdateStatus: (value: IEmployee) => void;
}

export default function AllEmployeeTable({
  allEmployees,
  handleEditAllEmployeeDetails,
  handleUpdateStatus,
}: IEmployeeListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  // const initialLeave: IEmployee = {
  //   _id: "",
  //   companyId: "",
  //   name: "",
  //   description: "",
  //   isPaid: false,
  //   status: statusEnum.ACTIVE,
  //   createdAt: "",
  //   updatedAt: "",
  // };
  // const [leaveDetails, setLeaveDetails] = useState<IEmployee>(initialLeave)
  // Define configuration structures with isolated column custom components
  const handleOnClick = (row: IEmployee) => {
    navigate(pathNames.EMPLOYEE_DETAILS, {
      state: {
        employeeId: row?._id
      }
    })
  }
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
            description: row?.role,
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
            {row.status !== statusEnum.DELETED && (
              <i
                onClick={() => handleUpdateStatus(row)}
                className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
              ></i>
            )}
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
    setHistoryOpen((prev) => !prev);
    // setLeaveDetails(initialLeave);
  };

  // handle show history
  const handleShowHistory = (branch: IEmployee) => {
    handleHistoryOpenClose();
    // setLeaveDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={allEmployees} />
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
