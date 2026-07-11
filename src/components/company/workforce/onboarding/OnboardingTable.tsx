import { ColumnDef, CustomTable } from "../../../common/table";
import {
  roleNames,
  statusColor,
  statusEnum,
  statusMessage,
} from "../../../../constants/constants";
import { IOnboarding } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import { RoleEnum } from "../../../../types/common-types";
import PersonInfo from "../../../common/person-info";

interface IOnboardingsListProps {
  onboardingsList: IOnboarding[];
  handleEditOnboardingDetails: (value: IOnboarding) => void;
  handleUpdateStatus: (value: IOnboarding) => void;
}

export default function OnboardingsTable({
  onboardingsList,
  handleEditOnboardingDetails,
  handleUpdateStatus,
}: IOnboardingsListProps) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const initialOnboarding: IOnboarding = {
    _id: "",
    profileImage : "",
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    status: statusEnum.PENDING,
    role: RoleEnum.EMPLOYEE,
    createdAt: ""
  };
  const [onboardingDetails, setOnboardingDetails] = useState<IOnboarding>(initialOnboarding);
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IOnboarding>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[30%]",
      render: (row) => (
        <PersonInfo personInfo={{
          profileImage: row.profileImage,
          firstName: row.firstName,
          lastName: row.lastName,
          description: roleNames[row.role]
        }} onClick={() => handleEditOnboardingDetails(row)}/>
      ),
    },
    {
      header: "Requested Date",
      className: "w-[25%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.createdAt)}
          <span className="text-grayText text-xs">{formatDate(row.createdAt, DateFormat.TIME_24)}</span>
        </div>
      ),
    },
    {
      header: "Info Mail",
      className: "w-[20%]",
      render: (row) => (row.email ? row.email : "-"),
    },
    {
      header: "Status",
      className: "w-[20%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)} />
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
    setOnboardingDetails(initialOnboarding);
  };

  // handle show history
  const handleShowHistory = (branch: IOnboarding) => {
    handleHistoryOpenClose();
    setOnboardingDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={onboardingsList} />
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
