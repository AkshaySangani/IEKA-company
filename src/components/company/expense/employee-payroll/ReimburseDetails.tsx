import { ColumnDef, CustomTable } from "../../../common/table";
import {
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { IReimbursement } from ".";
import {
  formatDate,
} from "../../../../utils/date-format";
import { statusEnum } from "../../../../types/common-types";
import Modal from "../../../common/modal/Modal";
import { getFloatValue } from "../../../../utils/helper";

interface IReimbursementListProps {
  reimbursements: IReimbursement[];
  onClose: () => void;
}

export default function ReimbursementDetails({
  reimbursements,
  onClose
}: IReimbursementListProps) {
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IReimbursement>[] = [
    {
      header: "#",
      className: "",
      render: (_, index) => index + 1,
    },
    {
      header: "Expense Name",
      className: "",
      render: (row) => row.name,
    },
    {
      header: "Amount",
      className: "",
      render: (row) => getFloatValue(row.amount),
    },
    {
      header: "Expense Date",
      className: "",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Status",
      className: "",
      render: () => (
        <span className={`font-medium text-sm ${statusColor[statusEnum.ACTIVE]}`}>
              {statusMessage[statusEnum.ACTIVE]}
            </span>
      ),
    },
  ];

  return (
    <Modal isOpen={reimbursements?.length > 0} showFooter={false} title={"Reimbursements"} onClose={onClose}>
      <CustomTable columns={columns} data={reimbursements} />
    </Modal>
  );
}
