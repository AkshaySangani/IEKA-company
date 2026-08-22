import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IOnboarding } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import {
  HistoryFieldEnum,
} from "../../../../types/common-types";
import PersonInfo from "../../../common/person-info";
import { useNavigate } from "react-router-dom";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";

interface IOnboardingsListProps {
  onboardingsList: IOnboarding[];
}

export default function OnboardingsTable({
  onboardingsList,
}: IOnboardingsListProps) {
  const navigate = useNavigate();

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const handleRedirectEmployeeDetails = (row: IOnboarding) => {
    navigate(`${pathNames.ONBOARDING_DETAILS}/${row?._id}`);
  };
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
        <PersonInfo
          personInfo={{
            profileImage: row.profileImage,
            firstName: row.firstName,
            lastName: row.lastName,
            description: "",
          }}
          onClick={() => handleRedirectEmployeeDetails(row)}
        />
      ),
    },
    {
      header: "Requested Date",
      className: "w-[25%]",
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
  const handleShowHistory = (employee: IOnboarding) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.UserStatus,
      fieldId: employee._id,
      title: `${employee.firstName} ${employee.lastName}`,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={onboardingsList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
