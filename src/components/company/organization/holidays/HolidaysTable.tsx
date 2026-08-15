import { ColumnDef, CustomTable } from "../../../common/table";
import { statusColor, statusMessage } from "../../../../constants/constants";
import { IHoliday } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import {
  formatDate,
  getDateDifferenceInDays,
} from "../../../../utils/date-format";
import { HistoryFieldEnum, statusEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";

interface IHolidaysListProps {
  holidaysList: IHoliday[];
  handleEditHolidayDetails: (value: IHoliday) => void;
  handleUpdateStatus: (value: IHoliday) => void;
}

export default function HolidaysTable({
  holidaysList,
  handleEditHolidayDetails,
  handleUpdateStatus,
}: IHolidaysListProps) {
  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IHoliday>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Holiday Name",
      className: "w-[25%]",
      render: (row) => (
        <div className="flex flex-col">
          <div
            className="text-primary cursor-pointer text-sm font-medium"
            onClick={() => handleEditHolidayDetails(row)}
          >
            {row.name}
          </div>
          <div className="text-grayText text-xs">{""}</div>
        </div>
      ),
    },
    {
      header: "Date & Days",
      className: "w-[20%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.startDate === row.endDate
            ? formatDate(row.startDate)
            : `${formatDate(row.startDate)} to ${formatDate(row.endDate)}`}
          <span className="text-grayText text-xs">
            {"Days: "}
            {getDateDifferenceInDays(row.startDate, row.endDate)}
          </span>
        </div>
      ),
    },
    {
      header: "Description",
      className: "w-[30%]",
      render: (row) => (row.description ? row.description : "-"),
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
  const handleShowHistory = (holiday: IHoliday) => {
    handleHistoryOpenClose();
    setHistory({
      field: HistoryFieldEnum.HolidayStatus,
      fieldId: holiday._id,
      title: holiday.name,
    });
  };

  return (
    <>
      <CustomTable columns={columns} data={holidaysList} />
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
      />
    </>
  );
}
