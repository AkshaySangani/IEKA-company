import { ColumnDef, CustomTable } from "../../../common/table";
import {
  currency,
  employeePathNames,
  pathNames,
} from "../../../../constants/constants";
import { useNavigate } from "react-router-dom";
import {
  IEmployeePayroll,
  IPayslipUser,
  IUserDetails,
} from "../../../../types/employee/employee-payslip.types";
import { getFloatValue } from "../../../../utils/helper";
import { deductionEnum, RoleEnum } from "../../../../types/common-types";
import { formatMonthYear } from "../../../../utils/date-format";
import { useAuthStore } from "../../../../store/auth-store";

interface IEmployeeListProps {
  payrolls: IEmployeePayroll[];
  employee: IPayslipUser;
  userDetails: IUserDetails;
}

export default function EmployeePayslipTable({
  payrolls,
  employee,
  userDetails,
}: IEmployeeListProps) {
  const { user } = useAuthStore();
  const isOwner = user.role === RoleEnum.OWNER;
  const navigate = useNavigate();

  const handleOnClick = (row: IEmployeePayroll) => {
    navigate(
      isOwner
        ? pathNames.EMPLOYEE_PAY_SLIP_DOWNLOAD
        : employeePathNames.PAY_SLIP_DOWNLOAD,
      {
        state: {
          employeePayroll: row,
          employee,
          userDetails,
        },
      },
    );
  };

  // Define configuration structures with isolated column custom components

  const columns: ColumnDef<IEmployeePayroll>[] = [
    {
      header: "#",
      className: "",
      render: (_, index) => index + 1,
    },
    {
      header: "Month",
      className: "",
      render: (row) => formatMonthYear(row.payrollMonth, row.payrollYear),
    },
    {
      header: "Amount",
      className: "",
      render: (row) =>
        `${currency.INR}${getFloatValue(row.totals.netPayAmount)}`,
    },
    {
      header: "Provident Fund (PF)",
      className: "",
      render: (row) => {
        const PF = row.salaryBreakdown.find(
          (ele) => ele.name === deductionEnum.PROFESSIONAL_TAX,
        );
        return PF ? `${currency.INR}${getFloatValue(PF.amount)}` : "-";
      },
    },
    {
      header: "ESIC",
      className: "",
      render: (row) => {
        const ESIC = row.salaryBreakdown.find(
          (ele) => ele.name === deductionEnum.ESIC,
        );
        return ESIC ? `${currency.INR}${getFloatValue(ESIC.amount)}` : "-";
      },
    },
    {
      header: "Salary slip",
      className: "",
      render: (row) => (
        <i
          className="fa-solid fa-eye cursor-pointer"
          onClick={() => handleOnClick(row)}
        ></i>
      ),
    },
  ];

  return (
    <>
      <CustomTable columns={columns} data={payrolls} />
    </>
  );
}
