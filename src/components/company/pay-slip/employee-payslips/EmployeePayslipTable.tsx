import { ColumnDef, CustomTable } from "../../../common/table";
import { currency, pathNames } from "../../../../constants/constants";
import { IEmployee } from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { IEmployeePayroll } from "../../../../types/employee/employee-payslip.types";
import { getFloatValue } from "../../../../utils/helper";
import { deductionEnum } from "../../../../types/common-types";
import { formatMonthYear } from "../../../../utils/date-format";

interface IEmployeeListProps {
  payrolls: IEmployeePayroll[];
}

export default function EmployeePayslipTable({ payrolls }: IEmployeeListProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnClick = (row: IEmployee) => {
    if (location.pathname === pathNames.ALL_EMPLOYEE_PAY_SLIP) {
      navigate(`${pathNames.EMPLOYEE_PAY_SLIP_DETAILS}/${row?._id}`);
    } else {
      navigate(pathNames.EMPLOYEE_DETAILS, {
        state: {
          employeeId: row?._id,
        },
      });
    }
  };

  // Define configuration structures with isolated column custom components

  const columns: ColumnDef<IEmployeePayroll>[] = [
    {
      header: "#",
      className: "w-[5%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Month",
      className: "w-[15%]",
      render: (row) => formatMonthYear(row.payrollMonth, row.payrollYear),
    },
    {
      header: "Amount",
      className: "w-[15%]",
      render: (row) =>
        `${currency.INR}${getFloatValue(row.totals.netPayAmount)}`,
    },
    {
      header: "Provident Fund (PF)",
      className: "w-[15%]",
      render: (row) => {
        const PF = row.salaryBreakdown.find(
          (ele) => ele.name === deductionEnum.PROFESSIONAL_TAX,
        );
        return PF ? `${currency.INR}${getFloatValue(PF.amount)}` : "-";
      },
    },
    {
      header: "ESIC",
      className: "w-[15%]",
      render: (row) => {
        const ESIC = row.salaryBreakdown.find(
          (ele) => ele.name === deductionEnum.ESIC,
        );
        return ESIC ? `${currency.INR}${getFloatValue(ESIC.amount)}` : "-";
      },
    },
    {
      header: "Salary slip",
      className: "w-[15%]",
      render: (row) => <i className="fa-solid fa-eye cursor-pointer"></i>,
    },
  ];

  return (
    <>
      <CustomTable columns={columns} data={payrolls} />
    </>
  );
}
