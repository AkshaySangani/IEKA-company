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
  IUserDetails,
  PayslipProps,
} from "../../../../../types/employee/employee-payslip.types";
import Button from "../../../../common/button/Button";
import TopBar from "../../../../common/topbar/TopBar";
import { useLocation, useNavigate } from "react-router-dom";
import { formatMonthYear } from "../../../../../utils/date-format";
import { useReactToPrint } from "react-to-print";
import { generatePayslipPdf } from "../../../../../utils/generate-payslip-pdf";
import useDevice from "../../../../../hooks/useDevice";

const PayslipDownload: React.FC<PayslipProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {isDesktop} = useDevice();

  const {
    employeePayroll,
    employee,
    userDetails,
  }: {
    employeePayroll: IEmployeePayroll;
    employee: IPayslipUser;
    userDetails: IUserDetails;
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

  // handle close
  const handleClose = () => {
    navigate(-1);
  };

  // handle download pdf
  const handleDownloadPdf = async () => {
    alert("Hello")
    const fileName =
      `Payslip_${employee.firstName}_${employee.lastName}_${employeePayroll.payrollMonth}`.replace(
        /[^a-zA-Z0-9-_]/g,
        "_",
      ) + ".pdf";
    if (contentRef.current) {
      await generatePayslipPdf(contentRef.current, fileName);
    }
  };

  // handleDownloadPdfClick
  const handleDownloadPdfClick = async () => {
    reactToPrintFn();
  };
  return (
    <>
      <TopBar
        title="Salary Disclaimer"
        actionButtons={
          <div className="flex items-center gap-3">
            <i
              className="fa-solid fa-download text-[24px] text-grayText"
              onClick={handleDownloadPdf}
            />
            <Button
              size="sm"
              variant="danger"
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger" />}
            />
          </div>
        }
        isPdf={isDesktop}
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
          <CompanyHeader company={employee.companyId} />

          {/* Salary Summary */}
          <SalarySummary
            month={formatMonthYear(
              employeePayroll.payrollMonth,
              employeePayroll.payrollYear,
            )}
            netPay={employeePayroll.totals.netPayAmount}
          />

          {/* Employee */}
          <EmployeeInfo employee={employee} userDetails={userDetails} />

          {/* Earnings + Deductions */}
          <div className="mt-7 grid grid-cols-2 print:grid-cols-2 gap-3 sm:mt-10 sm:gap-10 md:grid-cols-2">
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
          <div className="mt-auto pt-8">
            <NetPaySummary
              grossEarnings={employeePayroll.totals.netPayAmount}
              totalDeductions={employeePayroll.totals.deductionsAmount}
              netPay={employeePayroll.totals.netPayAmount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PayslipDownload;
