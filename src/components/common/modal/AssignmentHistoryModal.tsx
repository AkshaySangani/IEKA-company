import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  getAssignmentHistory,
  HistoryPayload,
} from "../../../apis/history/history.api";
import PageLoader from "../loader/PageLoader";
import { ColumnDef, CustomTable } from "../table";
import { DateFormat, formatDate } from "../../../utils/date-format";
import BranchDepartmentCards from "../../company/workforce/all-employees/employee-details/BranchDepartments";
import { getBranches } from "../../../utils/helper";
import { IUser } from "../../../types/user.types";

interface IStatusHistoryProps {
  title?: string;
  isOpen: boolean;
  handleOpenClose: () => void;
  history: HistoryPayload;
}

export interface IBranch {
  _id: string;
  name: string;
}

export interface IShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
}

export interface IDepartment {
  _id: string;
  name: string;
}

export interface IAssignment {
  branchId: IBranch;
  shiftId: IShift;
  departmentId: IDepartment;
  reportingManagerId: string | null;
  isReporting: boolean;
  joinedAt: string;
  assignedBy: IUser;
  remarks: string;
}

export interface IHistory {
  _id: string;
  assignments: IAssignment[];
  createdAt: string;
}

const AssignmentHistoryModal: React.FC<IStatusHistoryProps> = ({
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
    // eslint-disable-next-line
  }, [history.fieldId]);

  // fetch history
  const fetchHistory = async () => {
    setLoading(true);
    const response = await getAssignmentHistory(history.fieldId);
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
      header: "Branch/Departments",
      className: "",
      render: (row) => {
        const cards = getBranches(row.assignments);
        return (
          <BranchDepartmentCards
            cards={cards}
            className="!items-start"
            departmentClassName="!justify-start"
          />
        );
      },
    },
    {
      header: "Action Date",
      className: "",
      render: (row) => formatDate(row.createdAt, DateFormat.DATE_TIME_24),
    },
    {
      header: "Action By",
      className: "",
      render: (row) => {
        const assignedBy = row.assignments[0]?.assignedBy;
        return `${assignedBy.firstName} ${assignedBy.lastName}`;
      },
    },
    {
      header: "Remarks",
      className: "",
      render: (row) => {
        const remarks = row.assignments[0]?.remarks;
        return (
          <div className="line-clamp-2 max-w-full overflow-hidden">
            {remarks || "-"}
          </div>
        );
      },
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
        <CustomTable
          columns={columns}
          data={historyList}
        />
      </div>
    </Modal>
  );
};

export default AssignmentHistoryModal;
