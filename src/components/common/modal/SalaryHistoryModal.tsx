import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HistoryPayload } from "../../../apis/history/history.api";
import PageLoader from "../loader/PageLoader";
import { ColumnDef, CustomTable } from "../table"
import { DateFormat, formatDate } from "../../../utils/date-format";
import Description from "../description";
import { getEmployeeSalary } from "../../../apis/workforce/all-employee.api";
import { IEmployeeSalary } from "../../company/workforce/all-employees/employee-details/update-modals/SalaryUpdate";

interface IStatusHistoryProps {
  title?: string;
  isOpen: boolean;
  handleOpenClose: () => void;
  history: HistoryPayload;
}

const SalaryHistoryModal: React.FC<IStatusHistoryProps> = ({
  isOpen,
  handleOpenClose,
  history,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<IEmployeeSalary[]>([]);

  useEffect(() => {
    if (history.fieldId) {
      fetchHistory();
    }
    // eslint-disable-next-line
  }, [history.fieldId]);

  // fetch history
  const fetchHistory = async () => {
    setLoading(true);
    const response = await getEmployeeSalary(history.fieldId);
    if (response.success && response?.data?.history?.length > 0) {
      setHistoryList(response?.data?.history);
    } else {
      setHistoryList([]);
    }
    setLoading(false);
  };

  const handleClose = () => {
    handleOpenClose();
  };

  const columns: ColumnDef<IEmployeeSalary>[] = [
    {
      header: "Salary",
      className: "",
      render: (row) => (
        <span className={`font-medium text-sm text-secondary`}>
          {row.salary}
        </span>
      ),
    },
    {
      header: "Action Date",
      className: "",
      render: (row) => formatDate(row.createdAt, DateFormat.DATE_TIME_24),
    },
    {
      header: "Action By",
      className: "",
      render: (row) => `${row.assignedBy.firstName} ${row.assignedBy.lastName}`,
    },
    {
      header: "Remarks",
      className: "",
      render: (row) => <Description value={row.remarks} />,
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
      <>
        <PageLoader loading={loading} />
        <CustomTable columns={columns} data={historyList} />
      </>
    </Modal>
  );
};

export default SalaryHistoryModal;
