import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { ResignationRequest } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { statusEnum } from "../../../../types/common-types";
import BranchDepartmentInfo from "../../../common/branch-department";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";

interface ResignationRequestListProps {
  resignedEmployees: ResignationRequest[];
  handleEditResignedEmployeeDetails: (value: ResignationRequest) => void;
  handleUpdateStatus: (value: ResignationRequest) => void;
}

export default function ResignedEmployeeTable({
  resignedEmployees,
  handleEditResignedEmployeeDetails,
  handleUpdateStatus,
}: ResignationRequestListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  // const initialLeave: ResignationRequest = {
  //   _id: "",
  //   companyId: "",
  //   name: "",
  //   description: "",
  //   isPaid: false,
  //   status: statusEnum.ACTIVE,
  //   createdAt: "",
  //   updatedAt: "",
  // };
  // const [leaveDetails, setLeaveDetails] = useState<ResignationRequest>(initialLeave)
  // Define configuration structures with isolated column custom components
  const handleOnClick = (row: ResignationRequest) => {
    navigate(pathNames.EMPLOYEE_DETAILS, {
      state: {
        employeeId: row?.userId?._id,
      },
    });
  };
  const columns: ColumnDef<ResignationRequest>[] = [
    {
      header: "#",
      className: "w-[3%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[20%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row?.userId?.profileImage,
            firstName: row?.userId?.firstName,
            lastName: row?.userId?.lastName,
            description: roleNames[row?.userId?.role],
          }}
          onClick={() => handleOnClick(row)}
        />
      ),
    },
    {
      header: "Resign Date",
      className: "w-[15%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.createdAt)}
          <span className="text-grayText text-xs">
            {formatDate(row.createdAt, DateFormat.TIME_24)}
          </span>
        </div>
      ),
    },
    {
      header: "Reason",
      className: "w-[15%]",
      render: (row) => (row.reason ? row.reason : "-"),
    },
    {
      header: "Last Working Day",
      className: "w-[15%]",
      render: (row) => formatDate(row.lastWorkingDate),
    },
    {
      header: "Certificate",
      className: "w-[20%]",
      render: (row) => <>Certificates</>,
    },
    {
      header: "Status",
      className: "w-[12%]",
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
  const handleShowHistory = (branch: ResignationRequest) => {
    handleHistoryOpenClose();
    // setLeaveDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={resignedEmployees} />
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
