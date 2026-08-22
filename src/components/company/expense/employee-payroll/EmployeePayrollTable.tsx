import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  pathNames,
  roleNames,
} from "../../../../constants/constants";
import { IEmployeePayroll, IReimbursement } from ".";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import {
  getDaysInMonth,
} from "../../../../utils/date-format";
import { getFloatValue } from "../../../../utils/helper";
import { MonthPickerValue } from "../../../common/date-picker/MonthPicker";
import ReimbursementDetails from "./ReimburseDetails";
import InfoIcon from "../../../../assets/icons/Info";
import { useNavigate } from "react-router-dom";

interface IEmployeePayrollListProps {
  employeePayrolls: IEmployeePayroll[];
  month: MonthPickerValue;
}

export default function EmployeePayrollTable({
  employeePayrolls,
  month,
}: IEmployeePayrollListProps) {
  const navigate = useNavigate();
  const monthDays = getDaysInMonth(month);

  // reimbursements
  const [reimbursements, setReimbursements] = useState<IReimbursement[]>([]);

  const handleShowReimbursement = (reimbursement: IReimbursement[] = []) => {
    setReimbursements(reimbursement);
  };
  // Define configuration structures with isolated column custom components
  const columns: ColumnDef<IEmployeePayroll>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[20%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row.userId.profileImage,
            firstName: row.userId.firstName,
            lastName: row.userId.lastName,
            description: roleNames[row.userId.role],
          }}
          onClick={() => navigate(`${pathNames.EMPLOYEE_PAYROLL_PERFORMANCE}/${row.userId._id}`)}
        />
      ),
    },
    {
      header: "Performance",
      className: "w-[15%]",
      render: (row) => `${row.attendance.presentDays}/${monthDays}`,
    },
    {
      header: "Salary",
      className: "w-[15%]",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {currency.INR} {getFloatValue(row.totals.salaryAmount)}
          </div>
        </div>
      ),
    },
    {
      header: "Reimbursement",
      className: "w-[15%]",
      render: (row) =>
        row.totals.reimbursementsAmount ? (
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary">
              {currency.INR} {getFloatValue(row.totals.reimbursementsAmount)}
            </span>
            <InfoIcon onClick={() => handleShowReimbursement(row.reimbursements)} />
          </div>
        ) : (
          "-"
        ),
    },
    {
      header: "Total Payable",
      className: "w-[10%]",
      render: (row) => {
        return (
          <div>
            <div className="font-bold text-success text-sm">
              {currency.INR} {getFloatValue(row.totals.netPayAmount)}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CustomTable columns={columns} data={employeePayrolls} />
      <ReimbursementDetails reimbursements={reimbursements} onClose={handleShowReimbursement}/>
    </>
  );
}
