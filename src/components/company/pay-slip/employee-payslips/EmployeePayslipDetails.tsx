import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import { pathNames } from "../../../../constants/constants";
import YearPicker from "../../../common/date-picker/YearPicker";

import EmployeeCard from "./EmployeeCard";
import StatusCards, {
  PayrollCardItem,
} from "../../expense/employee-payroll/StatusCards";
import EmployeePayslipTable from "./EmployeePayslipTable";

import { getEmployeePayslips } from "../../../../apis/pay-slip/employee-payslip.api";
import { IEmployeePayslipResponse } from "../../../../types/employee/employee-payslip.types";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import PageLoader from "../../../common/loader/PageLoader";
import { deductionEnum, RoleEnum } from "../../../../types/common-types";
import { getFloatValue } from "../../../../utils/helper";
import { useAuthStore } from "../../../../store/auth-store";

interface EmployeePayslipDetailsProps {
  id?: string;
}

export const EmployeePayslipDetails = ({ id }: EmployeePayslipDetailsProps) => {
  const { user } = useAuthStore();
  const isOwner = user.role === RoleEnum.OWNER;
  const params = useParams<{ id: string }>();
  const employeeId = params.id ?? id;

  const navigate = useNavigate();

  // --------------------------------------------------
  // States
  // --------------------------------------------------

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [data, setData] = useState<IEmployeePayslipResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // --------------------------------------------------
  // Fetch Payslip
  // --------------------------------------------------

  useEffect(() => {
    if (!employeeId) return;

    fetchEmployeePayslip(employeeId);
  }, [employeeId, year]);

  const fetchEmployeePayslip = async (id: string) => {
    try {
      setLoading(true);

      const response = await getEmployeePayslips(id, year);

      console.log("Employee Payslip Response:", response);

      /*
       * Depending on your API wrapper, response may be:
       *
       * response.data
       *
       * or
       *
       * response.data.data
       *
       * Here we assume API function returns the actual payload.
       */

      setData(response.data as IEmployeePayslipResponse);
    } catch (error) {
      console.error("Failed to fetch employee payslip:", error);

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Year Change
  // --------------------------------------------------

  const handleYearChange = (selectedYear: number) => {
    setYear(Number(selectedYear));
  };

  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  const handleClose = () => {
    navigate(pathNames.ALL_EMPLOYEE_PAY_SLIP);
  };

  // --------------------------------------------------
  // Payrolls
  // --------------------------------------------------

  const payrolls = data?.payrolls ?? [];

  // --------------------------------------------------
  // Calculate Status Cards
  // --------------------------------------------------

  const cards = useMemo<PayrollCardItem[]>(() => {
    let totalAmount = 0;
    let pfAmount = 0;
    let esicAmount = 0;

    payrolls.forEach((payroll) => {
      // Total yearly net salary
      totalAmount += payroll.totals?.netPayAmount ?? 0;

      payroll.salaryBreakdown?.forEach((item) => {
        const itemName = item.name ?? "";

        // PF
        if (itemName === deductionEnum.PROVIDENT_FUND) {
          pfAmount += item.amount ?? 0;
        }

        // ESIC
        if (itemName === deductionEnum.ESIC) {
          esicAmount += item.amount ?? 0;
        }
      });
    });

    return [
      {
        id: "total",
        title: "Total Amount / Year",
        count: getFloatValue(totalAmount),
        bgColor: "bg-pendingLight",
        iconBgColor: "bg-primary",
        icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
      },
      {
        id: "pf",
        title: "Provident Fund (PF)",
        count: getFloatValue(pfAmount),
        bgColor: "bg-dangerLight",
        iconBgColor: "bg-danger",
        icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
      },
      {
        id: "esic",
        title: "ESIC",
        count: getFloatValue(esicAmount),
        bgColor: "bg-successLight",
        iconBgColor: "bg-success",
        icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
      },
    ];
  }, [payrolls]);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <TopBar
        title="Salary Disclaimer"
        actionButtons={
          <div className="flex items-center gap-3">
            <YearPicker
              placeholder="Select Year"
              value={year}
              onChange={handleYearChange}
            />

            {isOwner && (
              <Button
                size="sm"
                variant="danger"
                onClick={handleClose}
                leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger" />}
              />
            )}
          </div>
        }
      />

      <div className="content-area flex flex-col gap-3 relative">
        <PageLoader loading={loading} />
        {data ? (
          <>
            {/* Employee Details */}
            <EmployeeCard
              user={data.user}
              branches={data.branches}
              departments={data.departments}
              currentSalary={data.curruntSalary}
            />

            {/* Yearly Summary */}
            <StatusCards cards={cards} />

            {/* Payslip Table */}
            <EmployeePayslipTable payrolls={data.payrolls} />
          </>
        ) : (
          <EmptyPlaceholder
            title="Employee data not found."
            description="It seems there is not data found for this employee. please check back later."
          />
        )}
      </div>
    </>
  );
};
