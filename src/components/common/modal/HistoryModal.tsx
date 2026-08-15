import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getHistory, HistoryPayload } from "../../../apis/history/history.api";
import PageLoader from "../loader/PageLoader";
import { HistoryFieldEnum } from "../../../types/common-types";
import { ColumnDef, CustomTable } from "../table";
import { statusColor, statusMessage } from "../../../constants/constants";
import { DateFormat, formatDate } from "../../../utils/date-format";

interface IStatusHistoryProps {
  title?: string;
  isOpen: boolean;
  handleOpenClose: () => void;
  history: HistoryPayload;
}

export interface AssignedBy {
    firstName: string;
    lastName: string;
    profileImage: string;
    _id: string;
  }

export interface IHistory {
  _id: string;
  userId: string;
  field: HistoryFieldEnum;
  fieldValue: string;
  fieldId: string;
  remarks: string;
  assignedBy: AssignedBy;
  createdAt: string;
  updatedAt: string;
}

const HistoryModal: React.FC<IStatusHistoryProps> = ({
  isOpen,
  handleOpenClose,
  history,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<IHistory[]>([]);

  useEffect(() => {
    if (history.fieldId) {
      fetchHistory();
    }
  }, [history.fieldId]);

  // fetch history
  const fetchHistory = async () => {
    setLoading(true);
    const response = await getHistory(history);
    if (response.success) {
      setHistoryList(response?.data);
    } else {
      setHistoryList([]);
    }
    setLoading(false);
  };

  const handleClose = () => {
    handleOpenClose();
  };

  const columns: ColumnDef<IHistory>[] = [
    {
      header: "Status",
      className: "w-[10%]",
      render: (row) => (
        <span
          className={`font-medium text-sm ${statusColor[row.fieldValue] ?? "text-secondary"}`}
        >
          {statusMessage[row.fieldValue] ?? row.fieldValue}
        </span>
      ),
    },
    {
      header: "Action Date",
      className: "w-[20%]",
      render: (row) => formatDate(row.createdAt, DateFormat.DATE_TIME_24),
    },
    {
      header: "Action By",
      className: "w-[20%]",
      render: (row) => `${row.assignedBy.firstName} ${row.assignedBy.lastName}`,
    },
    {
      header: "Remarks",
      className: "w-[30%]",
      render: (row) => <div className="line-clamp-2 max-w-full overflow-hidden">
      {row.remarks || "-"}
    </div>,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={history.title}
      width="max-w-4xl"
      onClose={handleClose}
      loading={loading}
      showFooter={false}
    >
      <div className="">
        <PageLoader loading={loading} />
        <CustomTable columns={columns} data={historyList} />
      </div>
    </Modal>
  );
};

export default HistoryModal;
