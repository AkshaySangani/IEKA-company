import React, { useRef } from "react";

import CompanyHeader from "./CompanyHeader";
import SalarySummary from "./SalarySummary";
import EmployeeInfo from "./EmployeeInfo";
import EarningsSection from "./EarningsSection";
import DeductionsSection from "./DeductionsSection";
import NetPaySummary from "./NetPaySummary";
import {
  IEmployeePayroll,
  IPayslipUser,
  PayslipProps,
} from "../../../../../types/employee/employee-payslip.types";
import Button from "../../../../common/button/Button";
import TopBar from "../../../../common/topbar/TopBar";
import { useLocation, useNavigate } from "react-router-dom";
import { formatMonthYear } from "../../../../../utils/date-format";
import { useReactToPrint } from "react-to-print";

const PayslipDownload: React.FC<PayslipProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    employeePayroll,
    employee,
  }: {
    employeePayroll: IEmployeePayroll;
    employee: IPayslipUser;
  } = location.state;

  const contentRef = useRef<HTMLDivElement>(null);
  const fileName =
    `Payslip_${employee.firstName}${employee.lastName}_${formatMonthYear(
      employeePayroll.payrollMonth,
      employeePayroll.payrollYear,
    )}`.replace(/[^a-zA-Z0-9-_]/g, "_");

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: fileName,
  });
  const data: any = {
    company: {
      name: "Ieka Digital LLP",
      address:
        "Office No. 78, Poojan Complex, New India Colony, Nikol, Ahmedabad, Gujarat 380049",
      logo: "/images/company-logo.png",
    },

    attendance: {
      paidDays: 30,
      lopDays: 0,
    },
  };

  // handle close
  const handleClose = () => {
    navigate(-1);
  };

  // handleDownloadPdfClick
  const handleDownloadPdfClick = () => {
    reactToPrintFn();
  };
  return (
    <>
      <TopBar
        title="Salary Disclaimer"
        actionButtons={
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="danger"
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger" />}
            />
          </div>
        }
        isPdf
        handleDownloadPdfClick={handleDownloadPdfClick}
      />
      <div className="content-area bg-dashboardBg">
        <div
          className="
          mx-auto
          w-full
          max-w-4xl
          min-h-[calc(100vh-100px)]
          bg-white
          px-4
          py-5
          shadow-sm
          sm:px-7
          sm:py-6
          print:max-w-none
          print:shadow-none
          print:min-h-screen
        "
          ref={contentRef}
        >
          {/* Company */}
          <CompanyHeader company={data.company} />

          {/* Salary Summary */}
          <SalarySummary
            month={formatMonthYear(
              employeePayroll.payrollMonth,
              employeePayroll.payrollYear,
            )}
            netPay={employeePayroll.totals.netPayAmount}
            paidDays={data.attendance.paidDays}
            lopDays={data.attendance.lopDays}
          />

          {/* Employee */}
          <EmployeeInfo employee={employee} />

          {/* Earnings + Deductions */}
          <div className="mt-7 grid grid-cols-1 print:grid-cols-2 gap-8 sm:mt-10 sm:gap-10 md:grid-cols-2">
            <EarningsSection
              earnings={employeePayroll.salaryBreakdown.filter(
                (ele) => !ele.isDeduction,
              )}
              totals={employeePayroll.totals}
            />

            <DeductionsSection
              deductions={employeePayroll.salaryBreakdown.filter(
                (ele) => ele.isDeduction,
              )}
              totals={employeePayroll.totals}
            />
          </div>

          {/* Net Pay */}
          {/* Net Pay */}
          <div className="mt-auto pt-8">
            <NetPaySummary
              grossEarnings={employeePayroll.totals.netPayAmount}
              totalDeductions={employeePayroll.totals.deductionsAmount}
              netPay={employeePayroll.totals.netPayAmount}
            />
          </div>
          {/* <NetPaySummary
            grossEarnings={employeePayroll.totals.netPayAmount}
            totalDeductions={employeePayroll.totals.deductionsAmount}
            netPay={employeePayroll.totals.netPayAmount}
          /> */}
        </div>
      </div>
    </>
  );
};

export default PayslipDownload;
