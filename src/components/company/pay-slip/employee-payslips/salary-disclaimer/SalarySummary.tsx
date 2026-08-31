import React from "react";
import { formatCurrency } from "../../../../../utils/helper";

interface SalarySummaryProps {
  month: string;
  netPay: number;
  paidDays: number;
  lopDays: number;
}

const SalarySummary: React.FC<SalarySummaryProps> = ({
  month,
  netPay,
  paidDays,
  lopDays,
}) => {
  return (
    <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Payslip Month */}
      <div className="min-w-0">
        <p className="text-base font-medium text-secondary sm:text-lg">
          Payslip for the month of {month}
        </p>
      </div>

      {/* Net Pay */}
      <div className="text-left sm:text-right">
        <p className="text-xs font-medium text-secondary sm:text-sm">
          Total Net Pay
        </p>

        <p className="mt-1 text-2xl font-bold text-secondary sm:text-3xl">
          {formatCurrency(netPay)}
        </p>

        {/* <p className="mt-1 text-[11px] text-grayText sm:mt-2 sm:text-xs">
          Paid Days : {paidDays} | LOP Days : {lopDays}
        </p> */}
      </div>
    </div>
  );
};

export default SalarySummary;
