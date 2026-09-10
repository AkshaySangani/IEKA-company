import { ColumnDef, CustomTable } from "../../../common/table";
import { IHoliday } from ".";
import { useState } from "react";
import {
  formatDate,
  getDateDifferenceInDays,
} from "../../../../utils/date-format";
import { HistoryFieldEnum } from "../../../../types/common-types";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import Description from "../../../common/description";
import StatusCell from "../../../common/status-cell";

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
      className: "",
      render: (_, index) => index + 1,
    },
    {
      header: "Holiday Name",
      className: "",
      render: (row) => (
        <div
          className="text-primary cursor-pointer text-sm font-medium line-clamp-1 truncate text-wrap max-w-[150px]"
          onClick={() => handleEditHolidayDetails(row)}
        >
          {row.name}
        </div>
      ),
    },
    {
      header: "Date & Days",
      className: "",
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
      className: "",
      render: (row) => (
        <Description value={row.description} className="!max-w-150px" />
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
