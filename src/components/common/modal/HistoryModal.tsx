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
  isMailHistory?: boolean;
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
  fieldValue: string | number;
  fieldId: string;
  remarks: string;
  assignedBy: AssignedBy;
  createdAt: string;
  updatedAt: string;
}

const firstColumnNames: {[key in HistoryFieldEnum]: string} = {
  [HistoryFieldEnum.BranchStatus]: "Status",
  [HistoryFieldEnum.ShiftStatus]: "Status",
  [HistoryFieldEnum.DepartmentStatus]: "Status",
  [HistoryFieldEnum.DesignationStatus]: "Status",
  [HistoryFieldEnum.HolidayStatus]: "Status",
  [HistoryFieldEnum.LeaveStatus]: "Status",
  [HistoryFieldEnum.PolicyStatus]: "Status",
  [HistoryFieldEnum.LeaveApplicationStatus]: "Status",
  [HistoryFieldEnum.PayslipStatus]: "Status",
  [HistoryFieldEnum.UserStatus]: "Status",
  [HistoryFieldEnum.EmploymentType]: "Employment Type",
  [HistoryFieldEnum.ProbationPeriod]: "Probation Period",
  [HistoryFieldEnum.Role]: "Role",
  [HistoryFieldEnum.PromotionMail]: "Mail Sended",
  [HistoryFieldEnum.PromotionStatus]: "Status",
  [HistoryFieldEnum.ResignationStatus]: "Status",
  [HistoryFieldEnum.ResignationMail]: "Mail Sended",
  [HistoryFieldEnum.TerminationMail]: "Mail Sended",
  [HistoryFieldEnum.TerminationStatus]: "Status",
  [HistoryFieldEnum.OfficeExpenseStatus]: "Status",
  [HistoryFieldEnum.ReimbursementStatus]: "Status",
  [HistoryFieldEnum.Designation]: "Designation",
  [HistoryFieldEnum.Assignment]: "Assignment",
}

const historyFieldValues: {[key: string | number]: string} = {
  PERMANENT: "Permanent",
  CONTRACT: "Contract",
  INTERN: "Intern",
  CONSULTANT: "Consultant",
  0: "0 Month",
  1: "1 Month",
  2: "2 Months",
  3: "3 Months",
  4: "4 Months",
  5: "5 Months",
  6: "6 Months"
}

const HistoryModal: React.FC<IStatusHistoryProps> = ({
  isOpen,
  handleOpenClose,
  history,
  isMailHistory = false,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<IHistory[]>([]);

  useEffect(() => {
    if (history.fieldId) {
      fetchHistory();
    }
    // eslint-disable-next-line
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

  const columns: ColumnDef<IHistory>[] = isMailHistory
    ? [
        {
          header: firstColumnNames[history.field],
          className: "w-[20%]",
          render: (row) => row.fieldValue,
        },
        {
          header: "Action Date",
          className: "w-[40%]",
          render: (row) => formatDate(row.createdAt, DateFormat.DATE_TIME_24),
        },
        {
          header: "Action By",
          className: "w-[40%]",
          render: (row) =>
            `${row.assignedBy.firstName} ${row.assignedBy.lastName}`,
        },
      ]
    : [
        {
          header: firstColumnNames[history.field],
          className: "w-[20%]",
          render: (row) => (
            <span
              className={`font-medium text-sm ${statusColor[row.fieldValue] ?? "text-secondary"}`}
            >
              {statusMessage[row.fieldValue] ?? historyFieldValues[row.fieldValue] ?? row.fieldValue}
            </span>
          ),
        },
        {
          header: "Action Date",
          className: "w-[15%]",
          render: (row) => formatDate(row.createdAt, DateFormat.DATE_TIME_24),
        },
        {
          header: "Action By",
          className: "w-[15%]",
          render: (row) =>
            `${row.assignedBy.firstName} ${row.assignedBy.lastName}`,
        },
        {
          header: "Remarks",
          className: "w-[30%]",
          render: (row) => (
            <div className="line-clamp-2 max-w-full overflow-hidden">
              {row.remarks || "-"}
            </div>
          ),
        },
      ];

  return (
    <Modal
      isOpen={isOpen}
      title={history.title}
      width={"max-w-4xl"}
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
