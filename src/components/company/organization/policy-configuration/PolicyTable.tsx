import { ColumnDef, CustomTable } from "../../../common/table";
import {
  statusColor,
  statusEnum,
  statusMessage,
} from "../../../../constants/constants";
import { initialPolicy, IPolicy } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import { formatDate, getDateDifferenceInDays } from "../../../../utils/date-format";

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
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [policyDetails, setPolicyDetails] = useState<IPolicy>(initialPolicy);
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IPolicy>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Policy Name",
      className: "w-[25%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-semibold"
            onClick={() => handleEditPolicyDetails(row)}
          >
            {row.name}
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Policy Type",
      className: "w-[20%]",
      render: (row) => "-",
    },
    {
      header: "Description",
      className: "w-[30%]",
      render: (row) => ("-"),
    },
    {
      header: "Status",
      className: "w-[20%]",
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
    setPolicyDetails(initialPolicy);
  };

  // handle show history
  const handleShowHistory = (branch: IPolicy) => {
    handleHistoryOpenClose();
    setPolicyDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={policyList} />
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
