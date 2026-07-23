import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IPromotion } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { statusEnum } from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";

interface IPromotionListProps {
  promotions: IPromotion[];
  handleEditPromotionDetails: (value: IPromotion) => void;
  handleUpdateStatus: (value: IPromotion) => void;
}

export default function PromotionTable({
  promotions,
  handleEditPromotionDetails,
  handleUpdateStatus,
}: IPromotionListProps) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  // const initialLeave: IPromotion = {
  //   _id: "",
  //   companyId: "",
  //   name: "",
  //   description: "",
  //   isPaid: false,
  //   status: statusEnum.ACTIVE,
  //   createdAt: "",
  //   updatedAt: "",
  // };
  // const [leaveDetails, setLeaveDetails] = useState<IPromotion>(initialLeave)
  // Define configuration structures with isolated column custom components
  const handleOnClick = (row: IPromotion) => {
    handleEditPromotionDetails(row);
  };
  const columns: ColumnDef<IPromotion>[] = [
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
      header: "Designation",
      className: "w-[15%]",
      render: (row) => row.designationId.name,
    },
    {
      header: "Effective From Month",
      className: "w-[15%]",
      render: (row) => formatDate(row.effectiveDate, DateFormat.MONTH_YEAR),
    },
    {
      header: "Letter",
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
            {row.status !== statusEnum.CANCEL && (
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
  const handleShowHistory = (branch: IPromotion) => {
    handleHistoryOpenClose();
    // setLeaveDetails(branch);
  };

  return (
    <>
      <CustomTable columns={columns} data={promotions} />
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
